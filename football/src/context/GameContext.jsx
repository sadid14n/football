import { createContext, useContext, useState, useEffect } from "react";
import { teamData } from "../data/teamData";

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [teams, setTeams] = useState(teamData);

  const [match, setMatch] = useState({
    teamA: "",
    teamB: "",
    score: { teamA: 0, teamB: 0 },
    finalDecision: { teamA: "", teamB: "" },
  });

  const [isMatchRunning, setIsMatchRunning] = useState(false);
  const [matchStats, setMatchStats] = useState({});

  return (
    <GameContext.Provider
      value={{
        teams,
        setTeams,
        match,
        setMatch,
        matchStats,
        setMatchStats,
        isMatchRunning,
        setIsMatchRunning,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
