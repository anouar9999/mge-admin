import React, { useState, useEffect } from 'react';
import {
  FaTimes,
  FaEdit,
  FaTrophy,
  FaFilter,
  FaCalendarAlt,
  FaUserFriends,
  FaCheck,
} from 'react-icons/fa';
import { ChevronDown, ChevronUp, Trophy, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import CustomDropdown from './CustomDropdown';
import { Dialog } from '@headlessui/react';

// Score Input Dialog Component
const ScoreboardUpdater = ({ isOpen, closeDialog, onSave, teamA, teamB }) => {
  const [scores, setScores] = useState({ A: 0, B: 0 });
  const [winner, setWinner] = useState(null);
  const [animation, setAnimation] = useState({ team: null, direction: null });

  useEffect(() => {
    if (scores.A > scores.B) setWinner('A');
    else if (scores.B > scores.A) setWinner('B');
    else setWinner(null);
  }, [scores]);

  const updateScore = (team, increment) => {
    const newScore = Math.max(0, scores[team] + increment);
    setScores((prev) => ({ ...prev, [team]: newScore }));

    // Trigger animation
    setAnimation({ team, direction: increment > 0 ? 'up' : 'down' });
    setTimeout(() => setAnimation({ team: null, direction: null }), 500);
  };

  const handleSave = () => {
    onSave(scores.A, scores.B);
    closeDialog();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDialog}
          />

          <motion.div
            className="relative max-w-3xl w-full bg-gray-900 border-2 border-gray-700 p-6 rounded-xl shadow-2xl overflow-hidden"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
          >
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden opacity-10">
              <div className="absolute -left-10 -top-20 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
              <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
            </div>

            {/* Close button */}
            <button
              onClick={closeDialog}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>

            <h2 className="text-3xl font-custom tracking-wider text-white text-center mb-6">
              MATCH SCOREBOARD
            </h2>

            <div className="flex justify-between items-center mb-8">
              {/* Center scoreboard */}
              <div className="flex items-center justify-center space-x-4 w-full">
                {[
                  { team: 'A', data: teamA },
                  { team: 'B', data: teamB },
                ].map(({ team, data }) => (
                  <div key={team} className="flex flex-col items-center w-1/2">
                    <div className="relative mb-2">
                      <motion.div
                        className={`p-3 rounded-xl ${
                          winner === team ? 'ring-2 ring-yellow-400' : ''
                        }`}
                        animate={winner === team ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <img
                          src={data.logo}
                          alt={data.name}
                          className="w-24 h-24 object-contain rounded-lg"
                        />
                        <AnimatePresence>
                          {winner === team && (
                            <motion.div
                              className="absolute -top-3 -right-3 bg-yellow-500 rounded-full p-1"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1.5 }}
                            >
                              <Trophy size={20} className="text-gray-900" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </div>

                    <p className="text-gray-300 font-mono text-sm mb-1">TEAM {team}</p>
                    <p className="font-custom text-xl text-white mb-6">{data.name}</p>

                    {/* Score controls */}
                    <div className="flex items-center">
                      <div className="relative w-24 h-20 flex items-center justify-center bg-gray-800 border-t-2 border-b-2 border-gray-700">
                        <AnimatePresence>
                          {animation.team === team && (
                            <motion.span
                              className={`absolute text-3xl font-bold ${
                                animation.direction === 'up' ? 'text-green-400' : 'text-red-400'
                              }`}
                              initial={{ opacity: 1, y: animation.direction === 'up' ? 20 : -20 }}
                              animate={{ opacity: 0, y: animation.direction === 'up' ? -20 : 20 }}
                              exit={{ opacity: 0 }}
                            >
                              {animation.direction === 'up' ? '+1' : '-1'}
                            </motion.span>
                          )}
                        </AnimatePresence>
                        <span className="text-5xl font-bold text-white">{scores[team]}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* VS divider */}
            <div className="flex items-center justify-center mb-8">
              <div className="h-px w-1/3 bg-gray-700"></div>
              <div className="px-4 text-xl font-bold text-gray-500">VS</div>
              <div className="h-px w-1/3 bg-gray-700"></div>
            </div>

            {/* Save button */}
            <div className="flex justify-center">
              <motion.button
                onClick={handleSave}
                className="px-8 py-3 bg-primary text-white font-semibold rounded-md hover:bg-orange-600 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                CONFIRM FINAL SCORE
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Improved Modal component for showing matches in a group with filtering options
const GroupModal = ({
  isOpen,
  onClose,
  group,
  mockResults,
  onSaveResult,
  teams, // Added teams prop to access team data
}) => {
  // State for filters and view options
  const [currentRound, setCurrentRound] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOption, setSortOption] = useState('default');
  console.log(group.matches[currentRound][currentRound].id);
  // State for edit popup
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentMatchData, setCurrentMatchData] = useState({
    roundIndex: null,
    matchIndex: group.matches[currentRound][currentRound].id,
    teamA: null,
    teamB: null,
  });

  // If not open or no group, don't render
  if (!isOpen || !group) return null;

  // Options for filters
  const statusOptions = [
    { value: 'all', label: 'All Matches' },
    { value: 'played', label: 'Played Matches', icon: <FaTrophy className="text-green-500" /> },
    {
      value: 'upcoming',
      label: 'Upcoming Matches',
      icon: <FaCalendarAlt className="text-blue-500" />,
    },
  ];

  // Helper to find team details
  const getTeamInfo = (teamName) => {
    return teams?.find((team) => team.name === teamName) || {};
  };

  // Find a result for a specific match
  const getMatchResult = (roundIndex, matchIndex) => {
    return (
      mockResults.find(
        (r) => r.groupId === group.id && r.round === roundIndex && r.matchIndex === matchIndex,
      ) || { team1Score: '-', team2Score: '-' }
    );
  };

  // Check if a match is played
  const isMatchPlayed = (result) => {
    return result.team1Score !== '-' && result.team2Score !== '-';
  };

  // Open edit dialog
  // const handleEditMatch = (roundIndex, matchIndex, team1Name, team2Name) => {
  //   const team1 = getTeamInfo(team1Name);
  //   const team2 = getTeamInfo(team2Name);
  //   console.log('ere');
  //   console.log(team1);

  //   // Prepare team data for dialog
  //   const teamA = {
  //     name: team1Name,
  //     logo: team1.image || 'https://placehold.co/200',
  //   };

  //   const teamB = {
  //     name: team2Name,
  //     logo: team2.image || 'https://placehold.co/200',
  //   };

  //   setCurrentMatchData({
  //     roundIndex,
  //     matchIndex,
  //     teamA,
  //     teamB,
  //   });

  //   setEditDialogOpen(true);
  // };

  // Handle saving match result
  const handleSaveScores = (scoreA, scoreB) => {
    const { roundIndex, matchIndex } = currentMatchData;

    // Create updated result object
    const updatedResult = {
      groupId: group.id,
      round: roundIndex,
      matchIndex: 0,
      team1Score: 1,
      team2Score: scoreB,
    };

    // Call the parent component's save function
    onSaveResult(updatedResult);
  };

  // Get processed matches with all relevant data
  const getProcessedMatches = () => {
    if (!group.matches[currentRound]) return [];

    let matches = group.matches[currentRound].map((match, matchIndex) => {
      const team1 = getTeamInfo(match[0]);
      const team2 = getTeamInfo(match[1]);
      const result = getMatchResult(currentRound, matchIndex);
      const played = isMatchPlayed(result);

      return {
        matchIndex,
        team1Name: match[0],
        team2Name: match[1],
        team1Image: team1.image,
        team2Image: team2.image,
        result,
        played,
      };
    });

    // Apply status filter
    if (statusFilter !== 'all') {
      const shouldBePlayed = statusFilter === 'played';
      matches = matches.filter((match) => match.played === shouldBePlayed);
    }

    // Apply sort
    if (sortOption !== 'default') {
      switch (sortOption) {
        case 'team-asc':
          matches.sort((a, b) => a.team1Name.localeCompare(b.team1Name));
          break;
        case 'team-desc':
          matches.sort((a, b) => b.team1Name.localeCompare(a.team1Name));
          break;
        case 'score-high':
          matches.sort((a, b) => {
            const aTotal = parseInt(a.result.team1Score) + parseInt(a.result.team2Score);
            const bTotal = parseInt(b.result.team1Score) + parseInt(b.result.team2Score);
            // Sort played matches first, then by score
            if (a.played && !b.played) return -1;
            if (!a.played && b.played) return 1;
            return isNaN(bTotal) ? -1 : isNaN(aTotal) ? 1 : bTotal - aTotal;
          });
          break;
        case 'score-low':
          matches.sort((a, b) => {
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

    return matches;
  };

  const processedMatches = getProcessedMatches();
  const totalRounds = group.matches.length;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75">
      <div className="w-full max-w-7xl h-[75vh] overflow-hidden bg-dark shadow-xl angular-cut">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-secondary flex justify-between items-center">
          <h2 className="text-2xl font-custom tracking-widest text-primary flex items-center">
            <FaTrophy className="mr-2" />
            {group.name} - Matches
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200"
            aria-label="Close"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Filter and Round Selection Section */}
        <div className="px-6 py-3 border-b border-secondary bg-dark/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Filter section */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="text-xs uppercase tracking-wider text-gray-500 md:self-center">
                <FaFilter className="inline mr-1" /> Filters:
              </div>

              <CustomDropdown
                options={statusOptions}
                selected={statusFilter}
                onSelect={setStatusFilter}
                placeholder="Match Status"
                className="w-full md:w-40"
              />
            </div>

            {/* Round Selection */}
            <div className="flex items-center ml-auto">
              <div className="text-xs uppercase tracking-wider text-gray-400 mr-3  px-2 py-1 rounded-lg">
                <FaCalendarAlt className="inline mr-1" /> ROUND
              </div>
              <div className="flex rounded-lg bg-secondary p-1">
                {Array.from({ length: totalRounds }, (_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentRound(index)}
                    className={`px-4 py-1.5 text-sm rounded-md transition-all duration-200 ${
                      currentRound === index
                        ? 'bg-gradient-to-r from-primary to-primary/85 text-white font-medium shadow-lg'
                        : 'bg-transparent text-gray-400 hover:text-white'
                    }`}
                    whileHover={{ scale: currentRound === index ? 1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {index + 1}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body - Scrollable Content */}
        <div className="overflow-y-auto h-[calc(90vh-130px)]">
          <div className="p-6 space-y-6">
            {group.matches.length > 0 ? (
              group.matches.map((match) => (
                <InteractiveMatchCard
                  key={`match-${currentRound}-${match.matchIndex}`}
                  match={match[currentRound]}
                  currentRound={currentRound}
                  onSaveResult={onSaveResult}
                  groupId={group.id}
                />
              ))
            ) : (
              <div className="text-center py-8 bg-gray-900/20 rounded-lg border border-gray-800">
                <p className="text-gray-400">No matches found for this round</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Score Input Dialog */}
      <ScoreboardUpdater
        isOpen={editDialogOpen}
        closeDialog={() => setEditDialogOpen(false)}
        onSave={handleSaveScores}
        teamA={currentMatchData.teamA}
        teamB={currentMatchData.teamB}
      />
    </div>
  );
};

export default GroupModal;
const InteractiveMatchCard = ({ match, currentRound, onSaveResult, groupId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [scores, setScores] = useState({
    team1: match.team1_score  === null ? 0 : parseInt(match.team1_score),
    team2: match.team2_score    === null ? 0 : parseInt(match.team2_score),
  });
  const [animation, setAnimation] = useState({ team: null, direction: null });

  // Update score function
  const updateScore = (team, increment) => {
    const newScore = Math.max(0, scores[team] + increment);
    setScores((prev) => ({ ...prev, [team]: newScore }));

    // Trigger animation
    setAnimation({ team, direction: increment > 0 ? 'up' : 'down' });
    setTimeout(() => setAnimation({ team: null, direction: null }), 500);
  };
console.log(scores.team2)
  // Save the score
  const handleSaveScores = () => {
    const updatedResult = {
      groupId: groupId,
      round: currentRound,
      matchIndex: match.id,
      team1Score: scores.team1,
      team2Score: scores.team2,
    };

    onSaveResult(updatedResult);
    setIsEditing(false);
  };
  // Winner determination
  const getWinner = () => {
    if (scores.team1 > scores.team2) return 'team1';
    if (scores.team2 > scores.team1) return 'team2';
    return null;
  };

  const winner = getWinner();

  return (
    <div className="w-full overflow-hidden mb-4">
      {/* Match Card */}
      <div className="relative   shadow-lg">
        {/* Background image containers */}
        <div className="absolute inset-0 m-0 p-0 border-none z-0  overflow-hidden">
          {/* Left side background (Team A) */}
          <div className="absolute inset-y-0 left-0 w-1/2 overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: match.team1_logo ? `url(${process.env.NEXT_PUBLIC_BACKEND_URL}${match.team1_logo})` : 'none',
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
                backgroundImage: match.team2_logo ? `url(${process.env.NEXT_PUBLIC_BACKEND_URL}${match.team2_logo})` : 'none',
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
              <motion.div
                className={`relative ${winner === 'team1' && !isEditing ? 'scale-105' : ''}`}
                animate={
                  winner === 'team1' && !isEditing
                    ? {
                        x: [0, 2, -2, 0],
                        transition: { repeat: Infinity, duration: 2 },
                      }
                    : {}
                }
              >
                <span className="text-xs font-mono font-semibold text-gray-400 tracking-wide uppercase">
                  TEAM A
                </span>
                <span className="text-lg font-valorant hover:text-primary transition-all duration-300 truncate block">
                  {match.team1_name}
                </span>

                {/* Winner trophy */}
                {winner === 'team1' && !isEditing && (
                  <motion.div
                    className="absolute -top-3 -left-6"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <FaTrophy className="text-yellow-500 text-lg" />
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Score Section */}
            <div className="flex items-center justify-center w-1/5 relative">
              {isEditing ? (
                /* Editing Mode - Score Controls */
                <div className="flex items-center space-x-4">
                  {/* Team A Score Controls */}
                  <div className="relative">
                    <div className="flex flex-col">
                      <motion.button
                        onClick={() => updateScore('team1', 1)}
                        className="bg-green-500/30 hover:bg-green-500/50 rounded-t w-10 h-8 flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ChevronUp size={18} className="text-green-300" />
                      </motion.button>

                      <div className="relative w-10 h-12 flex items-center justify-center bg-gray-800/80">
                        <AnimatePresence>
                          {animation.team === 'team1' && (
                            <motion.span
                              className={`absolute text-xl font-bold ${
                                animation.direction === 'up' ? 'text-green-400' : 'text-red-400'
                              }`}
                              initial={{ opacity: 1, y: animation.direction === 'up' ? 10 : -10 }}
                              animate={{ opacity: 0, y: animation.direction === 'up' ? -10 : 10 }}
                              exit={{ opacity: 0 }}
                            >
                              {animation.direction === 'up' ? '+1' : '-1'}
                            </motion.span>
                          )}
                        </AnimatePresence>
                        <span className="text-2xl font-bold text-white">{scores.team1}</span>
                      </div>

                      <motion.button
                        onClick={() => updateScore('team1', -1)}
                        className="bg-red-500/30 hover:bg-red-500/50 rounded-b w-10 h-8 flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ChevronDown size={18} className="text-red-300" />
                      </motion.button>
                    </div>
                  </div>

                  {/* VS */}
                  <div className="text-lg font-extrabold text-gray-500 px-1">VS</div>

                  {/* Team B Score Controls */}
                  <div className="relative">
                    <div className="flex flex-col">
                      <motion.button
                        onClick={() => updateScore('team2', 1)}
                        className="bg-green-500/30 hover:bg-green-500/50 rounded-t w-10 h-8 flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ChevronUp size={18} className="text-green-300" />
                      </motion.button>

                      <div className="relative w-10 h-12 flex items-center justify-center bg-gray-800/80">
                        <AnimatePresence>
                          {animation.team === 'team2' && (
                            <motion.span
                              className={`absolute text-xl font-bold ${
                                animation.direction === 'up' ? 'text-green-400' : 'text-red-400'
                              }`}
                              initial={{ opacity: 1, y: animation.direction === 'up' ? 10 : -10 }}
                              animate={{ opacity: 0, y: animation.direction === 'up' ? -10 : 10 }}
                              exit={{ opacity: 0 }}
                            >
                              {animation.direction === 'up' ? '+1' : '-1'}
                            </motion.span>
                          )}
                        </AnimatePresence>
                        <span className="text-2xl font-bold text-white">{scores.team2}</span>
                      </div>

                      <motion.button
                        onClick={() => updateScore('team2', -1)}
                        className="bg-red-500/30 hover:bg-red-500/50 rounded-b w-10 h-8 flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ChevronDown size={18} className="text-red-300" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Display Mode - Score Display */
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-3xl font-free-fire ${
                      match.played ? 'text-primary' : 'text-primary'
                    }`}
                  >
                    {scores.team1}
                  </span>

                  <div
                    className={`text-xl font-extrabold relative px-2 ${
                      match.played ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    VS
                    <span
                      className={`absolute -bottom-1 left-0 w-full h-0.5 ${
                        match.played ? 'bg-primary' : 'bg-primary'
                      }`}
                    ></span>
                  </div>

                  <span
                    className={`text-3xl font-free-fire ${
                      match.played ? 'text-primary' : 'text-primary'
                    }`}
                  >
                    {scores.team2}
                  </span>
                </div>
              )}

              {/* Edit/Save Controls */}
              <div className="absolute -top-8">
                {isEditing ? (
                  <motion.button
                    onClick={handleSaveScores}
                    className="bg-green-600/80 hover:bg-green-500 text-white p-2 rounded-full shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <FaCheck size={16} />
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600/50 hover:bg-blue-500 text-white p-2 rounded-full shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaEdit size={16} />
                  </motion.button>
                )}
              </div>
            </div>

            {/* Team B */}
            <div className="flex flex-col items-start text-left w-2/5">
              <motion.div
                className={`relative ${winner === 'team2' && !isEditing ? 'scale-105' : ''}`}
                animate={
                  winner === 'team2' && !isEditing
                    ? {
                        x: [0, 2, -2, 0],
                        transition: { repeat: Infinity, duration: 2 },
                      }
                    : {}
                }
              >
                <span className="text-xs font-mono font-semibold text-gray-400 tracking-wide uppercase">
                  TEAM B
                </span>
                <span className="text-lg font-valorant hover:text-primary transition-all duration-300 truncate block">
                  {match.team2_name}
                </span>

                {/* Winner trophy */}
                {winner === 'team2' && !isEditing && (
                  <motion.div
                    className="absolute -top-3 -right-6"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <FaTrophy className="text-yellow-500 text-lg" />
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Editing indicator - pulsing border */}
        {isEditing && (
          <motion.div
            className="absolute inset-0 rounded-lg border-2 border-primary pointer-events-none"
            animate={{
              boxShadow: [
                '0 0 0 rgba(249, 115, 22, 0)',
                '0 0 8px rgba(249, 115, 22, 0.8)',
                '0 0 0 rgba(249, 115, 22, 0)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>
    </div>
  );
};
