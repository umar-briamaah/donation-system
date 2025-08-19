// Simple script to clear authentication tokens
// Run this in the browser console if you're experiencing token issues

console.log('🔐 Clearing authentication tokens...');

// Clear localStorage tokens
localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken');

console.log('✅ Tokens cleared from localStorage');
console.log('🔄 Please refresh the page and login again');

// Optional: Redirect to login page
// window.location.href = '/account/login';
