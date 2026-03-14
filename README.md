# Smart Waste Management System - Frontend

A modern, eco-friendly frontend application for waste management coordination with beautiful UI and mock functionality.

## 🚀 Features

- **Mock Authentication**: Simulated login/register system for residents and workers
- **Role-Based Dashboards**: Different views for residents and municipal workers
- **Resident Registration**: Mock registration with area selection
- **Schedule Display**: Static schedule information for different areas
- **Mock Notifications**: Sample notifications for workers
- **Persistent Sessions**: Stay logged in across browser sessions using localStorage
- **Beautiful UI**: Modern design with gradients, animations, and eco-friendly colors
- **Responsive Design**: Works perfectly on desktop and mobile devices

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with Google Fonts and Font Awesome icons
- **Storage**: localStorage for session management

## 📁 Project Structure

```
smart-waste-management-frontend/
├── index.html          # Landing page
├── login.html          # Authentication page (login/register)
├── resident.html       # Resident dashboard
├── worker.html         # Municipal worker dashboard
├── style.css           # Beautiful, modern stylesheet
├── script.js           # Frontend JavaScript with mock functionality
└── package.json        # Project metadata
```

## 🚀 Getting Started

### Prerequisites

- Modern web browser with JavaScript enabled

### Installation

1. **Clone or download the project**
   ```bash
   cd path/to/project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

2. **Open index.html in your browser**
   ```
   Double-click index.html or open it with your preferred browser
   ```

## 🔐 Mock Authentication System

### User Types
- **Residents**: Mock registration with name, email, password, and area selection
- **Municipal Workers**: Mock registration with name, email, and password

### Features
- **Registration**: Mock user creation (accepts any input)
- **Login**: Mock login (accepts any credentials)
- **Session Management**: Automatic login on return visits using localStorage
- **Logout**: Secure sign-out functionality

## 📱 Usage

### For Residents
1. Register or login as a resident
2. View your profile information
3. Check waste collection schedule for your area

### For Municipal Workers
1. Register or login as a worker
2. View schedules for all areas
3. See recent notifications and activity
4. Schedule pickups (mock functionality)

## 🎨 UI Features

The application uses a JSON file (`database.json`) for data persistence:

```json
{
  "users": [
    {
      "id": "1234567890",
      "name": "John Doe",
      "email": "john@example.com",
      "password": "hashed_password",
      "role": "resident",
      "area": "Block A",
      "registeredAt": "2026-03-13T10:00:00.000Z"
    }
  ],
## 🎨 Design Features

- **Eco-friendly color palette**: Greens and earth tones
- **Modern gradients**: Beautiful background gradients throughout
- **Smooth animations**: Fade-in effects and hover transitions
- **Glassmorphism**: Backdrop blur effects on cards
- **Typography**: Poppins font for modern, clean text
- **Icon integration**: Font Awesome icons with animations
- **Card-based layout**: Elevated cards with soft shadows
- **Responsive grid**: Adapts beautifully to different screen sizes
- **Interactive elements**: Hover effects and micro-animations

## 🔧 Usage Guide

### For Residents:
1. **Register**: Create mock account with name, email, password, and select area
2. **Login**: Use any email and password to sign in
3. **View Schedule**: See sample waste collection schedule
4. **View Profile**: See your mock profile information
5. **Logout**: Securely sign out when done

### For Municipal Workers:
1. **Register**: Create mock account with name, email, and password
2. **Login**: Use any credentials to access dashboard
3. **View Schedules**: See sample schedules for all areas
4. **Schedule Pickups**: Mock scheduling functionality
5. **Monitor Activity**: View sample notifications and changes
6. **Logout**: Sign out securely

## 🚀 Deployment

This is a static frontend application that can be deployed to any web server or static hosting service like:

- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting
- Any traditional web server (Apache, Nginx)

Simply upload the HTML, CSS, and JS files to your hosting provider.

## 📝 License

MIT License - feel free to use for your hackathon project!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Built for Hackathon 2026** | Smart Cities Initiative | Modern Web Technologies