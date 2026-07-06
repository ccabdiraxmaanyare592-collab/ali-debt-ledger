import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';

const ALI_ADMIN_PASSWORD = "AliAdmin2026"; 

const firebaseConfig = typeof __firebase_config !== 'undefined' 
  ? JSON.parse(__firebase_config) 
  : { apiKey: "", authDomain: "default-app.firebaseapp.com", projectId: "default-app", storageBucket: "default-app.appspot.com", messagingSenderId: "12345", appId: "12345" }; 

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'debt-manager-dashboard'; 

export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('login'); 
  const [notification, setNotification] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [allTenantShops, setAllTenantShops] = useState([{ id: 'demo-1', name: 'Demo Test Shop', code: 'demo77', monthlyRent: 25.00, status: 'Active' }]);
  const [shopkeeperCodeInput, setShopkeeperCodeInput] = useState('');
  const [activeShopProfile, setActiveShopProfile] = useState(null);
  const [debts, setDebts] = useState([]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) { console.error(error); }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPasswordInput === ALI_ADMIN_PASSWORD) {
      setCurrentView('admin');
      setAdminPasswordInput('');
    } else {
      alert("Access Denied");
    }
  };

  const handleShopkeeperLogin = (e) => {
    e.preventDefault();
    const cleanCode = shopkeeperCodeInput.trim().toLowerCase();
    const foundShop = allTenantShops.find(s => s.code.toLowerCase() === cleanCode);
    if (!foundShop) {
      alert("Access Code not found.");
      return;
    }
    setActiveShopProfile(foundShop);
    setCurrentView('shopkeeper');
  };

  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
        <h1 className="text-xl font-bold mb-6">Ali's Debt Network</h1>
        <form onSubmit={handleShopkeeperLogin} className="w-full max-w-sm space-y-4">
          <input 
            type="text" 
            placeholder="Shop Access Code (demo77)" 
            value={shopkeeperCodeInput} 
            onChange={e => setShopkeeperCodeInput(e.target.value)} 
            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl"
          />
          <button type="submit" className="w-full py-3 bg-indigo-600 rounded-xl font-bold">Access Dashboard</button>
        </form>
        <div className="mt-8 pt-4 border-t border-slate-800 w-full max-w-sm">
          <input type="password" placeholder="Admin PIN" value={adminPasswordInput} onChange={e => setAdminPasswordInput(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded mb-2 text-xs" />
          <button onClick={handleAdminLogin} className="w-full py-2 bg-slate-800 text-xs rounded">Admin Entry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-black">Welcome, {activeShopProfile?.name}</h1>
      <p className="text-slate-500">Shop Dashboard active.</p>
    </div>
  );
}
