import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Admin from "./pages/Admin";
import { GameProvider } from "./context/GameContext";
import ReactGA from "react-ga4";
import { useEffect } from "react";

const trackingId = import.meta.env.VITE_GA_TRACKING_ID;

// Track page views when route changes
function TrackPageViews() {
  const location = useLocation();

  useEffect(() => {
    if (trackingId) {
      ReactGA.send({ hitType: "pageview", page: location.pathname });
    }
  }, [location]);

  return null;
}
function App() {
  useEffect(() => {
    if (trackingId) {
      ReactGA.initialize(trackingId);
    }
  }, []);

  return (
    <GameProvider>
      <TrackPageViews />
      <Routes>
        <Route path="/" element={<Admin />} />
      </Routes>
    </GameProvider>
  );
}

export default App;
