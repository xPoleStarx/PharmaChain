// 🔧 EMERGENCY FIX: Clear Cached User Data
// Paste this into your browser console and press Enter

console.log('🧹 Clearing cached user data...');

// Clear all PharmaChain localStorage
localStorage.removeItem('pharmachain_current_user');
localStorage.removeItem('pharmachain_ledger');

// Clear all localStorage (nuclear option)
// localStorage.clear();

console.log('✅ Cache cleared!');
console.log('🔄 Reloading page...');

// Force reload
window.location.reload();
