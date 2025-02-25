import { useState, useEffect } from "react";
import { useGame } from "../context/GameContext";
import AnimationAlert from "../Component/AnimationAlert";

const Admin = () => {
  const {
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
  } = useGame();

  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [scorer, setScorer] = useState("");
  const [assist, setAssist] = useState("");
  const [foulPlayer, setFoulPlayer] = useState("");

  const [isFinalized, setIsFinalized] = useState(false);

  // For animation
  const [goal, setGoal] = useState("");
  const [foul, setFoul] = useState(false);
  const [alertNotification, setAlertNotification] = useState({
    type: "",
    player: "",
  });

  const showAlert = (type, player = "") => {
    setAlertNotification({ type, player });
    setTimeout(() => setAlertNotification({ type: "", player: "" }), 2000);
  };

  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [matchStatus, setMatchStatus] = useState("First Half");

  const [sortedLeaderBoard, setSortedLeaderBoard] = useState([]);

  const [sortedPlayerLeaderBoard, setSortedPlayerLeaderBoard] = useState([]);

  const handleCreateMatch = () => {
    if (!teamA || !teamB || teamA === teamB) return;

    setMatch({
      teamA,
      teamB,
      score: { [teamA]: 0, [teamB]: 0 },
      finalDecision: { teamA: "", teamB: "" },
    });

    setMatchStats({
      [teamA]: { goals: [], fouls: 0, yellowCards: 0, redCards: 0 },
      [teamB]: { goals: [], fouls: 0, yellowCards: 0, redCards: 0 },
    });

    setIsMatchRunning(true);
  };

  const handleGoalUpdate = (team, goalScorer, assist) => {
    if (!goalScorer || !team || !assist) return;

    showAlert("goal", goalScorer);

    setMatch((prevMatch) => ({
      ...prevMatch,
      score: {
        ...prevMatch.score,
        [team]: (prevMatch.score[team] || 0) + 1,
      },
    }));

    setMatchStats((prevStats) => ({
      ...prevStats,
      [team]: {
        ...prevStats[team],
        goals: [
          ...(prevStats[team]?.goals || []),
          {
            scorer: goalScorer,
            time: `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`,
          }, // Stores minutes and seconds
        ],
      },
    }));

    setTeams((prevTeams) => ({
      ...prevTeams,
      [team]: {
        ...prevTeams[team],
        goalsScored: (prevTeams[team]?.goalsScored || 0) + 1,
      },
    }));

    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.name === goalScorer
          ? { ...player, goals: player.goals + 1 }
          : player
      )
    );

    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.name === assist
          ? { ...player, assists: player.assists + 1 }
          : player
      )
    );

    setScorer("");
    setAssist("");
  };

  const handleFoul = (team, foulPlayer, card) => {
    if (!team || !card || !foulPlayer) return;

    showAlert(card, foulPlayer);

    setMatchStats((prevStats) => ({
      ...prevStats,
      [team]: {
        ...prevStats[team],
        [card]: (prevStats[team][card] || 0) + 1,
        fouls: prevStats[team].fouls + 1,
      },
    }));

    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.name === foulPlayer
          ? { ...player, fouls: player.fouls + 1 } // Increment the player's fouls count
          : player
      )
    );
    setFoulPlayer("");
  };

  //   // Determine the match result
  //   const teamAResult =
  //     match.score.teamA > match.score.teamB
  //       ? "win"
  //       : match.score.teamA < match.score.teamB
  //       ? "lose"
  //       : "draw";
  //   const teamBResult =
  //     match.score.teamB > match.score.teamA
  //       ? "win"
  //       : match.score.teamB < match.score.teamA
  //       ? "lose"
  //       : "draw";

  //   // Set the final decisions in match state
  //   setMatch((prevMatch) => ({
  //     ...prevMatch,
  //     finalDecision: {
  //       teamA: teamAResult,
  //       teamB: teamBResult,
  //     },
  //   }));

  //   const updatedTeams = { ...teams };

  //   if (teamAResult === "win") {
  //     updatedTeams[match.teamA].points += 3;
  //   } else if (teamAResult === "draw") {
  //     updatedTeams[match.teamA].points += 1;
  //   }

  //   if (teamBResult === "win") {
  //     updatedTeams[match.teamB].points += 3;
  //   } else if (teamBResult === "draw") {
  //     updatedTeams[match.teamB].points += 1;
  //   }

  //   setTeams(updatedTeams);

  //   setIsMatchRunning(false);
  //   setSeconds(0);
  //   setMinutes(0);
  //   setIsPaused(true);

  //   alert(
  //     `Match Finalized!\n\n${match.teamA} ${match.score[match.teamA]} - ${
  //       match.score[match.teamB]
  //     }`
  //   );

  //   console.log("Match Finalized:", match);
  //   console.log("Updated Teams Points:", updatedTeams);
  //   console.log("Final Match Stats:", matchStats);
  // };

  const handleFinalMatch = () => {
    if (isFinalized) return;

    const teamAName = match.teamA;
    const teamBName = match.teamB;
    const teamAScore = match.score[teamA] ?? 0;
    const teamBScore = match.score[teamB] ?? 0;
    console.log(teamAName, teamBName, teamAScore, teamBScore);

    // Determine match results
    const teamAResult =
      teamAScore > teamBScore
        ? "win"
        : teamAScore < teamBScore
        ? "lose"
        : "draw";
    const teamBResult =
      teamBScore > teamAScore
        ? "win"
        : teamBScore < teamAScore
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

    // Create a copy of the teams object
    const updatedTeams = { ...teams };

    // Update Team A stats
    if (teamAResult === "win") {
      updatedTeams[match.teamA].points += 3;
      updatedTeams[match.teamA].wins += 1;
    } else if (teamAResult === "draw") {
      updatedTeams[match.teamA].points += 1;
      updatedTeams[match.teamA].draws += 1;
    } else {
      updatedTeams[match.teamA].losses += 1;
    }

    // Update Team B stats
    if (teamBResult === "win") {
      updatedTeams[match.teamB].points += 3;
      updatedTeams[match.teamB].wins += 1;
    } else if (teamBResult === "draw") {
      updatedTeams[match.teamB].points += 1;
      updatedTeams[match.teamB].draws += 1;
    } else {
      updatedTeams[match.teamB].losses += 1;
    }

    // Update teams state
    setTeams(updatedTeams);

    // Reset match timer
    setIsFinalized(true);
    setIsMatchRunning(false);
    setSeconds(0);
    setMinutes(0);
    setIsPaused(true);

    // Alert the final match result
    alert(
      `Match Finalized!\n\n${teamAName} ${match.score[teamA]} - ${match.score[teamB]} ${teamBName}`
    );

    console.log("Match Finalized:", match);
    console.log("Updated Teams:", updatedTeams);
    console.log("Final Match Stats:", matchStats);
  };

  const handlePauseResume = () => {
    setIsPaused((prev) => !prev);
  };

  useEffect(() => {
    let interval;

    if (isFinalized) {
      setMatchStatus("Final Score 🎉");
      return;
    }

    if (!isMatchRunning) {
      return;
    }

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
  }, [isPaused, isMatchRunning, isFinalized]);

  const getLeaderBoard = () => {
    const leaderBoard = Object.keys(teams).map((teamKey) => ({
      name: teams[teamKey].name,
      goalsScored: teams[teamKey].goalsScored,
      wins: teams[teamKey].wins,
      draws: teams[teamKey].draws,
      losses: teams[teamKey].losses,
      points: teams[teamKey].points,
    }));

    leaderBoard.sort(
      (a, b) => b.points - a.points || b.goalsScored - a.goalsScored
    );

    setSortedLeaderBoard(leaderBoard);
  };

  useEffect(() => {
    getLeaderBoard();
  }, [teams]);

  const getPlayerLeaderBoard = () => {
    const playerLeaderBoard = players.map((player) => ({
      name: player.name,
      goals: player.goals,
      assists: player.assists,
      fouls: player.fouls,
      // yellowCards: player.yellowCards,
      // redCards: player.redCards,
    }));

    playerLeaderBoard.sort(
      (a, b) => b.goals - a.goals || b.assists - a.assists || a.fouls - b.fouls
    );

    setSortedPlayerLeaderBoard(playerLeaderBoard);
  };

  useEffect(() => {
    getPlayerLeaderBoard();
  }, [players]);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      {alertNotification.type && (
        <AnimationAlert
          type={alertNotification.type}
          player={alertNotification.player}
        />
      )}
      <h1 className="md:text-4xl text-3xl font-bold mb-6 text-center ">
        GameOn
      </h1>

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
            onClick={() => {
              if (isFinalized) {
                setMatch((prevMatch) => ({
                  ...prevMatch,
                  teamA: teamA,
                  teamB: teamB,
                  score: { teamA: 0, teamB: 0 },
                  finalDecision: { teamA: "", teamB: "" },
                }));

                setIsFinalized(false);
                setSeconds(0);
                setMinutes(0);
                setIsPaused(false);
                setIsMatchRunning(true);
              }
              handleCreateMatch();
            }}
          >
            Start Match
          </button>
        </div>
      </div>
      {match.teamA && match.teamB && (
        <div className="mb-6 p-4 bg-gray-800 rounded">
          <h2 className="font-semibold mb-2 text-center md:text-4xl text-2xl">
            Current Match
          </h2>

          <div className="text-lg flex md:flex-row justify-center flex-col items-center gap-3 mt-5">
            <div className="flex-col justify-center">
              <p className="md:text-4xl text-3xl text-center">{`${
                teams[match.teamA].name
              } `}</p>
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

              {matchStats[match.teamA]?.goals.map((goal, index) => (
                <p key={index} className="text-white">
                  ⚽ {goal.scorer} scored at{" "}
                  {parseInt(goal.time.split(":")[0]) === 0
                    ? `${goal.time.split(":")[1]}''`
                    : `${goal.time.split(":")[0]}'`}
                </p>
              ))}

              <p className="text-3xl text-center font-bold md:hidden mt-4">
                {match.score[teamA]}
              </p>
            </div>
            <div className="flex gap-4 md:flex-col items-center md:mx-7">
              <p className="text-2xl md:text-4xl font-bold">vs</p>
              <i class="fa-solid fa-volleyball fa-bounce text-2xl md:text-4xl"></i>
            </div>
            <div className="flex-col items-center max-md:mb-5">
              <p className="text-3xl mb-2 text-center font-bold md:hidden">
                {match.score[teamB]}
              </p>
              <p className="md:text-4xl text-3xl text-center">
                {teams[match.teamB].name}
              </p>
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
              {matchStats[match.teamB]?.goals.map((goal, index) => (
                <p key={index} className="text-white">
                  ⚽ {goal.scorer} scored at{" "}
                  {parseInt(goal.time.split(":")[0]) === 0
                    ? `${goal.time.split(":")[1]}''`
                    : `${goal.time.split(":")[0]}'`}
                </p>
              ))}
            </div>
          </div>

          <div className=" font-bold max-md:hidden text-center text-5xl flex gap-44 justify-center w-">
            <span className="">{match.score[teamA]}</span>-
            <span className="">{match.score[teamB]}</span>
          </div>

          <h2 className="text-lg font-bold mb-2 text-center max-md:text-md">
            Match Timer
          </h2>
          <p className="font-semibold text-center text-2xl md:text-3xl">
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds} ⏳
          </p>

          <p className="text-xl max-md:text-md font-semibold mt-2 text-center">
            {matchStatus}
          </p>
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
              <option value="">Select Goal Scorer</option>
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

            <select
              className="p-2 bg-gray-700"
              value={assist}
              onChange={(e) => setAssist(e.target.value)}
            >
              <option value="">Select Assist</option>
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
              disabled={isFinalized}
              onClick={() => handleGoalUpdate(match.teamA, scorer, assist)}
            >
              <span className="capitalize">Goal for {match.teamA}</span>
            </button>

            <button
              className="ml-4 cursor-pointer px-4 py-2 bg-red-500 rounded"
              disabled={isFinalized}
              onClick={() => handleGoalUpdate(match.teamB, scorer, assist)}
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
            <select
              className="p-2 bg-gray-700"
              value={foulPlayer}
              onChange={(e) => setFoulPlayer(e.target.value)}
            >
              <option value="">Select Foul Player</option>
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
              className="mr-4 px-4 py-2 cursor-pointer bg-yellow-500 rounded"
              disabled={isFinalized}
              onClick={() => handleFoul(match.teamA, foulPlayer, "yellowCards")}
            >
              Yellow Card - {teams[match.teamA].name}
            </button>

            <button
              className="mr-4 px-4 py-2 cursor-pointer bg-yellow-500 rounded"
              disabled={isFinalized}
              onClick={() => handleFoul(match.teamB, foulPlayer, "yellowCards")}
            >
              Yellow Card - {teams[match.teamB].name}
            </button>

            <button
              className="mr-4 px-4 py-2 cursor-pointer bg-red-600 rounded"
              disabled={isFinalized}
              onClick={() => handleFoul(match.teamA, foulPlayer, "redCards")}
            >
              Red Card - {teams[match.teamA].name}
            </button>

            <button
              className="mr-4 px-4 py-2 cursor-pointer bg-red-600 rounded"
              disabled={isFinalized}
              onClick={() => handleFoul(match.teamB, foulPlayer, "redCards")}
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
            disabled={isFinalized}
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
            disabled={isFinalized}
            onClick={handlePauseResume}
          >
            {isPaused ? "▶ Resume Match" : "⏸ Pause Match"}
          </button>
        </div>
      )}
      <h2 className="text-2xl font-bold mb-6 text-center mt-6">
        Team Leaderboard
      </h2>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Rank
              </th>
              <th scope="col" className="px-6 py-3">
                Team
              </th>
              <th scope="col" className="px-6 py-3">
                Goals
              </th>
              <th scope="col" className="px-6 py-3">
                Wins
              </th>
              <th scope="col" className="px-6 py-3">
                Draws
              </th>
              <th scope="col" className="px-6 py-3">
                Losses
              </th>
              <th scope="col" className="px-6 py-3">
                Points
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedLeaderBoard.map((team, index) => (
              <tr
                key={index}
                className={`odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200`}
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {index + 1}
                </th>
                <td className="px-6 py-4">{team.name}</td>
                <td className="px-6 py-4">{team.goalsScored}</td>
                <td className="px-6 py-4">{team.wins}</td>
                <td className="px-6 py-4">{team.draws}</td>
                <td className="px-6 py-4">{team.losses}</td>
                <td className="px-6 py-4">{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2 className="text-2xl font-bold mb-6 text-center mt-6">
        Player LeaderBoard
      </h2>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Rank
              </th>
              <th scope="col" className="px-6 py-3">
                Player
              </th>
              <th scope="col" className="px-6 py-3">
                Goals
              </th>
              <th scope="col" className="px-6 py-3">
                Assists
              </th>
              <th scope="col" className="px-6 py-3">
                Fouls
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayerLeaderBoard.map((player, index) => (
              <tr
                key={index}
                className={`odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200`}
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {index + 1}
                </th>
                <td className="px-6 py-4">{player.name}</td>
                <td className="px-6 py-4">{player.goals}</td>
                <td className="px-6 py-4">{player.assists}</td>
                <td className="px-6 py-4">{player.fouls}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
