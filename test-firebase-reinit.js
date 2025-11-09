import { initializeApp, deleteApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Force delete all existing Firebase instances
getApps().forEach(app => deleteApp(app));

// Reinitalize with verified configuration
const firebaseConfig = {
    apiKey: "AIzaSyAe2HsM_7O5K6rwwcS2kJ1t-TarHwG6EO8",
    authDomain: "studio-739867195-29436.firebaseapp.com",
    projectId: "studio-739867195-29436",
    storageBucket: "studio-739867195-29436.firebasestorage.app",
    messagingSenderId: "27840457217",
    appId: "1:27840457217:web:3f5333f174ae8ee740ee00"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

console.log('✅ Firebase Reinitialized:', auth.app.name);
