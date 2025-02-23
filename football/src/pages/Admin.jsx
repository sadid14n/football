import { useState, useEffect } from "react";
import { useGame } from "../context/GameContext";
import { Table } from "antd";

const Admin = () => {
  const {
    teams,
    setTeams,
    match,
    setMatch,
    matchStats,
    setMatchStats,
    isMatchRunning,
    setIsMatchRunning,
  } = useGame();

  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [scorer, setScorer] = useState("");

  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [matchStatus, setMatchStatus] = useState("First Half");

  const [sortedLeaderBoard, setSortedLeaderBoard] = useState([]);

  const handleCreateMatch = () => {
    if (!teamA || !teamB || teamA === teamB) return;

    setMatch({
      teamA,
      teamB,
      score: { [teamA]: 0, [teamB]: 0 },
    });

    setMatchStats({
      [teamA]: { goals: [], fouls: 0, yellowCards: 0, redCards: 0 },
      [teamB]: { goals: [], fouls: 0, yellowCards: 0, redCards: 0 },
    });

    console.log("Match: ", match);
    console.log("Match Stats: ", matchStats);
    setIsMatchRunning(true);
  };

  const handleGoalUpdate = (team, goalScorer) => {
    if (!goalScorer || !team) return;

    setMatch((prevMatch) => ({
      ...prevMatch,
      score: {
        ...prevMatch.score,
        [team]: (prevMatch.score[team] || 0) + 1,
      },
    }));

    // Update match stats
    setMatchStats((prevStats) => ({
      ...prevStats,
      [team]: {
        ...prevStats[team],
        goals: [...(prevStats[team]?.goals || []), goalScorer], // Preserve previous goals
      },
    }));

    setTeams((prevTeams) => ({
      ...prevTeams,
      [team]: {
        ...prevTeams[team],
        goalsScored: (prevTeams[team]?.goalsScored || 0) + 1,
      },
    }));
    setScorer("");
  };

  const handleFoul = (team, card) => {
    if (!team || !card) return;

    setMatchStats((prevStats) => ({
      ...prevStats,
      [team]: {
        ...prevStats[team],
        [card]: (prevStats[team][card] || 0) + 1,
        fouls: prevStats[team].fouls + 1,
      },
    }));
  };

  const handleFinalMatch = () => {
    // Determine the match result
    const teamAResult =
      match.score.teamA > match.score.teamB
        ? "win"
        : match.score.teamA < match.score.teamB
        ? "lose"
        : "draw";
    const teamBResult =
      match.score.teamB > match.score.teamA
        ? "win"
        : match.score.teamB < match.score.teamA
        ? "lose"
        : "draw";

    // Set the final decisions in match state
    setMatch((prevMatch) => ({
      ...prevMatch,
      finalDecision: {
        teamA: teamAResult,
        teamB: teamBResult,
      },
    }));

    const updatedTeams = { ...teams };

    if (teamAResult === "win") {
      updatedTeams[match.teamA].points += 3;
    } else if (teamAResult === "draw") {
      updatedTeams[match.teamA].points += 1;
    }

    if (teamBResult === "win") {
      updatedTeams[match.teamB].points += 3;
    } else if (teamBResult === "draw") {
      updatedTeams[match.teamB].points += 1;
    }

    setTeams(updatedTeams);

    setIsMatchRunning(false);
    setSeconds(0);
    setMinutes(0);
    setIsPaused(true);

    alert(
      `Match Finalized!\n\n${match.teamA} ${match.score[match.teamA]} - ${
        match.score[match.teamB]
      }`
    );

    console.log("Match Finalized:", match);
    console.log("Updated Teams Points:", updatedTeams);
    console.log("Final Match Stats:", matchStats);
  };

  const handlePauseResume = () => {
    setIsPaused((prev) => !prev);
  };

  useEffect(() => {
    let interval;

    if (!isPaused) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          let newSeconds = prevSeconds + 1;
          let newMinutes = minutes;

          if (newSeconds === 60) {
            newSeconds = 0;
            newMinutes += 1;
            setMinutes(newMinutes);
          }

          if (newMinutes === 45 && newSeconds === 0) {
            setMatchStatus("⏸ Half-Time Break ⏳");
          }

          if (newMinutes === 46 && newSeconds === 0) {
            setMatchStatus("⚽ Second Half Started");
          }

          if (newMinutes === 90) {
            setMatchStatus("🏁 Full-Time");
            clearInterval(interval);
          }

          return newSeconds;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPaused]);

  const getLeaderBoard = () => {
    const leaderBoard = Object.keys(teams).map((teamKey) => ({
      name: teams[teamKey].name,
      goalsScored: teams[teamKey].goalsScored,
      wins: teams[teamKey].wins,
      draws: teams[teamKey].draws,
      losses: teams[teamKey].losses,
      points: teams[teamKey].points,
    }));

    // Sort by points first, then goalsScored in case of a tie in points
    leaderBoard.sort(
      (a, b) => b.points - a.points || b.goalsScored - a.goalsScored
    );

    setSortedLeaderBoard(leaderBoard);
  };

  useEffect(() => {
    getLeaderBoard();
  }, [teams]);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Admin Panel - Update Match</h1>

      <div className="mb-6">
        <h2 className="text-xl mb-2">Start a New Match</h2>

        <div className="flex md:flex-row flex-col gap-5">
          <select
            className="p-2 bg-gray-800"
            value={teamA}
            onChange={(e) => setTeamA(e.target.value)}
          >
            <option value="">Select Team A</option>
            {Object.keys(teams).map((team) => (
              <option key={team} value={team}>
                {teams[team].name}
              </option>
            ))}
          </select>

          <select
            className="p-2 bg-gray-800 ml-2"
            value={teamB}
            onChange={(e) => setTeamB(e.target.value)}
          >
            <option value="">Select Team B</option>
            {Object.keys(teams).map((team) => (
              <option key={team} value={team}>
                {teams[team].name}
              </option>
            ))}
          </select>

          <button
            className="ml-4 px-4 cursor-pointer py-2 bg-blue-500 rounded"
            onClick={handleCreateMatch}
          >
            Start Match
          </button>
        </div>
      </div>

      {match.teamA && match.teamB && (
        <div className="mb-6 p-4 bg-gray-800 rounded">
          <h2 className="text-xl font-semibold mb-2">Current Match</h2>
          <p className="text-lg flex items-center">
            {`${teams[match.teamA].name} `}
            {matchStats[match.teamA].yellowCards > 0 && (
              <span className="ml-2 text-yellow-400 mr-2">
                🟨 x {matchStats[match.teamA].yellowCards}
              </span>
            )}
            {matchStats[match.teamA].redCards > 0 && (
              <span className="ml-2 mr-2 text-red-500">
                🟥 x {matchStats[match.teamA].redCards}
              </span>
            )}
            vs {teams[match.teamB].name}
            {matchStats[match.teamB].yellowCards > 0 && (
              <span className="ml-2 text-yellow-400">
                🟨 x {matchStats[match.teamB].yellowCards}
              </span>
            )}
            {matchStats[match.teamB].redCards > 0 && (
              <span className="ml-2 text-red-500">
                🟥 x {matchStats[match.teamB].redCards}
              </span>
            )}
          </p>

          <p className="text-lg font-bold">
            Score: {match.score[teamA]} - {match.score[teamB]}
          </p>

          <h2 className="text-xl font-bold mb-2">Match Timer</h2>
          <p className="text-lg font-semibold">
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds} ⏳
          </p>

          <p className="text-xl font-semibold mt-2">{matchStatus}</p>
        </div>
      )}

      {match.teamA && match.teamB && (
        <div className="mb-6 p-4 bg-gray-800 rounded">
          <h2 className="text-xl font-semibold mb-2">Update Score</h2>

          <div className="flex md:flex-row flex-col gap-5">
            <select
              className="p-2 bg-gray-700"
              value={scorer}
              onChange={(e) => setScorer(e.target.value)}
            >
              <option value="">Select Player</option>
              {teams[match.teamA]?.players &&
                teams[match.teamB]?.players &&
                [
                  ...teams[match.teamA].players,
                  ...teams[match.teamB].players,
                ].map((player) => (
                  <option key={player} value={player}>
                    {player}
                  </option>
                ))}
            </select>

            <button
              className="ml-4 px-4 py-2 cursor-pointer bg-green-500 rounded"
              onClick={() => handleGoalUpdate(match.teamA, scorer)}
            >
              <span className="capitalize">Goal for {match.teamA}</span>
            </button>

            <button
              className="ml-4 cursor-pointer px-4 py-2 bg-red-500 rounded"
              onClick={() => handleGoalUpdate(match.teamB, scorer)}
            >
              <span className="capitalize">Goal for {match.teamB}</span>
            </button>
          </div>
        </div>
      )}

      {match.teamA && match.teamB && (
        <div className="mb-6 p-4 bg-gray-800 rounded">
          <h2 className="text-xl font-semibold mb-2">
            Update Match Statistics
          </h2>

          <div className="flex flex-col gap-5 md:flex-row">
            <button
              className="mr-4 px-4 py-2 cursor-pointer bg-yellow-500 rounded"
              onClick={() => handleFoul(match.teamA, "yellowCards")}
            >
              Yellow Card - {teams[match.teamA].name}
            </button>

            <button
              className="mr-4 px-4 py-2 cursor-pointer bg-yellow-500 rounded"
              onClick={() => handleFoul(match.teamB, "yellowCards")}
            >
              Yellow Card - {teams[match.teamB].name}
            </button>

            <button
              className="mr-4 px-4 py-2 cursor-pointer bg-red-600 rounded"
              onClick={() => handleFoul(match.teamA, "redCards")}
            >
              Red Card - {teams[match.teamA].name}
            </button>

            <button
              className="mr-4 px-4 py-2 cursor-pointer bg-red-600 rounded"
              onClick={() => handleFoul(match.teamB, "redCards")}
            >
              Red Card - {teams[match.teamB].name}
            </button>
          </div>
        </div>
      )}

      {match.teamA && match.teamB && (
        <div className="flex flex-col md:flex-row gap-5">
          <button
            className="px-6 py-3 cursor-pointer bg-blue-700 rounded"
            onClick={() => {
              handleFinalMatch();
            }}
          >
            Finalize Match
          </button>

          <button
            className={`mt-4 px-6 py-3 rounded cursor-pointer ${
              isPaused ? "bg-green-500" : "bg-red-500"
            }`}
            onClick={handlePauseResume}
          >
            {isPaused ? "▶ Resume Match" : "⏸ Pause Match"}
          </button>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6 text-center mt-6">
        Team Leaderboard
      </h1>

      <div className="overflow-auto">
        <div className="bg-gray-800 rounded-md p-4">
          <div className="flex justify-between p-3 bg-gray-700 font-bold text-lg text-center">
            <div>Rank</div>
            <div>Team</div>
            <div>Goals</div>
            <div>Wins</div>
            <div>Draws</div>
            <div>Losses</div>
            <div>Points</div>
          </div>

          {sortedLeaderBoard.map((team, index) => (
            <div
              key={index}
              className={`flex justify-between p-3 ${
                index % 2 === 0 ? "bg-gray-700" : "bg-gray-600"
              } text-lg`}
            >
              <div>{index + 1}</div>
              <div>{team.name}</div>
              <div>{team.goalsScored}</div>
              <div>{team.wins}</div>
              <div>{team.draws}</div>
              <div>{team.losses}</div>
              <div>{team.points}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
