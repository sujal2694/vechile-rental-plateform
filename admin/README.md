# MotiveRide Admin Panel

Welcome to the MotiveRide Admin Dashboard! This is a comprehensive admin panel for managing your vehicle rental business.

## 🚀 Getting Started

### Installation

```bash
cd admin
npm install
```

### Development Server

```bash
npm run dev
```

The admin panel will run on **http://localhost:3001**

## 📋 Features

### Dashboard
- Overview of total vehicles, bookings, users, and revenue
- Recent bookings summary
- Quick statistics and metrics

### Vehicles Management
- View all vehicles in your inventory
- Add new vehicles with details (name, category, price, seats, fuel type, transmission)
- Edit existing vehicle information
- Delete vehicles from inventory
- Support for different categories: Economy, Premium, Luxury

### Bookings Management
- View all customer bookings
- Filter bookings by status (Pending, Confirmed, Completed, Cancelled)
- Update booking status
- View customer details and rental dates
- Track total cost for each booking

### Messages Management
- View all customer inquiries and contact form submissions
- Read detailed messages from users
- Reply via email directly
- Delete messages

### Users Management
- View all registered users
- See user roles (admin/user)
- Track user registration dates
- Monitor user activity

## 🔐 Authentication

### Login as Admin

1. Visit **http://localhost:3001**
2. Choose **Login** tab
3. Enter admin email and password
4. You're authenticated and can access the dashboard

### Create Admin Account

1. Visit **http://localhost:3001**
2. Choose **Sign Up** tab
3. Fill in your details:
   - Full Name
   - Email
   - Password
   - Confirm Password
4. Click "Create Admin Account"
5. You'll be redirected to the dashboard

**Note:** Admins and regular users use the same authentication endpoint. The role is determined at registration time and cannot be changed afterward.

## 🎨 Theme

The admin panel uses the same color scheme as the client application:
- **Primary Color:** Orange (#f97316)
- **Background:** Light Gray (#f9fafb)
- **Text:** Dark Gray (#1f2937)

All interfaces are fully responsive and work seamlessly on mobile, tablet, and desktop devices.

## 🔄 API Integration

The admin panel connects to the same backend API as the client:
- Base URL: `http://localhost:5000/api`
- Authentication: Bearer token in Authorization header
- All requests are secured with JWT tokens

## 📱 Responsive Design

- ✅ Fully responsive sidebar (collapses on mobile)
- ✅ Mobile-friendly navigation
- ✅ Optimized tables for all screen sizes
- ✅ Touch-friendly buttons and controls
- ✅ Smooth animations and transitions

## 🛠️ Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## 📦 Technologies Used

- **Next.js 14** - React framework
- **Tailwind CSS** - Styling
- **React Hooks** - State management
- **API Service Layer** - Centralized API calls
- **Boxicons** - Icons

## 🔗 Links

- **Client App:** http://localhost:3000
- **Admin Panel:** http://localhost:3001
- **Backend API:** http://localhost:5000

## 🚀 Production Deployment

### Before Deploying

```env
NEXT_PUBLIC_API_URL=https://your-production-api.com/api
```

### Deploy to Vercel

```bash
npm run build
vercel deploy
```

### Deploy to Other Platforms

- Netlify
- AWS Amplify
- DigitalOcean
- Railway
- Heroku

## 📞 Support

For issues or questions about the admin panel, contact the development team.

## 📄 License

This project is part of the MotiveRide Vehicle Rental Platform.
