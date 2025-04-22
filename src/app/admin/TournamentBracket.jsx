

import React, { useState, useEffect } from 'react';
import { TbTournament } from 'react-icons/tb';
import { FaTrophy, FaChartBar, FaUserFriends, FaInfoCircle, FaMedal, FaCalendarAlt, FaFilter, FaFire, FaSkull, FaEquals } from 'react-icons/fa';
import GroupModal from './GroupModal';
import CustomDropdown from './CustomDropdown';
import PlayoffsBracket from './components/brackets/PlayoffsBracket';

// Helper function to generate round robin matches
// Since we can't import the external library, we'll implement it ourselves
const generateRoundRobin = (teams) => {
  const rounds = [];

  if (teams.length % 2 !== 0) {
    // Add a "bye" team if odd number of teams
    teams = [...teams, null];
  }

  const n = teams.length;
  const numRounds = n - 1;
  const halfSize = n / 2;

  const teamIndices = teams.map((_, i) => i);
  teamIndices.shift(); // Remove first team

  for (let round = 0; round < numRounds; round++) {
    const roundMatches = [];
    const newIndices = [0, ...teamIndices];

    for (let match = 0; match < halfSize; match++) {
      const team1 = teams[newIndices[match]];
      const team2 = teams[newIndices[n - 1 - match]];

      // Skip matches with bye (null team)
      if (team1 !== null && team2 !== null) {
        roundMatches.push([team1, team2]);
      }
    }

    rounds.push(roundMatches);

    // Rotate the teams (except the first one)
    teamIndices.unshift(teamIndices.pop());
  }

  return rounds;
};


// Function to create groups from a list of teams
const createGroups = (allTeams, numGroups) => {
  const groups = Array.from({ length: numGroups }, () => []);

  // Distribute teams among groups (round-robin assignment)
  allTeams.forEach((team, index) => {
    const groupIndex = index % numGroups;
    groups[groupIndex].push(team);
  });

  return groups.map((teamList, index) => ({
    id: index + 1,
    name: `Group ${String.fromCharCode(65 + index)}`, // A, B, C, etc.
    teams: teamList,
    matches: [],
    standings: []
  }));
};

const MultiGroupRoundRobinTournament = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(0);
  const [activeTab, setActiveTab] = useState('groups');
  const [currentRound, setCurrentRound] = useState(0);

  // New state for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalGroupIndex, setModalGroupIndex] = useState(null);

  // State for match results
  const [matchResults, setMatchResults] = useState([
    // Group A results (only a few matches for demonstration)
    { groupId: 1, round: 0, matchIndex: 0, team1Score: 3, team2Score: 1 },
    { groupId: 1, round: 0, matchIndex: 1, team1Score: 2, team2Score: 2 },
    { groupId: 1, round: 1, matchIndex: 0, team1Score: 0, team2Score: 1 },

    // Group B results
    { groupId: 2, round: 0, matchIndex: 0, team1Score: 4, team2Score: 0 },
    { groupId: 2, round: 0, matchIndex: 1, team1Score: 1, team2Score: 1 },

    // Group C results
    { groupId: 3, round: 0, matchIndex: 0, team1Score: 2, team2Score: 0 },
  ]);

  // Sample teams data
  const teams = [
    {
      id: 1,
      name: 'WINNERS ESPORTS',
      kills: 32,
      classPoints: 45,
      total: 77,
      image: 'https://img.freepik.com/premium-vector/falcon-mascot-esport-logo-design-with-shield_1271121-37.jpg?w=740',
    },
    {
      id: 2,
      name: 'JOKO FORCE',
      kills: 28,
      classPoints: 52,
      total: 80,
      image: 'https://img.freepik.com/free-vector/flat-design-basketball-logo-logo_52683-83957.jpg?t=st=1744731320~exp=1744734920~hmac=d68cab5b1341b9c02a6cbe5da4b98bca788f89f03fda4864de01f96b8a368ba6&w=740',
    },
    {
      id: 3,
      name: 'Old School',
      kills: 24,
      classPoints: 38,
      total: 62,
      image: 'https://img.freepik.com/premium-vector/falcon-mascot-esport-logo-design-with-shield_1271121-37.jpg?w=740',
    },
    {
      id: 4,
      name: 'Amateras',
      kills: 35,
      classPoints: 30,
      total: 65,
      image: 'https://img.freepik.com/free-vector/flat-design-swimming-logo-template_23-2149368753.jpg?t=st=1744731338~exp=1744734938~hmac=7cf5f07eed1ef5071a451c91cfb2e44c93f8bf589974685253fed743fa361133&w=740',
    },
    {
      id: 5,
      name: 'Tyranids',
      kills: 42,
      classPoints: 41,
      total: 83,
      image: 'https://img.freepik.com/premium-vector/falcon-mascot-esport-logo-design-with-shield_1271121-37.jpg?w=740',
    },
    {
      id: 6,
      name: 'FANTASMAjr',
      kills: 19,
      classPoints: 47,
      total: 66,
      image: 'https://img.freepik.com/free-vector/flat-design-basketball-logo-logo_52683-83957.jpg?t=st=1744731320~exp=1744734920~hmac=d68cab5b1341b9c02a6cbe5da4b98bca788f89f03fda4864de01f96b8a368ba6&w=740',
    },
    {
      id: 7,
      name: 'TOXIC TX',
      kills: 38,
      classPoints: 49,
      total: 87,
      image: 'https://img.freepik.com/free-vector/flat-design-swimming-logo-template_23-2149368753.jpg?t=st=1744731338~exp=1744734938~hmac=7cf5f07eed1ef5071a451c91cfb2e44c93f8bf589974685253fed743fa361133&w=740',
    },
    {
      id: 8,
      name: 'TripleX.Team',
      kills: 21,
      classPoints: 35,
      total: 56,
      image: 'https://img.freepik.com/premium-vector/falcon-mascot-esport-logo-design-with-shield_1271121-37.jpg?w=740',
    },
    {
      id: 9,
      name: 'EQUIPE 808',
      kills: 26,
      classPoints: 33,
      total: 59,
      image: 'https://img.freepik.com/free-vector/flat-design-swimming-logo-template_23-2149368753.jpg?t=st=1744731338~exp=1744734938~hmac=7cf5f07eed1ef5071a451c91cfb2e44c93f8bf589974685253fed743fa361133&w=740',
    },
    {
      id: 10,
      name: 'CSS AFRICA',
      kills: 31,
      classPoints: 40,
      total: 71,
      image: 'https://img.freepik.com/free-vector/flat-design-basketball-logo-logo_52683-83957.jpg?t=st=1744731320~exp=1744734920~hmac=d68cab5b1341b9c02a6cbe5da4b98bca788f89f03fda4864de01f96b8a368ba6&w=740',
    },
    {
      id: 11,
      name: 'Team11',
      kills: 29,
      classPoints: 37,
      total: 66,
      image: 'https://img.freepik.com/premium-vector/falcon-mascot-esport-logo-design-with-shield_1271121-37.jpg?w=740',
    },
    {
      id: 12,
      name: 'Team12',
      kills: 33,
      classPoints: 36,
      total: 69,
      image: 'https://img.freepik.com/free-vector/flat-design-basketball-logo-logo_52683-83957.jpg?t=st=1744731320~exp=1744734920~hmac=d68cab5b1341b9c02a6cbe5da4b98bca788f89f03fda4864de01f96b8a368ba6&w=740',
    },
  ];

  // Initialize groups and matches
  useEffect(() => {
    // Create 3 groups from our teams
    const numberOfGroups = 3;
    const tournamentGroups = createGroups(teams, numberOfGroups);

    // Generate round-robin matches for each group
    tournamentGroups.forEach(group => {
      const teamNames = group.teams.map(team => team.name);
      group.matches = generateRoundRobin(teamNames);

      // Initialize standings for each team in the group
      group.standings = group.teams.map(team => ({
        teamId: team.id,
        teamName: team.name,
        teamImage: team.image,
        matches: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        points: 0, // 3 points for win, 1 for draw
        goalsFor: 0,
        goalsAgainst: 0
      }));
    });

    setGroups(tournamentGroups);
  }, []);

  // Update standings based on match results
  useEffect(() => {
    if (groups.length === 0) return;

    const updatedGroups = JSON.parse(JSON.stringify(groups)); // Deep clone groups

    // Reset all standings to zero before recalculating
    updatedGroups.forEach(group => {
      group.standings.forEach(team => {
        team.matches = 0;
        team.wins = 0;
        team.draws = 0;
        team.losses = 0;
        team.points = 0;
        team.goalsFor = 0;
        team.goalsAgainst = 0;
      });
    });

    // Apply results to update standings
    matchResults.forEach(result => {
      const groupIndex = result.groupId - 1;
      if (groupIndex >= updatedGroups.length) return;

      const group = updatedGroups[groupIndex];
      const match = group.matches[result.round]?.[result.matchIndex];
      if (!match) return;

      const team1Name = match[0];
      const team2Name = match[1];

      const team1 = group.standings.find(team => team.teamName === team1Name);
      const team2 = group.standings.find(team => team.teamName === team2Name);

      if (team1 && team2) {
        // Update matches played
        team1.matches++;
        team2.matches++;

        // Update goals
        team1.goalsFor += result.team1Score;
        team1.goalsAgainst += result.team2Score;
        team2.goalsFor += result.team2Score;
        team2.goalsAgainst += result.team1Score;

        // Update wins, draws, losses and points
        if (result.team1Score > result.team2Score) {
          // Team 1 wins
          team1.wins++;
          team1.points += 3;
          team2.losses++;
        } else if (result.team1Score < result.team2Score) {
          // Team 2 wins
          team1.losses++;
          team2.wins++;
          team2.points += 3;
        } else {
          // Draw
          team1.draws++;
          team1.points += 1;
          team2.draws++;
          team2.points += 1;
        }
      }
    });

    // Sort standings by points (descending)
    updatedGroups.forEach(group => {
      group.standings.sort((a, b) => {
        // First sort by points
        if (b.points !== a.points) return b.points - a.points;

        // If tied on points, sort by goal difference
        const aGoalDiff = a.goalsFor - a.goalsAgainst;
        const bGoalDiff = b.goalsFor - b.goalsAgainst;
        if (bGoalDiff !== aGoalDiff) return bGoalDiff - aGoalDiff;

        // If still tied, sort by goals scored
        return b.goalsFor - a.goalsFor;
      });
    });

    setGroups(updatedGroups);
  }, [matchResults]);

  // Handle opening the modal
  const handleOpenModal = (groupIndex) => {
    setModalGroupIndex(groupIndex);
    setIsModalOpen(true);
  };

  // Handle saving a match result
  const handleSaveResult = (updatedResult) => {
    setMatchResults(prev => {
      // Find if this result already exists
      const existingIndex = prev.findIndex(r =>
        r.groupId === updatedResult.groupId &&
        r.round === updatedResult.round &&
        r.matchIndex === updatedResult.matchIndex
      );

      if (existingIndex >= 0) {
        // Update existing result
        const newResults = [...prev];
        newResults[existingIndex] = updatedResult;
        return newResults;
      } else {
        // Add new result
        return [...prev, updatedResult];
      }
    });
  };

  // Get the current group's data
  const currentGroup = groups[selectedGroup] || { name: '', teams: [], matches: [], standings: [] };

  // Get current round matches for the selected group
  const currentRoundMatches = currentGroup.matches[currentRound] || [];

  // Total number of rounds in the current group
  const totalRounds = currentGroup.matches.length;

  // Render functions for different tab contents
  const renderTabContent = () => {
    switch (activeTab) {
      case 'groups':
        return (
          <GroupsOverview
            groups={groups}
            selectedGroup={selectedGroup}
            setSelectedGroup={setSelectedGroup}
            onOpenModal={handleOpenModal}
          />
        );
      // case 'matches':
      //   return (
      //     <MatchesContent 
      //     groups={groups}  
      //     setCurrentRound={setCurrentRound}
      //     mockResults={matchResults}
      //     teams={teams}
      //   />
      //   );
      case 'playoffs':
        return <PlayoffsBracket groups={groups} />;
      default:
        return <GroupsOverview groups={groups} />;
    }
  };

  return (
    <div className="min-h-screen w-full text-white">
      {/* Tournament Header */}
      <div className="mb-8">
        <h1 className="text-4xl flex items-center font-custom tracking-wider uppercase">
          Multi-Group Tournament
        </h1>
        <div className="flex items-center text-primary">
          <TbTournament className="mr-2" />
          <p>Teams divided into groups for round robin matches</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="mb-6 border-b border-gray-800">
        <div className="flex justify-center overflow-x-auto py-2 space-x-2">
          <TabButton
            active={activeTab === 'groups'}
            onClick={() => setActiveTab('groups')}
            icon={<FaUserFriends className="mr-2" />}
            label="Groups Stage"
          />
          {/* <TabButton
            active={activeTab === 'matches'}
            onClick={() => setActiveTab('matches')}
            icon={<TbTournament className="mr-2" />}
            label="Matches"
          /> */}
          <TabButton
            active={activeTab === 'playoffs'}
            onClick={() => setActiveTab('playoffs')}
            icon={<FaTrophy className="mr-2" />}
            label="playoffs"
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">{renderTabContent()}</div>
      {isModalOpen && (
        <GroupModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          group={groups[modalGroupIndex]}
          mockResults={matchResults}
          onSaveResult={handleSaveResult}
        />
      )}
    </div>
  );
};

// Tab Button Component
const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 font-bold tracking-wider angular-cut flex items-center relative overflow-hidden group ${active
        ? 'text-primary'
        : 'text-white hover:text-primary'
      }`}
    style={{
      clipPath: "polygon(0 0, 95% 0, 100% 100%, 5% 100%)",
      minWidth: "200px",
      transition: "all 0.3s ease-in-out"
    }}
    aria-pressed={active}
    aria-label={label}
  >
    {/* Background with transition */}
    <div
      className={`absolute inset-0 bg-black z-0 transition-all duration-300 ease-in-out ${active ? 'border border-primary' : 'border border-transparent'
        }`}
      style={{
        clipPath: "polygon(0 0, 95% 0, 100% 100%, 5% 100%)"
      }}
    />

    {/* Hover effect overlay */}
    <div
      className="absolute inset-0 bg-gray-800 opacity-0 group-hover:opacity-20 z-0 transition-opacity duration-300 ease-in-out"
      style={{
        clipPath: "polygon(0 0, 95% 0, 100% 100%, 5% 100%)"
      }}
    />

    {/* Content with z-index to appear above backgrounds */}
    <div className="flex items-center z-10 relative transition-all duration-300">
      <span className={`mr-2 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-105'}`}>
        {icon}
      </span>
      <span className="transition-all duration-300 ease-in-out">{label}</span>
    </div>
  </button>
);

// Groups Overview Component
const GroupsOverview = ({ groups, selectedGroup, setSelectedGroup, onOpenModal }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {groups.map((group, index) => (
        <div
          key={group.id}
          className={`relative overflow-hidden cursor-pointer transition-all duration-300   ${selectedGroup === index ? 'border-primary' : ''
            }`}
          onClick={(e) => {
            e.stopPropagation(); // Prevent selecting the group
            onOpenModal(index);
          }}

        >
          {/* Background gradient overlay */}
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(15,15,15,1) 100%)'
              }}
            ></div>
          </div>

          {/* Group Card Content */}
          <div className="p-4 flex flex-col relative z-10">
            <h3 className="text-2xl font-custom tracking-widest mb-4 flex items-center">
              <span className={`text-primary mr-2 ${selectedGroup === index ? 'scale-110' : ''}`}><FaUserFriends /></span>
              {group.name}

            </h3>

            <div className="space-y-1">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-xs text-gray-400 uppercase">
                    <th className="py-2 w-10 text-center"></th>
                    <th className="py-2 w-10 text-center"></th>

                    <th className="py-2 text-left">Team</th>
                    <th className="py-2 w-12 text-center"><span className="flex items-center justify-center gap-1">
                      <FaFire size={10} className="text-green-400" /> W
                    </span></th>
                    
                    <th className="py-2 w-12 text-center"><span className="flex items-center justify-center gap-1">
                      <FaEquals size={10} className="text-yellow-400" /> D
                    </span></th>
                    <th className="py-2 w-12 text-center"><span className="flex items-center justify-center gap-1">
                      <FaSkull size={10} className="text-red-400" /> L
                    </span></th>
                    {/* <th className="py-2 w-12 text-center">PTS</th> */}
                  </tr>
                </thead>
                <tbody className="divide-y-4 divide-gray-800/30">
                  {group.teams.map((team, teamIndex) => {
                    const teamStanding = group.standings.find(s => s.teamName === team.name) || {};
                    return (
                      <tr
                        key={team.id}
                        className="relative hover:bg-gray-800/50 angular-cut transition-all duration-300"
                      >
                        {/* Background image container */}
                        <td colSpan={6} className="absolute inset-0 m-0 p-0 border-none">
                          <div className="absolute inset-0 z-0">
                            {/* Team logo or background image */}
                            {team.image && (
                              <div
                                className="absolute inset-0"
                                style={{
                                  backgroundImage: `url(${team.image})`,
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'right center',
                                  opacity: 0.2,
                                }}
                              ></div>
                            )}

                            {/* Fade gradient overlay - Different for top positions */}
                            <div
                              className="absolute inset-0"
                              style={{
                                background:
                                  teamIndex === 0
                                    ? 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.7) 40%, black 70%), linear-gradient(to top, transparent 50%, rgba(255,215,0,0.1) 100%)'
                                    : teamIndex === 1
                                      ? 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.7) 40%, black 70%), linear-gradient(to top, transparent 50%, rgba(192,192,192,0.1) 100%)'
                                      : 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.7) 40%, black 70%)',
                              }}
                            ></div>
                          </div>
                        </td>

                        {/* Rank Cell */}
                        <td className="py-2 text-center relative z-10 align-middle">
                          <span
                            className={`
                            inline-flex items-center justify-center w-3 h-3 rounded-full 
                            ${teamIndex === 0 ? ' text-yellow-300' : ''}
                            ${teamIndex === 1 ? ' text-gray-300' : ''}
                            ${teamIndex > 1 ? ' text-gray-400' : ''}
                            font-bold text-sm
                          `}
                          >
                            {teamIndex + 1}
                          </span>
                        </td>

                        {/* Team Name */}
                        <td className="py-2 text-left relative z-10 pl-2 align-middle">
                          <div className="flex items-center">
                            {/* {team.image && (
                              <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-800 mr-2 border border-gray-700">
                                <img src={team.image} alt={team.name} className="w-full h-full object-cover" />
                              </div>
                            )} */}
                            <span
                              className={`font-valorant hover:text-primary transition-all duration-300 relative group text-sm ${teamIndex < 2 ? 'text-white font-bold' : 'text-white'
                                }`}
                            >
                              {team.name}
                              <span className="absolute -bottom-1 font-base left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                            </span>
                          </div>
                        </td>

                        {/* Wins */}
                        <td className="py-2 text-center relative z-10 align-middle">
                          <div className="transition-all text-sm font-free-fire text-green-400 duration-300 hover:font-bold">
                            {teamStanding.wins || 0}
                          </div>
                        </td>

                        {/* Draws */}
                        <td className="py-2 text-center relative z-10 align-middle">
                          <div className="transition-all text-sm font-free-fire text-yellow-400 duration-300 hover:font-bold">
                            {teamStanding.draws || 0}
                          </div>
                        </td>

                        {/* Losses */}
                        <td className="py-2 text-center relative z-10 align-middle">
                          <div className="transition-all text-sm font-free-fire text-red-400 duration-300 hover:font-bold">
                            {teamStanding.losses || 0}
                          </div>
                        </td>

                        {/* Points */}
                        {/* <td className="py-2 text-center relative z-10 align-middle">
                          <div className="text-base font-bold text-primary">{teamStanding.points || 0}</div>
                        </td> */}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>


          </div>
        </div>
      ))}
    </div>
  );
};

const MatchesContent = ({ groups, currentRound, setCurrentRound, mockResults, teams }) => {
  // State for filters
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [sortOption, setSortOption] = useState('default');
  const [statusFilter, setStatusFilter] = useState('all');

  // Create options for dropdowns
  const groupOptions = [
    { value: 'all', label: 'All Groups' },
    ...groups.map(group => ({
      value: group.id,
      label: group.name,
      icon: <FaUserFriends className="text-primary" />
    }))
  ];

  const sortOptions = [
    { value: 'default', label: 'Default Order' },
    { value: 'team-asc', label: 'Team Name (A-Z)' },
    { value: 'team-desc', label: 'Team Name (Z-A)' },
    { value: 'score-high', label: 'Highest Scores First' },
    { value: 'score-low', label: 'Lowest Scores First' },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Matches' },
    { value: 'played', label: 'Played Matches', icon: <FaTrophy className="text-green-500" /> },
    { value: 'upcoming', label: 'Upcoming Matches', icon: <FaCalendarAlt className="text-blue-500" /> },
  ];

  // Helper to find team details
  const getTeamInfo = (teamName) => {
    return teams.find(team => team.name === teamName) || {};
  };

  // Helper to find match result
  const getMatchResult = (groupId, roundIndex, matchIndex) => {
    return mockResults.find(r =>
      r.groupId === groupId &&
      r.round === roundIndex &&
      r.matchIndex === matchIndex
    ) || { team1Score: '-', team2Score: '-' };
  };

  // Filter groups based on selection
  const filteredGroups = selectedGroup === 'all'
    ? groups
    : groups.filter(group => group.id === selectedGroup);

  // Calculate the maximum number of rounds across all groups
  const maxRounds = Math.max(...groups.map(group => group.matches.length), 0);

  // Function to check if a match is played
  const isMatchPlayed = (result) => {
    return result.team1Score !== '-' && result.team2Score !== '-';
  };

  // Get processed matches with all relevant data
  const getProcessedMatches = () => {
    let allMatches = [];

    filteredGroups.forEach(group => {
      if (group.matches[currentRound]) {
        const groupMatches = group.matches[currentRound].map((match, matchIndex) => {
          const team1 = getTeamInfo(match[0]);
          const team2 = getTeamInfo(match[1]);
          const result = getMatchResult(group.id, currentRound, matchIndex);
          const played = isMatchPlayed(result);

          return {
            groupId: group.id,
            groupName: group.name,
            matchIndex,
            team1,
            team2,
            result,
            played
          };
        });

        allMatches = [...allMatches, ...groupMatches];
      }
    });

    // Apply status filter
    if (statusFilter !== 'all') {
      const shouldBePlayed = statusFilter === 'played';
      allMatches = allMatches.filter(match => match.played === shouldBePlayed);
    }

    // Apply sort
    if (sortOption !== 'default') {
      switch (sortOption) {
        case 'team-asc':
          allMatches.sort((a, b) => a.team1.name.localeCompare(b.team1.name));
          break;
        case 'team-desc':
          allMatches.sort((a, b) => b.team1.name.localeCompare(a.team1.name));
          break;
        case 'score-high':
          allMatches.sort((a, b) => {
            const aTotal = parseInt(a.result.team1Score) + parseInt(a.result.team2Score);
            const bTotal = parseInt(b.result.team1Score) + parseInt(b.result.team2Score);
            // Sort played matches first, then by score
            if (a.played && !b.played) return -1;
            if (!a.played && b.played) return 1;
            return isNaN(bTotal) ? -1 : isNaN(aTotal) ? 1 : bTotal - aTotal;
          });
          break;
        case 'score-low':
          allMatches.sort((a, b) => {
            const aTotal = parseInt(a.result.team1Score) + parseInt(a.result.team2Score);
            const bTotal = parseInt(b.result.team1Score) + parseInt(b.result.team2Score);
            // Sort played matches first, then by score
            if (a.played && !b.played) return -1;
            if (!a.played && b.played) return 1;
            return isNaN(aTotal) ? -1 : isNaN(bTotal) ? 1 : aTotal - bTotal;
          });
          break;
        default:
          break;
      }
    }

    return allMatches;
  };

  const processedMatches = getProcessedMatches();

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between">
        <h2 className="text-2xl font-bold mb-4 md:mb-0">Tournament Matches</h2>

        {/* Filter section */}
        <div className="flex flex-col md:flex-row gap-3 bg-gray-900/30 p-3 rounded-lg">
          <div className="text-xs uppercase tracking-wider text-gray-500 mb-2 md:mb-0 md:mr-2 md:self-center">
            <FaFilter className="inline mr-1" /> Filters:
          </div>

          <CustomDropdown
            options={groupOptions}
            selected={selectedGroup}
            onSelect={setSelectedGroup}
            placeholder="Select Group"
            className="w-full md:w-48"
          />

          <CustomDropdown
            options={statusOptions}
            selected={statusFilter}
            onSelect={setStatusFilter}
            placeholder="Match Status"
            className="w-full md:w-48"
          />


        </div>
      </div>

      {/* Round Selector */}
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <div className="text-sm uppercase tracking-wider text-gray-500 mr-3">
            <FaCalendarAlt className="inline mr-1" /> Tournament Round:
          </div>
        </div>
        <div className="flex overflow-x-auto pl-4 space-x-2">
          {Array.from({ length: maxRounds }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentRound(index)}
              className={`px-6 py-3 font-bold tracking-wider flex items-center relative overflow-hidden group ${currentRound === index
                  ? 'text-primary'
                  : 'text-white hover:text-primary'
                }`}
              style={{
                clipPath: "polygon(0 0, 95% 0, 100% 100%, 5% 100%)",
                minWidth: "120px",
                transition: "all 0.3s ease-in-out"
              }}
            >
              <span className="relative z-10">Round {index + 1}</span>

              {/* Background with transition */}
              <div
                className={`absolute inset-0 bg-black z-0 transition-all duration-300 ease-in-out ${currentRound === index ? 'border border-primary' : 'border border-transparent'
                  }`}
                style={{
                  clipPath: "polygon(0 0, 95% 0, 100% 100%, 5% 100%)"
                }}
              />

              {/* Hover effect overlay */}
              <div
                className="absolute inset-0 bg-gray-800 opacity-0 group-hover:opacity-20 z-0 transition-opacity duration-300 ease-in-out"
                style={{
                  clipPath: "polygon(0 0, 95% 0, 100% 100%, 5% 100%)"
                }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Match List */}
      <div className="grid grid-cols-1 gap-8">
        {processedMatches.length > 0 ? (
          <div className="space-y-6">
            {processedMatches.map((match, index) => (
              <div key={`${match.groupId}-${match.matchIndex}`} className="w-full max-w-5xl overflow-hidden mx-auto my-4 bg-gray-900/30 rounded-lg">


                {/* Match Card */}
                <div className="relative">
                  {/* Background image containers */}
                  <div className="absolute inset-0 m-0 p-0 border-none z-0">
                    {/* Left side background (Team A) */}
                    <div className="absolute inset-y-0 left-0 w-1/2 rounded-l-lg overflow-hidden">
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `url(${match.team1.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'left center',
                          opacity: 0.2,
                        }}
                      ></div>
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            'linear-gradient(to right, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 80%, rgba(0,0,0,1) 100%)',
                        }}
                      ></div>
                    </div>

                    {/* Right side background (Team B) */}
                    <div className="absolute inset-y-0 right-0 w-1/2 rounded-r-lg overflow-hidden">
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `url(${match.team2.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'right center',
                          opacity: 0.2,
                        }}
                      ></div>
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            'linear-gradient(to left, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 80%, rgba(0,0,0,1) 100%)',
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
                  <div className="w-full py-6 px-8 flex items-center relative z-10">
                    <div className="flex items-center justify-between w-full">
                      {/* Team A */}
                      <div className="flex flex-col items-end text-right w-2/5">
                        <span className="text-xs font-mono font-semibold text-gray-400 tracking-wide uppercase">
                          TEAM A
                        </span>
                        <span className="text-lg font-valorant hover:text-primary transition-all duration-300 truncate">
                          {match.team1.name}
                        </span>
                      </div>

                      {/* Score Section */}
                      <div className="flex items-center space-x-4 w-1/5 justify-center">
                        <span className={`text-3xl font-free-fire ${match.played ? 'text-primary' : 'text-gray-600'}`}>
                          {match.result.team1Score}
                        </span>
                        {/* VS */}
                        <div className={`text-xl font-extrabold relative px-2 ${match.played ? 'text-white' : 'text-gray-600'}`}>
                          VS
                          <span className={`absolute -bottom-1 left-0 w-full h-0.5 ${match.played ? 'bg-primary' : 'bg-gray-700'}`}></span>
                        </div>
                        <span className={`text-3xl font-free-fire ${match.played ? 'text-primary' : 'text-gray-600'}`}>
                          {match.result.team2Score}
                        </span>
                      </div>

                      {/* Team B */}
                      <div className="flex flex-col items-start text-left w-2/5">
                        <span className="text-xs font-mono font-semibold text-gray-400 tracking-wide uppercase">
                          TEAM B
                        </span>
                        <span className="text-lg font-valorant hover:text-primary transition-all duration-300 truncate">
                          {match.team2.name}
                        </span>
                      </div>
                    </div>
                  </div>


                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-900/20 rounded-lg border border-gray-800">
            <p className="text-gray-400">No matches found with the current filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Standings Content Component
const StandingsContent = ({ group }) => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">{group.name} - Standings</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-fixed">
          <thead className="bg-secondary text-gray-300 font-mono uppercase text-sm">
            <tr>
              <th className="py-3 w-[5%] text-center">#</th>
              <th className="py-3 w-[5%] text-center"></th>
              <th className="py-3 w-[25%] text-left">Team</th>
              <th className="py-3 w-[10%] text-center">MP</th>
              <th className="py-3 w-[10%] text-center">W</th>
              <th className="py-3 w-[10%] text-center">D</th>
              <th className="py-3 w-[10%] text-center">L</th>
              <th className="py-3 w-[10%] text-center">GF</th>
              <th className="py-3 w-[10%] text-center">GA</th>
              <th className="py-3 w-[10%] text-center">PTS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {group.standings.map((team, index) => (
              <tr
                key={team.teamId}
                className={`relative hover:bg-gray-800/50 cursor-pointer transition-all duration-300 ${index < 2 ? 'bg-gray-800/20' : ''
                  }`}
              >
                {/* Background image container */}
                <td colSpan={10} className="absolute inset-0 m-0 p-0 border-none">
                  <div className="absolute inset-0 z-0">
                    {/* Team logo or background image */}
                    {team.teamImage && (
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `url(${team.teamImage})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'right center',
                          opacity: 0.2,
                        }}
                      ></div>
                    )}

                    {/* Fade gradient overlay - Different for top positions */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          index === 0
                            ? 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.7) 40%, black 70%), linear-gradient(to top, transparent 50%, rgba(255,215,0,0.1) 100%)'
                            : index === 1
                              ? 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.7) 40%, black 70%), linear-gradient(to top, transparent 50%, rgba(192,192,192,0.1) 100%)'
                              : 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.7) 40%, black 70%)',
                      }}
                    ></div>
                  </div>
                </td>

                {/* Position */}
                <td className="py-4 text-center relative z-10 align-middle">
                  <span
                    className={`
                    inline-flex items-center justify-center w-8 h-8 rounded-full 
                    ${index === 0 ? 'bg-yellow-500/20 text-yellow-300' : ''}
                    ${index === 1 ? 'bg-gray-400/20 text-gray-300' : ''}
                    ${index > 1 ? 'bg-gray-800/50 text-gray-400' : ''}
                    font-bold text-lg
                  `}
                  >
                    {index + 1}
                  </span>
                </td>

                {/* Team Logo */}
                <td className="py-4 text-center relative z-10 align-middle">
                  {team.teamImage && (
                    <div className="w-8 h-8 mx-auto rounded-full overflow-hidden bg-gray-800 border border-gray-700">
                      <img src={team.teamImage} alt={team.teamName} className="w-full h-full object-cover" />
                    </div>
                  )}
                </td>

                {/* Team Name */}
                <td className="py-4 text-left relative z-10 pl-2 align-middle">
                  <span
                    className={`font-valorant hover:text-primary transition-all duration-300 relative group ${index < 2 ? 'text-white font-bold' : 'text-white'
                      }`}
                  >
                    {team.teamName}
                    <span className="absolute -bottom-1 font-base left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                  </span>
                </td>

                {/* Matches Played */}
                <td className="py-4 text-center relative z-10 align-middle text-gray-300">
                  {team.matches}
                </td>

                {/* Wins */}
                <td className="py-4 text-center relative z-10 align-middle text-green-400">
                  {team.wins}
                </td>

                {/* Draws */}
                <td className="py-4 text-center relative z-10 align-middle text-yellow-400">
                  {team.draws}
                </td>

                {/* Losses */}
                <td className="py-4 text-center relative z-10 align-middle text-red-400">
                  {team.losses}
                </td>

                {/* Goals For */}
                <td className="py-4 text-center relative z-10 align-middle">
                  {team.goalsFor}
                </td>

                {/* Goals Against */}
                <td className="py-4 text-center relative z-10 align-middle">
                  {team.goalsAgainst}
                </td>

                {/* Points */}
                <td className="py-4 text-center relative z-10 align-middle">
                  <span className="text-xl font-free-fire text-primary font-bold">
                    {team.points}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
        <h3 className="text-lg font-semibold mb-2 text-primary">Group Qualification</h3>
        <div className="flex items-center mb-2">
          <div className="w-4 h-4 rounded-full bg-yellow-500/40 mr-2"></div>
          <p className="text-sm">Top 2 teams advance to knockout stage</p>
        </div>
        <p className="text-xs text-gray-400">
          In case of a tie on points, teams are ranked by: 1 Goal difference, 2 Goals scored, 3 Head-to-head
        </p>
      </div>
    </div>
  );
}
export default MultiGroupRoundRobinTournament;
