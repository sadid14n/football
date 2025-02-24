import { Route, Routes } from "react-router-dom";
import "./App.css";
import Admin from "./pages/Admin";
import { GameProvider } from "./context/GameContext";
import ReactGA from "react-ga4";
import { useEffect } from "react";

const TRACKING_ID = "G-Z1SMDCG39L";
function App() {
  useEffect(() => {
    ReactGA.initialize(TRACKING_ID, { debug: true });
    ReactGA.send("pageview"); // Ensures the first page load is tracked
  }, []);
  return (
    <GameProvider>
      <Routes>
        <Route path="/" element={<Admin />} />
      </Routes>
    </GameProvider>
  );
}

export default App;
