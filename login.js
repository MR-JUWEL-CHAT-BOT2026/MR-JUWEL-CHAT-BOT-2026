const login = require('sahu-fca');
const fs = require('fs');

console.log('🔐 Loading AppState...\n');

// appstate.json থেকে লোড
let appState = [];
try {
    if (!fs.existsSync('./appstate.json')) {
        console.log('❌ appstate.json not found!');
        console.log('📌 Please upload your appstate.json file');
        process.exit(1);
    }
    appState = JSON.parse(fs.readFileSync('./appstate.json', 'utf8'));
    console.log('✅ AppState loaded successfully');
} catch (e) {
    console.log('❌ Error loading appstate:', e.message);
    process.exit(1);
}

console.log('🔄 Logging in with AppState...');

// শুধু appState দিয়ে লগইন
login({ 
    appState: appState,
    forceLogin: true,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}, (err, api) => {
    if (err) {
        console.log('❌ Login Error:', err);
        console.log('🔄 AppState expired! Please create new appstate.json');
        process.exit(1);
    }
    
    console.log('✅ Login Success!');
    console.log(`👤 User ID: ${api.getCurrentUserID()}`);
    
    // নতুন appstate সেভ (রিফ্রেশ)
    const newAppState = api.getAppState();
    fs.writeFileSync('./appstate.json', JSON.stringify(newAppState, null, 2));
    console.log('✅ AppState refreshed and saved!');
    
    console.log('\n🎯 You can now run: node Juwel.js');
});
