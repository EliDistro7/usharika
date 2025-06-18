
import { FaHandHoldingHeart, FaChurch, FaGraduationCap, FaCoins } from "react-icons/fa";
import { Cinzel, Playfair_Display, Cormorant_Garamond } from "next/font/google";

// Font declarations
export const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["700", "900"],
});

export const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Blue-Purple Color Scheme (No reddish tones)
export const colors = {
  primary: "#3b82f6",        // Blue-500
  primaryDark: "#2563eb",    // Blue-600
  secondary: "#8b5cf6",      // Violet-500 (pure purple)
  secondaryDark: "#7c3aed",  // Violet-600
  accent: "#06b6d4",         // Cyan-500
  success: "#10b981",        // Emerald-500
  background: "#f8fafc",     // Slate-50
  surface: "#ffffff",        // White
  surfaceElevated: "#f1f5f9", // Slate-100
  text: "#1e293b",          // Slate-800
  textSecondary: "#64748b",  // Slate-500
  border: "#e2e8f0",        // Slate-200
  borderFocus: "#3b82f6",   // Blue-500
  gradient: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
  gradientCard: "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)",
  modalOverlay: "rgba(30, 41, 59, 0.8)",
};

export const paymentOptions = [
  { id: "mpesa", name: "MPESA", number: "255-123-456-789", icon: "💳" },
  { id: "tigopesa", name: "TIGOPESA", number: "255-987-654-321", icon: "📱" },
  { id: "airtel", name: "AIRTEL MONEY", number: "255-567-890-123", icon: "💰" },
  { id: "halopesa", name: "HALOPESA", number: "255-456-789-012", icon: "🏦" },
  { id: "bank", name: "Bank Account", number: "Bank XYZ, Acc: 123456789", icon: "🏛️" },
];

export const donationOptions = [
  { 
    id: 1, 
    title: "Maboresho ya Kanisa", 
    description: "Tuungane mkono wapendwa kuboresha kanisa letu", 
    icon: <FaChurch size={32} />,
    gradient: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
    target: "40,000,000"
  },
  { 
    id: 2, 
    title: "Sadaka ya Mabenchi", 
    description: "Tunaomba washarika mmalizie ahadi zenu za kuongeza mabenchi kwenye kanisa letu", 
    icon: <FaGraduationCap size={32} />,
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)",
    target: "25,000,000"
  },
  { 
    id: 3, 
    title: "Diakonia", 
    description: "Wiki tutatembelea kitu cha mwane kuwaona watoto, shiriki nasi baraka hizi kwa sadaka yako ya hali na mali", 
    icon: <FaHandHoldingHeart size={32} />,
    gradient: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
    target: "6,000,000"
  },
  { 
    id: 4, 
    title: "Kulipa Deni", 
    description: "Tuungane pamoja ili kumaliza deni letu la kanisa kabla ya mwaka huu kuisha.", 
    icon: <FaCoins size={32} />,
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)",
    target: "30,000,000"
  },
];

// Utility Functions
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
  }).format(amount);
};