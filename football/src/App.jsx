import { Route, Routes } from "react-router-dom";
import "./App.css";
import Admin from "./pages/Admin";
import { GameProvider } from "./context/GameContext";
import ReactGA from "react-ga4";

function App() {
  useEffect(() => {
    ReactGA.initialize("G-DBR1NEKYL5");
    ReactGA.send("pageview");
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
