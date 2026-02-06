# 🚀 Quick Start Guide - HopePlates Enhanced Platform

## What's New? 🎉

Your HopePlates platform now has:
- ✅ **Location-based matching** - GPS coordinates with distance calculation
- ✅ **Reliability scoring** - NGOs rated on performance
- ✅ **Smart auto-matching** - Best NGO suggestions for each donation
- ✅ **NGO registration** - Self-service onboarding
- ✅ **Impact analytics** - Real-time SDG metrics
- ✅ **Advanced filtering** - By distance, food type, and status
- ✅ **Your UI preserved** - All your original styling intact!

## 📦 Installation (3 Steps)

### Step 1: Install Node.js
If you don't have Node.js, download from: https://nodejs.org/

### Step 2: Install Dependencies
Open terminal in project folder and run:
```bash
npm install
```

### Step 3: Start Server
```bash
npm start
```

Then open: http://localhost:5000

## 🎮 Testing the Platform

### Test Flow 1: Complete Donation Cycle
1. **As Donor** (login: donor@test.com / 1234)
   - Go to donor dashboard
   - Click "Use My Current Location" or enter GPS manually
   - Fill donation form: 50 people, Veg, Cooked Meal
   - Submit → See matched NGOs with distances!

2. **As NGO** (login: ngo@test.com / 1234)
   - See the new donation appear
   - Notice the distance badge (green if close)
   - Click "Accept Pickup"
   - Click "Mark Picked Up"
   - Click "Mark Delivered" → Enter recipient details
   - Watch your reliability score update!

3. **View Impact**
   - Go to `/analytics.html`
   - See metrics update in real-time
   - Check SDG contributions
   - View NGO leaderboard

### Test Flow 2: Register New NGO
1. Go to `/ngo-register.html`
2. Fill form with your NGO details
3. Use "Use My Current Location" for GPS
4. Set service radius (e.g., 15km)
5. Register → Auto-creates login credentials
6. Login and start accepting donations!

## 📍 Getting GPS Coordinates

### Method 1: Browser Geolocation (Easiest)
- Click "Use My Current Location" button
- Allow browser location access
- Coordinates auto-filled!

### Method 2: Google Maps
1. Open Google Maps
2. Right-click your location
3. Click the coordinates that appear
4. Copy and paste into form

### Method 3: Manual Entry
Chennai examples:
- T. Nagar: 13.0418, 80.2341
- Velachery: 12.9750, 80.2200
- Porur: 13.0358, 80.1569
- Ramapuram: 13.0344, 80.1846

## 🎯 Key Features to Explore

### 1. Smart Matching Algorithm
When you submit a donation, watch for:
- "🎯 Matched NGOs" section appears
- Shows top 3 NGOs sorted by compatibility
- Displays distance and reliability score
- Green badge = highly reliable, yellow = reliable

### 2. Distance Filtering
In NGO dashboard:
- Filter "Within 5km" → Shows only nearby donations
- Filter "Within 10km" → Expands search
- Green badge: ≤5km, Yellow: 5-10km, Red: >10km

### 3. Reliability Scoring
- New NGOs start at 100%
- Decreases if pickups not completed
- Decreases if deliveries late
- Shown on NGO dashboard header
- Affects matching priority

### 4. Impact Tracking
Analytics dashboard shows:
- Total meals served (sum of people fed)
- Completion rate (delivered/total)
- NGO rankings (by deliveries)
- Recent activity feed
- SDG contribution calculations

## 🗂️ File Overview

**Must Have (Core):**
- `server.js` - Backend with matching logic
- `data.json` - Database with sample data
- `package.json` - Dependencies
- `style.css` - Your original styles

**HTML Pages:**
- `index.html` - Landing page
- `login.html` - Login with role selection
- `event-dashboard.html` - Donor dashboard
- `Ngo-dashboard.html` - NGO dashboard
- `ngo-register.html` - NGO registration
- `analytics.html` - Impact dashboard

**Assets:**
- `hero.jpeg` - Hero image
- `login-bg.png` - Background

## 🔧 Configuration

### Change Port (default 5000):
In `server.js`, line 5:
```javascript
const PORT = 5000; // Change to 3000, 8080, etc.
```

### Add More Sample Data:
Edit `data.json`:
- Add users to `users` array
- Add NGOs to `ngos` array
- Add donors to `donors` array

### Customize Distance Thresholds:
In `server.js`, function `findMatches`:
```javascript
if (distance <= 5) compatibilityScore += 50;  // Change 5 to other km
else if (distance <= 10) compatibilityScore += 35; // Change 10
```

## ❓ Troubleshooting

**Server won't start:**
- Make sure Node.js is installed: `node --version`
- Make sure you ran `npm install`
- Check if port 5000 is available

**Location button not working:**
- Allow location access in browser
- Use HTTPS in production (geolocation requires it)
- Fallback: Enter coordinates manually

**NGOs not seeing donations:**
- Check NGO location is set (lat/long required)
- Check service radius (default 20km)
- Check filters aren't too restrictive

**Matches not appearing:**
- Donations need GPS coordinates
- NGOs need GPS coordinates
- Check distance between them

## 📊 Understanding Compatibility Score

Total score = 100 points
- **Distance (50 points)**:
  - ≤5km: 50 points
  - 5-10km: 35 points
  - 10-20km: 20 points
  - >20km: 5 points
  
- **Reliability (50 points)**:
  - NGO's reliability % × 0.5
  - 100% reliability = 50 points
  - 80% reliability = 40 points

**Example:**
- NGO is 3km away (50 pts) + 90% reliable (45 pts) = **95 compatibility**
- NGO is 15km away (20 pts) + 100% reliable (50 pts) = **70 compatibility**

## 🎨 UI Customization

All your original CSS is preserved in `style.css`. 

To change colors:
```css
:root {
  --primary: #2f6f3e;  /* Main green */
  --bg: #a6d3a6;       /* Background */
}
```

## 🚀 Next Steps

1. **Test thoroughly** with different scenarios
2. **Add more NGOs** via registration
3. **Create real donations** with actual locations
4. **Monitor analytics** dashboard
5. **Customize** for your specific needs

## 💡 Pro Tips

- Use actual GPS coordinates for realistic distance calculations
- Register multiple test NGOs at different locations
- Create donations at various times to see activity feed
- Check analytics after each delivery to see impact grow
- Filter NGO dashboard by distance to prioritize nearby pickups

---

**Need Help?** Check the full README.md for detailed documentation!

**Found a Bug?** The platform is functional but can be enhanced further. See README for future enhancement ideas.

**Want to Deploy?** Consider:
- Heroku (easy)
- DigitalOcean (scalable)
- AWS/Azure (enterprise)
- Add environment variables for production

Enjoy your enhanced HopePlates platform! 🎉🍽️
