import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// 👇 Add this line
// Fix Leaflet default icon issues in React/Vite apps
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';


createRoot(document.getElementById("root")!).render(<App />);

