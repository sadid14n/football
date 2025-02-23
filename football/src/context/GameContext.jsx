import { createContext, useContext, useState, useEffect } from "react";
import { teamData } from "../data/teamData";

const initializePlayers = () => {
  const players = [];
  for (const teamKey in teamData) {
    const team = teamData[teamKey];
    team.players.forEach((playerName) => {
      players.push({
        name: playerName,
        team: team.name,
        goals: 0,
        assists: 0,
        fouls: 0,
      });
    });
  }
  return players;
};

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [players, setPlayers] = useState(initializePlayers);
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
        players,
        setPlayers,
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
