# HopePlates - Food Redistribution Platform 🍽️

A real-time web-based platform that reduces food waste by connecting event spaces with surplus food to nearby NGOs, orphanages, and old-age homes.

## 🌟 Key Features

### ✅ **Implemented Features**

1. **Location-Based Matching**
   - GPS coordinate capture for donors and NGOs
   - Haversine formula for accurate distance calculation
   - Proximity-based automatic matching (prioritizes NGOs within 5km, 10km, 20km)
   - Real-time "Use My Current Location" button

2. **Smart Matching Algorithm**
   - Compatibility scoring based on:
     - Distance (50% weight)
     - NGO reliability score (50% weight)
   - Auto-suggests top 3 matching NGOs when donor submits food
   - Filters for status, distance, and food type

3. **Reliability Scoring System**
   - Calculated based on:
     - Completion rate (60% weight)
     - On-time delivery rate (40% weight)
   - Displayed prominently on NGO profiles
   - New NGOs start at 100% reliability

4. **Role-Based Dashboards**
   - **Donor Dashboard**: Submit donations, track status, view impact statistics
   - **NGO Dashboard**: View available donations, filter by distance/type, manage pickups
   - **Analytics Dashboard**: Real-time impact metrics and SDG tracking

5. **Real-Time Status Tracking**
   - Available → Accepted → Picked Up → Delivered
   - Auto-refresh every 5 seconds
   - Status indicators with emojis

6. **Impact Analytics & SDG Alignment**
   - Tracks total meals served, donations, and deliveries
   - Measures impact on UN SDGs:
     - SDG 2: Zero Hunger
     - SDG 12: Responsible Consumption
     - SDG 17: Partnerships for the Goals
   - NGO leaderboard with rankings
   - Recent activity feed

7. **NGO Registration & Verification**
   - Self-registration with location capture
   - Service radius and capacity settings
   - Organization type categorization

## 📁 File Structure

```
hopeplates/
├── server.js                 # Enhanced Node.js backend with matching logic
├── data.json                 # JSON database with sample data
├── package.json              # Node dependencies
├── index.html                # Enhanced landing page
├── login.html                # Login page with role selection
├── event-dashboard.html      # Donor dashboard with location input
├── Ngo-dashboard.html        # NGO dashboard with proximity filtering
├── ngo-register.html         # NGO registration form
├── analytics.html            # Impact analytics dashboard
├── style.css                 # Your existing styles (preserved)
├── hero.jpeg                 # Hero image
└── login-bg.png              # Login background
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

3. **Access the Platform**
   Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## 🔐 Demo Credentials

**Food Donor:**
- Email: `donor@test.com`
- Password: `1234`

**NGO:**
- Email: `ngo@test.com`
- Password: `1234`

## 📊 API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/register` - NGO registration

### Donors
- `GET /api/donor` - Get all donations
- `GET /api/donor/:id` - Get specific donation
- `POST /api/donor` - Create new donation (auto-matches with NGOs)
- `PUT /api/donor/:id` - Update donation

### NGOs
- `GET /api/ngo` - Get all NGOs with reliability scores
- `GET /api/ngo/:id` - Get specific NGO
- `PUT /api/ngo/:id` - Update NGO profile

### Matching
- `GET /api/matches` - Get all matches
- `GET /api/matches/ngo/:ngoId` - Get matches for specific NGO
- `POST /api/matches/:id/accept` - Accept a match
- `POST /api/matches/:id/pickup` - Mark as picked up
- `POST /api/matches/:id/deliver` - Mark as delivered

### Analytics
- `GET /api/analytics` - Get platform-wide analytics and SDG metrics

## 🎯 How to Use

### As a Food Donor:
1. Register/Login at `/login.html`
2. Fill out the donation form with:
   - Event space details
   - Food type and quantity
   - Pickup time window
   - **Location (GPS coordinates)** - use "Use My Current Location" button
3. Submit and view matched NGOs
4. Track delivery status in real-time

### As an NGO:
1. Register at `/ngo-register.html` with:
   - Organization details
   - Service location and radius
   - Capacity and contact info
2. Login at `/login.html`
3. View available donations filtered by:
   - Distance from your location
   - Food type
   - Status
4. Accept pickups and update status through delivery

### View Impact:
- Visit `/analytics.html` for:
  - Real-time metrics dashboard
  - SDG impact tracking
  - NGO leaderboard
  - Recent activity feed

## 🔧 Technical Implementation

### Distance Calculation
Uses the **Haversine formula** to calculate great-circle distance between two GPS coordinates:
```javascript
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  // ... Haversine calculation
  return distance;
}
```

### Compatibility Scoring
Combines distance and reliability:
```javascript
// Distance scoring (max 50 points)
if (distance <= 5km) score += 50
else if (distance <= 10km) score += 35
else if (distance <= 20km) score += 20

// Reliability scoring (max 50 points)
score += reliabilityScore * 0.5
```

### Reliability Calculation
```javascript
completionRate = (completed / accepted) * 100
onTimeRate = (onTimeDeliveries / completed) * 100
reliabilityScore = (completionRate * 0.6) + (onTimeRate * 0.4)
```

## 🎨 UI/UX Preserved

All your original styling has been **completely preserved**:
- Green color scheme (`--primary: #2f6f3e`)
- Card-based layouts
- Responsive grid system
- Custom buttons and forms
- Typography and spacing

**Enhanced with:**
- Distance badges (color-coded by proximity)
- Match suggestions display
- Impact statistics cards
- Real-time filters
- Leaderboard rankings

## 🌍 Impact Tracking

The platform tracks:
- **Total meals served** - direct people count
- **Food saved** - quantity prevented from waste
- **Deliveries completed** - successful redistributions
- **Active NGOs** - verified partners
- **SDG contributions**:
  - Zero Hunger: meals provided to vulnerable
  - Responsible Consumption: food waste prevented
  - Partnerships: active NGO collaborations

## 📈 Future Enhancements (Recommendations)

1. **WebSocket Integration** - Real-time push notifications
2. **Email/SMS Notifications** - Using Twilio or SendGrid
3. **Map Visualization** - Integrate Google Maps for visual matching
4. **Photo Upload** - Food condition verification
5. **Rating System** - Donors can rate NGO performance
6. **Mobile App** - React Native companion app
7. **Advanced Analytics** - Charts with Chart.js or D3.js
8. **Multi-language Support** - i18n for accessibility

## 🐛 Known Limitations

1. **Session Management** - Currently uses localStorage (upgrade to JWT tokens)
2. **File Storage** - Using JSON file (migrate to MongoDB/PostgreSQL)
3. **No Authentication Guards** - Frontend routes not protected
4. **Manual Location Entry** - Geolocation requires user permission
5. **No Image Upload** - Food photos not yet supported

## 📝 What Changed from Your Original

### Backend (server.js)
- ✅ Added distance calculation
- ✅ Added reliability scoring
- ✅ Added auto-matching algorithm
- ✅ Added registration endpoint
- ✅ Fixed donor update logic
- ✅ Added analytics aggregation

### Frontend
- ✅ Added location input fields with GPS capture
- ✅ Added match suggestions display
- ✅ Added filtering system for NGOs
- ✅ Added impact statistics
- ✅ Created NGO registration page
- ✅ Created analytics dashboard
- ✅ Enhanced login with registration links
- ✅ **Preserved all your original CSS**

### Data Structure
- ✅ Added NGO profiles with location
- ✅ Added matches collection
- ✅ Added analytics object
- ✅ Added timestamps

## 🤝 Contributing

To add new features:
1. Follow the existing code structure
2. Update this README
3. Test with sample data
4. Maintain the green theme UI

## 📄 License

MIT License - Feel free to use and modify!

---

**Built with ❤️ for social impact | Aligned with UN SDGs 2, 12, 17**
