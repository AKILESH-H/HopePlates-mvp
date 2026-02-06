const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.static(__dirname));

const DATA_FILE = path.join(__dirname, 'data.json');

function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ 
      users: [], 
      donors: [], 
      ngos: [],
      matches: [],
      analytics: {
        totalMealsServed: 0,
        totalFoodSaved: 0,
        activeNGOs: 0,
        completedDeliveries: 0
      }
    }, null, 2));
  }
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}

// Calculate reliability score for NGO
function calculateReliabilityScore(ngo, data) {
  const ngoMatches = data.matches.filter(m => m.ngoId === ngo.id);
  
  if (ngoMatches.length === 0) return 100; // New NGOs start at 100
  
  const completedOnTime = ngoMatches.filter(m => 
    m.status === 'Delivered' && m.deliveredOnTime
  ).length;
  
  const totalCompleted = ngoMatches.filter(m => m.status === 'Delivered').length;
  const totalAccepted = ngoMatches.filter(m => m.status !== 'Available').length;
  
  // Factors: completion rate, on-time rate, acceptance rate
  const completionRate = totalAccepted > 0 ? (totalCompleted / totalAccepted) * 100 : 100;
  const onTimeRate = totalCompleted > 0 ? (completedOnTime / totalCompleted) * 100 : 100;
  
  return Math.round((completionRate * 0.6) + (onTimeRate * 0.4));
}

// Auto-match donors with nearby NGOs
function findMatches(donor, data) {
  if (!donor.latitude || !donor.longitude) return [];
  
  const availableNGOs = data.ngos.filter(ngo => 
    ngo.isActive && 
    ngo.latitude && 
    ngo.longitude
  );
  
  const matches = availableNGOs.map(ngo => {
    const distance = calculateDistance(
      donor.latitude, 
      donor.longitude, 
      ngo.latitude, 
      ngo.longitude
    );
    
    const reliabilityScore = calculateReliabilityScore(ngo, data);
    
    // Compatibility score based on distance and reliability
    let compatibilityScore = 0;
    
    // Distance scoring (closer is better)
    if (distance <= 5) compatibilityScore += 50;
    else if (distance <= 10) compatibilityScore += 35;
    else if (distance <= 20) compatibilityScore += 20;
    else compatibilityScore += 5;
    
    // Reliability scoring
    compatibilityScore += reliabilityScore * 0.5;
    
    return {
      ngo,
      distance: distance.toFixed(2),
      reliabilityScore,
      compatibilityScore: Math.round(compatibilityScore)
    };
  });
  
  // Sort by compatibility score
  return matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
}

/* ---------- AUTHENTICATION ---------- */
app.post('/api/login', (req, res) => {
  const { email, password, role } = req.body;
  const data = readData();

  const user = data.users.find(
    u => u.email === email && u.password === password && u.role === role
  );

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.json({ success: true, userId: user.id, role: user.role });
});

app.post('/api/register', (req, res) => {
  const data = readData();
  const { email, password, role, name, contactNumber, location, latitude, longitude } = req.body;
  
  // Check if user exists
  if (data.users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  
  const userId = 'user_' + Date.now();
  
  const newUser = {
    id: userId,
    email,
    password,
    role,
    createdAt: new Date().toISOString()
  };
  
  data.users.push(newUser);
  
  // If NGO, create NGO profile
  if (role === 'ngo') {
    const ngoId = 'ngo_' + Date.now();
    data.ngos.push({
      id: ngoId,
      userId,
      name,
      email,
      contactNumber,
      location,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      serviceRadius: 20, // default 20km
      capacity: 50, // default capacity
      isActive: true,
      reliabilityScore: 100,
      totalDeliveries: 0,
      createdAt: new Date().toISOString()
    });
  }
  
  writeData(data);
  res.json({ success: true, userId });
});

/* ---------- DONOR API ---------- */
app.get('/api/donor', (req, res) => {
  const data = readData();
  res.json(data.donors);
});

app.get('/api/donor/:id', (req, res) => {
  const data = readData();
  const donor = data.donors.find(d => d.id === req.params.id);
  
  if (!donor) {
    return res.status(404).json({ message: 'Donor not found' });
  }
  
  res.json(donor);
});

app.post('/api/donor', (req, res) => {
  const data = readData();
  const donor = req.body;
  
  // Generate unique ID
  donor.id = 'donor_' + Date.now();
  donor.createdAt = new Date().toISOString();
  donor.status = 'Available';
  
  data.donors.push(donor);
  
  // Find matching NGOs
  const matches = findMatches(donor, data);
  
  // Create match records for top 3 NGOs
  matches.slice(0, 3).forEach((match, index) => {
    data.matches.push({
      id: 'match_' + Date.now() + '_' + index,
      donorId: donor.id,
      ngoId: match.ngo.id,
      distance: match.distance,
      compatibilityScore: match.compatibilityScore,
      status: 'Suggested',
      createdAt: new Date().toISOString()
    });
  });
  
  writeData(data);
  res.json({ 
    success: true, 
    donor,
    suggestedNGOs: matches.slice(0, 3).map(m => ({
      name: m.ngo.name,
      distance: m.distance,
      reliability: m.reliabilityScore
    }))
  });
});

app.put('/api/donor/:id', (req, res) => {
  const data = readData();
  const index = data.donors.findIndex(d => d.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Donor not found' });
  }
  
  data.donors[index] = { ...data.donors[index], ...req.body };
  writeData(data);
  res.json({ success: true, donor: data.donors[index] });
});

/* ---------- NGO API ---------- */
app.get('/api/ngo', (req, res) => {
  const data = readData();
  
  // Calculate reliability scores
  const ngosWithScores = data.ngos.map(ngo => ({
    ...ngo,
    reliabilityScore: calculateReliabilityScore(ngo, data)
  }));
  
  res.json(ngosWithScores);
});

app.get('/api/ngo/:id', (req, res) => {
  const data = readData();
  const ngo = data.ngos.find(n => n.id === req.params.id);
  
  if (!ngo) {
    return res.status(404).json({ message: 'NGO not found' });
  }
  
  const reliabilityScore = calculateReliabilityScore(ngo, data);
  res.json({ ...ngo, reliabilityScore });
});

app.put('/api/ngo/:id', (req, res) => {
  const data = readData();
  const index = data.ngos.findIndex(n => n.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'NGO not found' });
  }
  
  data.ngos[index] = { ...data.ngos[index], ...req.body };
  writeData(data);
  res.json({ success: true, ngo: data.ngos[index] });
});

/* ---------- MATCHING API ---------- */
app.get('/api/matches', (req, res) => {
  const data = readData();
  res.json(data.matches);
});

app.get('/api/matches/ngo/:ngoId', (req, res) => {
  const data = readData();
  const ngoMatches = data.matches.filter(m => m.ngoId === req.params.ngoId);
  
  // Populate with donor details
  const matchesWithDetails = ngoMatches.map(match => {
    const donor = data.donors.find(d => d.id === match.donorId);
    return { ...match, donor };
  });
  
  res.json(matchesWithDetails);
});

app.post('/api/matches/:id/accept', (req, res) => {
  const data = readData();
  const matchIndex = data.matches.findIndex(m => m.id === req.params.id);
  
  if (matchIndex === -1) {
    return res.status(404).json({ message: 'Match not found' });
  }
  
  const match = data.matches[matchIndex];
  match.status = 'Accepted';
  match.acceptedAt = new Date().toISOString();
  
  // Update donor status
  const donorIndex = data.donors.findIndex(d => d.id === match.donorId);
  if (donorIndex !== -1) {
    data.donors[donorIndex].status = 'Accepted';
    data.donors[donorIndex].acceptedBy = match.ngoId;
  }
  
  writeData(data);
  res.json({ success: true, match });
});

app.post('/api/matches/:id/pickup', (req, res) => {
  const data = readData();
  const matchIndex = data.matches.findIndex(m => m.id === req.params.id);
  
  if (matchIndex === -1) {
    return res.status(404).json({ message: 'Match not found' });
  }
  
  const match = data.matches[matchIndex];
  match.status = 'Picked Up';
  match.pickedUpAt = new Date().toISOString();
  
  // Update donor status
  const donorIndex = data.donors.findIndex(d => d.id === match.donorId);
  if (donorIndex !== -1) {
    data.donors[donorIndex].status = 'Picked Up';
  }
  
  writeData(data);
  res.json({ success: true, match });
});

app.post('/api/matches/:id/deliver', (req, res) => {
  const data = readData();
  const matchIndex = data.matches.findIndex(m => m.id === req.params.id);
  
  if (matchIndex === -1) {
    return res.status(404).json({ message: 'Match not found' });
  }
  
  const match = data.matches[matchIndex];
  const { deliveredOnTime, recipientName, peopleServed } = req.body;
  
  match.status = 'Delivered';
  match.deliveredAt = new Date().toISOString();
  match.deliveredOnTime = deliveredOnTime !== false; // default true
  match.recipientName = recipientName;
  match.peopleServed = peopleServed;
  
  // Update donor status
  const donorIndex = data.donors.findIndex(d => d.id === match.donorId);
  if (donorIndex !== -1) {
    data.donors[donorIndex].status = 'Delivered';
  }
  
  // Update NGO stats
  const ngoIndex = data.ngos.findIndex(n => n.id === match.ngoId);
  if (ngoIndex !== -1) {
    data.ngos[ngoIndex].totalDeliveries = (data.ngos[ngoIndex].totalDeliveries || 0) + 1;
  }
  
  // Update analytics
  data.analytics.completedDeliveries = (data.analytics.completedDeliveries || 0) + 1;
  data.analytics.totalMealsServed = (data.analytics.totalMealsServed || 0) + (peopleServed || 0);
  
  writeData(data);
  res.json({ success: true, match });
});

/* ---------- ANALYTICS API ---------- */
app.get('/api/analytics', (req, res) => {
  const data = readData();
  
  const totalDonors = data.donors.length;
  const totalNGOs = data.ngos.length;
  const activeNGOs = data.ngos.filter(n => n.isActive).length;
  const completedDeliveries = data.matches.filter(m => m.status === 'Delivered').length;
  const totalMealsServed = data.matches
    .filter(m => m.status === 'Delivered')
    .reduce((sum, m) => sum + (m.peopleServed || 0), 0);
  
  // Calculate food saved (estimate)
  const totalFoodSaved = data.donors.reduce((sum, d) => {
    return sum + (parseInt(d.quantity) || 0);
  }, 0);
  
  res.json({
    totalDonors,
    totalNGOs,
    activeNGOs,
    completedDeliveries,
    totalMealsServed,
    totalFoodSaved,
    averageResponseTime: '15 mins', // Can calculate from timestamps
    sdgImpact: {
      zeroHunger: Math.round(totalMealsServed * 0.8),
      responsibleConsumption: Math.round(totalFoodSaved * 0.7),
      partnerships: totalNGOs
    }
  });
});

/* ---------- STATIC PAGES ---------- */
app.get('/', (req, res) => {
  const path = require('path');
  res.sendFile(path.join(__dirname, 'index.html'));

});

app.listen(PORT, () => {
  console.log(`🚀 HopePlates server running on http://localhost:${PORT}`);
  console.log(`📊 Data file: ${DATA_FILE}`);
});
