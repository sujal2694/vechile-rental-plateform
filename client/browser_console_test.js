/**
 * Quick test to check if the checkout API is working
 * Run this in browser console while on the checkout page
 */

// Check 1: Verify token is available
const token = localStorage.getItem('authToken');
console.log('🔐 Auth Token:', token ? '✅ Present' : '❌ Missing');

// Check 2: Test API connection
const testCheckoutAPI = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const testUrl = `${apiUrl}/bookings/create-checkout-session`;
  
  console.log('\n🔍 Testing Checkout API:\n');
  console.log(`API URL: ${testUrl}`);
  console.log(`Token Available: ${token ? 'Yes' : 'No'}\n`);
  
  // Test 1: Simple OPTIONS request (CORS preflight)
  try {
    const preflightResponse = await fetch(testUrl, {
      method: 'OPTIONS',
      headers: {
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'content-type,authorization',
      }
    });
    console.log(`✅ CORS Preflight: ${preflightResponse.status}`);
  } catch (err) {
    console.log(`❌ CORS Preflight Error: ${err.message}`);
  }

  // Test 2: Test actual POST with minimal data
  if (token) {
    try {
      const response = await fetch(testUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          cartItems: [{
            vehicleId: '69db8163fb5094f82309441f', // Test vehicle ID
            quantity: 1,
            rentalDays: 1,
            startDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            endDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
          }],
          successUrl: window.location.origin + '/success',
          cancelUrl: window.location.origin + '/cart',
        })
      });
      
      console.log(`\n📤 POST Request Status: ${response.status}`);
      
      const data = await response.json();
      console.log('Response:', data);
      
      if (data.success && data.url) {
        console.log('✅ Stripe URL:', data.url);
      } else {
        console.log('❌ Error:', data.message);
      }
      
    } catch (err) {
      console.log(`❌ Request Error: ${err.message}`);
    }
  }
};

// Run the test
testCheckoutAPI();

// Copy-paste this into browser console to diagnose payment issues
