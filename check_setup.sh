#!/bin/bash
# Comprehensive payment setup validation script

echo "🔍 Vehicle Rental Platform - Payment Setup Check"
echo "=================================================="
echo ""

# Check 1: Node is installed
echo "1️⃣  Checking Node.js..."
if command -v node &> /dev/null; then
    VERSION=$(node -v)
    echo "   ✅ Node.js $VERSION"
else
    echo "   ❌ Node.js not installed"
    exit 1
fi

# Check 2: Backend directory exists
echo ""
echo "2️⃣  Checking backend directory..."
if [ -d "backend" ]; then
    echo "   ✅ Backend directory found"
else
    echo "   ❌ Backend directory not found"
    exit 1
fi

# Check 3: Check if npm packages are installed
echo ""
echo "3️⃣  Checking dependencies..."
if [ -d "backend/node_modules" ]; then
    echo "   ✅ Backend dependencies installed"
else
    echo "   ⚠️  Backend dependencies missing. Run: cd backend && npm install"
fi

# Check 4: Check .env file
echo ""
echo "4️⃣  Checking environment configuration..."
if [ -f "backend/.env" ]; then
    echo "   ✅ .env file exists"
    
    # Check Stripe key
    if grep -q "STRIPE_SECRET_KEY=sk_test_" "backend/.env"; then
        echo "   ✅ Stripe test key configured"
    else
        echo "   ❌ Stripe key not properly configured"
    fi
    
    # Check MongoDB URI
    if grep -q "MONGODB_URI=" "backend/.env"; then
        echo "   ✅ MongoDB URI configured"
    else
        echo "   ❌ MongoDB URI not configured"
    fi
else
    echo "   ❌ .env file not found in backend"
fi

# Check 5: Check frontend env
echo ""
echo "5️⃣  Checking frontend configuration..."
if [ -f "client/.env.local" ]; then
    echo "   ✅ Frontend .env.local exists"
elif [ -f "client/.env" ]; then
    echo "   ✅ Frontend .env exists"
else
    echo "   ⚠️  Frontend .env file not found. Create: client/.env.local"
    echo "      Content:"
    echo "      NEXT_PUBLIC_API_URL=http://localhost:5000/api"
fi

echo ""
echo "=================================================="
echo ""
echo "📝 Quick Start Commands:"
echo ""
echo "Term 1 (Backend):"
echo "  cd backend"
echo "  npm install  # Only if needed"
echo "  npm start"
echo ""
echo "Term 2 (Frontend):"
echo "  cd client"
echo "  npm install  # Only if needed"
echo "  npm run dev"
echo ""
echo "Then visit: http://localhost:3000"
echo ""
