import { Route, Routes } from "react-router-dom";
import "./App.css";
import Admin from "./pages/Admin";
import { GameProvider } from "./context/GameContext";

function App() {
  return (
    <GameProvider>
      <Routes>
        <Route path="/" element={<Admin />} />
      </Routes>
    </GameProvider>
  );
}

export default App;
