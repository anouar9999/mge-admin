import React, { useState, useEffect } from 'react';
import { TbTournament } from 'react-icons/tb';
import roundRobin from 'roundrobin-tournament-js';

const RoundRobinTournament = () => {
  const [rounds, setRounds] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [matches, setMatches] = useState([]);
  const [matchResults, setMatchResults] = useState({});
  const teams = [
    {
      id: 1,
      name: 'WINNERS ESPORTS',
      kills: 32,
      classPoints: 45,
      total: 77,
      image:
        'https://img.freepik.com/premium-vector/falcon-mascot-esport-logo-design-with-shield_1271121-37.jpg?w=740',
    },
    {
      id: 2,
      name: 'JOKO FORCE',
      kills: 28,
      classPoints: 52,
      total: 80,
      image:
        'https://img.freepik.com/free-vector/flat-design-basketball-logo-logo_52683-83957.jpg?t=st=1744731320~exp=1744734920~hmac=d68cab5b1341b9c02a6cbe5da4b98bca788f89f03fda4864de01f96b8a368ba6&w=740',
    },
    {
      id: 3,
      name: 'Old School',
      kills: 24,
      classPoints: 38,
      total: 62,
      image:
        'https://img.freepik.com/premium-vector/falcon-mascot-esport-logo-design-with-shield_1271121-37.jpg?w=740',
    },
    {
      id: 4,
      name: 'Amateras',
      kills: 35,
      classPoints: 30,
      total: 65,
      image:
        'https://img.freepik.com/free-vector/flat-design-swimming-logo-template_23-2149368753.jpg?t=st=1744731338~exp=1744734938~hmac=7cf5f07eed1ef5071a451c91cfb2e44c93f8bf589974685253fed743fa361133&w=740',
    },
    {
      id: 5,
      name: 'Tyranids',
      kills: 42,
      classPoints: 41,
      total: 83,
      image:
        'https://img.freepik.com/premium-vector/falcon-mascot-esport-logo-design-with-shield_1271121-37.jpg?w=740',
    },
    { id: 6, name: 'FANTASMAjr', kills: 19, classPoints: 47, total: 66 },
    {
      id: 7,
      name: 'TOXIC TX',
      kills: 38,
      classPoints: 49,
      total: 87,
      image:
        'https://img.freepik.com/free-vector/flat-design-swimming-logo-template_23-2149368753.jpg?t=st=1744731338~exp=1744734938~hmac=7cf5f07eed1ef5071a451c91cfb2e44c93f8bf589974685253fed743fa361133&w=740',
    },
    { id: 8, name: 'TripleX.Team', kills: 21, classPoints: 35, total: 56 },
    { id: 9, name: 'EQUIPE 808', kills: 26, classPoints: 33, total: 59 },
    { id: 10, name: 'CSS AFRICA', kills: 31, classPoints: 40, total: 71 },
  ];

  useEffect(() => {
    if (teams && teams.length > 0) {
      // Generate round robin tournament
      const teamNames = teams.map((team) => team.name);
      const generatedRounds = roundRobin(teamNames);
      setRounds(generatedRounds);

      // Initialize match results storage
      const initialResults = {};
      generatedRounds.forEach((round, roundIndex) => {
        round.forEach((match, matchIndex) => {
          initialResults[`${roundIndex}-${matchIndex}`] = {
            team1Score: null,
            team2Score: null,
            winner: null,
            completed: false,
          };
        });
      });
      setMatchResults(initialResults);

      // Default to showing first round
      if (generatedRounds.length > 0) {
        setMatches(generatedRounds[0]);
      }
    }
  }, []); // Removed teams from dependency array since it's defined inside the component

  const handleRoundChange = (roundIndex) => {
    setCurrentRound(roundIndex);
    setMatches(rounds[roundIndex]);
  };

  const handleMatchResult = (roundIndex, matchIndex, team1Score, team2Score) => {
    const matchKey = `${roundIndex}-${matchIndex}`;
    let winner = null;

    if (team1Score > team2Score) {
      winner = matches[matchIndex][0];
    } else if (team2Score > team1Score) {
      winner = matches[matchIndex][1];
    }
    // If equal, winner remains null (draw)

    setMatchResults({
      ...matchResults,
      [matchKey]: {
        team1Score,
        team2Score,
        winner,
        completed: true,
      },
    });
  };

  const getTeamInfo = (teamName) => {
    return teams.find((team) => team.name === teamName) || {};
  };

  // Fixed function to calculate accurate team stats
  const calculateTeamStats = (teamName) => {
    let wins = 0,
      draws = 0,
      losses = 0,
      matches = 0;

    // Loop through all match results to count stats
    Object.entries(matchResults).forEach(([key, result]) => {
      if (result.completed) {
        // Get the round and match index from the key
        const [roundIndex, matchIndex] = key.split('-').map(Number);

        // Get the match from the rounds
        if (rounds[roundIndex] && rounds[roundIndex][matchIndex]) {
          const match = rounds[roundIndex][matchIndex];

          // Check if this team is part of this match
          if (match.includes(teamName)) {
            matches++;

            if (result.winner === teamName) {
              wins++;
            } else if (result.winner === null) {
              draws++;
            } else {
              losses++;
            }
          }
        }
      }
    });

    // Calculate tournament points (3 for win, 1 for draw)
    const tournamentPoints = wins * 3 + draws;

    return { wins, draws, losses, matches, tournamentPoints };
  };

  return (
    <div className="min-h-screen w-full text-white">
      {/* Tournament Header */}
      <div className="mb-8">
        <h1 className="text-4xl flex items-center font-custom tracking-wider uppercase">
          Tournament Bracket
        </h1>
        <div className="flex items-center text-primary">
          <TbTournament />
          <p className="mx-2">All teams play against each other once</p>
        </div>
      </div>

      {/* Round Selector */}
      <div className="mb-6">
        <TournamentTabs teams={teams} />
      </div>
    </div>
  );
};

export default RoundRobinTournament;
import { FaTrophy, FaChartBar, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';

const TournamentTabs = ({ teams }) => {
  const [activeTab, setActiveTab] = useState('matches');

  // Sample rounds data - in a real app, you'd probably pass this as props
  const rounds = [
    { id: 1, name: 'Round 1', completed: true },
    { id: 2, name: 'Round 2', completed: true },
    { id: 3, name: 'Round 3', completed: false },
    { id: 4, name: 'Round 4', completed: false },
    { id: 5, name: 'Round 5', completed: false },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'matches':
        return <MatchesContent rounds={rounds} teams={teams} />;
      case 'standings':
        return <StandingsContent teams={teams} />;

      default:
        return <MatchesContent rounds={rounds} teams={teams} />;
    }
  };

  return (
    <div className="min-h-screen w-full text-white">
      {/* Tabs Navigation */}
      <div className="mb-6 border-b border-gray-800">
        <div className="flex overflow-x-auto py-2 space-x-2">
          <TabButton
            active={activeTab === 'matches'}
            onClick={() => setActiveTab('matches')}
            icon={<TbTournament className="mr-2" />}
            label="Matches"
          />
          <TabButton
            active={activeTab === 'standings'}
            onClick={() => setActiveTab('standings')}
            icon={<FaTrophy className="mr-2" />}
            label="Standings"
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">{renderTabContent()}</div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 font-ea-football  tracking-wider rounded transition-all duration-200 flex items-center ${
      active
        ? 'border-b-2 border-primary text-white '
        : 'bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white'
    }`}
    aria-pressed={active}
    aria-label={label}
  >
    {icon}
    {label}
  </button>
);

// Content components for each tab
const MatchesContent = ({ rounds, teams }) => {
  const [currentRound, setCurrentRound] = useState(0);

  const getTeamInfo = (teamId) => {
    return teams.find((team) => team.id === teamId) || {};
  };

  // Sample match data for demonstration
  const sampleMatches = [
    { team1: 1, team2: 2 },
    { team1: 3, team2: 4, team1Score: 2, team2Score: 2 },
    { team1: 5, team2: 6, team1Score: 4, team2Score: 0 },
    { team1: 7, team2: 8, team1Score: 1, team2Score: 5 },
    { team1: 9, team2: 10, team1Score: 3, team2Score: 2 },
  ];

  return (
    <div>
      {/* Round Selector - Same as in your original code */}
      <div className="mb-8">
        <div className="flex overflow-x-auto pl-12 space-x-2  ">
          {rounds.map((round, index) => (
            <button
              key={index}
              onClick={() => setCurrentRound(index)}
              className={`px-4 p-2 font-ea-football tracking-wider rounded transition-all duration-200 ${
                currentRound === index
                  ? 'border-b-2 border-primary text-white '
                  : 'bg-transparent text-gray-300 hover:border-gray-700 hover:text-white'
              }`}
              aria-pressed={currentRound === index}
              aria-label={`Round ${index + 1}`}
            >
              Round {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Matches Display - Similar to your original code */}
      <div className="gap-6">
        {sampleMatches.map((match, matchIndex) => {
          const team1 = getTeamInfo(match.team1);
          const team2 = getTeamInfo(match.team2);

          return (
            <div key={matchIndex} className="w-full max-w-5xl overflow-hidden mx-auto my-4">
              {/* Match Card */}
              <div className="relative">
                {/* Background image containers */}
                <div className="absolute inset-0 m-0 p-0 border-none z-0">
                  {/* Left side background (Team A) */}
                  <div className="absolute inset-y-0 left-0 w-1/2">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `url(${team1.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'left center',
                        opacity: 0.4,
                      }}
                    ></div>
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(to right, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.7) 80%, rgba(0,0,0,1) 100%)',
                      }}
                    ></div>
                  </div>

                  {/* Right side background (Team B) */}
                  <div className="absolute inset-y-0 right-0 w-1/2">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `url(${team2.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'right center',
                        opacity: 0.4,
                      }}
                    ></div>
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(to left, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.7) 80%, rgba(0,0,0,1) 100%)',
                      }}
                    ></div>
                  </div>

                  {/* Center divider gradient */}
                  <div
                    className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-16"
                    style={{
                      background:
                        'linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,1), rgba(0,0,0,0.9))',
                    }}
                  ></div>
                </div>

                {/* Match Content */}
                <div className="w-full py-4 px-8 flex items-center relative z-10">
                  <div className="flex items-center justify-center w-full space-x-16 ml-8">
                    {/* Team A */}
                    <div className="flex flex-col items-end text-right">
                      <span className="text-sm font-mono font-semibold text-gray-400 tracking-wide uppercase">
                        TEAM A
                      </span>
                      <span className="text-lg font-valorant hover:text-primary transition-all duration-300">
                        {team1.name}
                      </span>
                    </div>
                    <span className="text-3xl font-free-fire text-primary">{match.team1Score}</span>

                    {/* VS */}
                    <div className="text-xl font-extrabold text-white relative">
                      VS
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary"></span>
                    </div>
                    <span className="text-3xl font-free-fire text-primary">{match.team2Score}</span>

                    {/* Team B */}
                    <div className="flex flex-col items-start text-left">
                      <span className="text-sm font-mono font-semibold text-gray-400 tracking-wide uppercase">
                        TEAM B
                      </span>
                      <span className="text-lg font-valorant hover:text-primary transition-all duration-300">
                        {team2.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StandingsContent = ({ teams }) => {
  // Function to calculate mock stats for demo purposes
  const calculateTeamStats = (teamId) => {
    // In a real app, you'd use actual data
    const mockStats = {
      1: { wins: 8, losses: 2 },
      2: { wins: 7, losses: 3 },
      3: { wins: 6, losses: 4 },
      4: { wins: 6, losses: 4 },
      5: { wins: 5, losses: 5 },
      6: { wins: 5, losses: 5 },
      7: { wins: 4, losses: 6 },
      8: { wins: 3, losses: 7 },
      9: { wins: 3, losses: 7 },
      10: { wins: 2, losses: 8 },
    };

    return mockStats[teamId] || { wins: 0, losses: 0 };
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-fixed">
          <thead className="bg-secondary  text-gray-300 font-mono uppercase text-sm">
            <tr>
              <th className="py-3 w-[8%] text-center"> </th>
              <th className="py-3 w-[20%] text-left text-base"></th>
              <th className="py-3 w-[27%] text-left text-base">Team</th>
              <th className="py-3 w-[35%] text-center text-base">WINS</th>
              <th className="py-3 w-[35%] text-center text-base">LOSSES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {teams.map((team, index) => {
              const { wins, losses } = calculateTeamStats(team.id);

              return (
                <tr
                  key={team.id}
                  className={`relative hover:bg-gray-800/50 cursor-pointer angular-cut transition-all duration-300 ${
                    index < 3 ? 'bg-gray-800/20' : ''
                  }`}
                >
                  {/* Background image container */}
                  <td colSpan={7} className="absolute inset-0 m-0 p-0 border-none">
                    <div className="absolute inset-0 z-0">
                      {/* Team logo or background image */}
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `url(${team.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'right center',
                          opacity: 0.4,
                        }}
                      ></div>

                      {/* Fade gradient overlay - Different for top 3 with gold, silver, bronze */}
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            index === 0
                              ? 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.7) 40%, black 70%), linear-gradient(to top, transparent 50%, rgba(255,215,0,0.1) 100%)'
                              : index === 1
                              ? 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.7) 40%, black 70%), linear-gradient(to top, transparent 50%, rgba(192,192,192,0.1) 100%)'
                              : index === 2
                              ? 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.7) 40%, black 70%), linear-gradient(to top, transparent 50%, rgba(205,127,50,0.1) 100%)'
                              : 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.7) 40%, black 70%)',
                        }}
                      ></div>
                    </div>
                  </td>

                  {/* Rank Cell */}
                  <td className="py-4 text-center relative z-10 align-middle">
                    <span
                      className={`
                      inline-flex items-center justify-center w-8 h-8 rounded-full 
                      ${index === 0 ? 'bg-yellow-500/20 text-yellow-300' : ''}
                      ${index === 1 ? 'bg-gray-400/20 text-gray-300' : ''}
                      ${index === 2 ? 'bg-amber-700/20 text-amber-600' : ''}
                      ${index > 2 ? 'bg-gray-800/50 text-gray-400' : ''}
                      font-bold text-lg
                    `}
                    >
                      {index + 1}
                    </span>
                  </td>

                  {/* Team Name Cell */}
                  <td className="py-4 text-left relative z-10 pl-2 align-middle">
                    <span
                      className={`font-valorant hover:text-primary transition-all duration-300 relative group ${
                        index < 3 ? 'text-white font-bold' : 'text-white'
                      }`}
                    >
                      {team.name || 'Team Name'}
                      <span className="absolute -bottom-1 font-base left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </td>

                  {/* Wins Cell */}
                  <td className="py-4 text-center relative z-10 align-middle">
                    <div className="transition-all text-2xl font-free-fire text-green-400 duration-300 hover:font-bold">
                      {wins}
                    </div>
                  </td>

                  {/* Losses Cell */}
                  <td className="py-4 text-center relative z-10 align-middle">
                    <div className="transition-all text-2xl font-free-fire text-red-400 duration-300 hover:font-bold">
                      {losses}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
