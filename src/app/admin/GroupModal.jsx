import React, { useState, useEffect } from 'react';
import { FaTimes, FaEdit, FaTrophy, FaFilter, FaCalendarAlt, FaUserFriends } from 'react-icons/fa';
import { Trophy } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import CustomDropdown from './CustomDropdown';
import { Dialog } from '@headlessui/react';

// Score Input Dialog Component
const ScoreInputDialog = ({ isOpen, closeDialog, onSave, teamA, teamB }) => {
  const [scoreA, setScoreA] = useState('');
  const [scoreB, setScoreB] = useState('');
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    const numScoreA = parseInt(scoreA) || 0;
    const numScoreB = parseInt(scoreB) || 0;
    if (numScoreA > numScoreB) setWinner('A');
    else if (numScoreB > numScoreA) setWinner('B');
    else setWinner(null);
  }, [scoreA, scoreB]);

  const handleScoreChange = (team, value) => {
    if (value === '' || /^\d+$/.test(value)) {
      team === 'A' ? setScoreA(value) : setScoreB(value);
    }
  };

  const handleSave = () => {
    onSave(parseInt(scoreA) || 0, parseInt(scoreB) || 0);
    closeDialog();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onClose={closeDialog} className="relative z-50">
          <motion.div
            className="fixed inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel
              as={motion.div}
              className="mx-auto max-w-2xl w-full rounded-3xl bg-gray-800 p-8 shadow-xl angular-cut"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Dialog.Title className="text-2xl font-bold text-white mb-6 text-center">
                Enter Match Score
              </Dialog.Title>
              <div className="flex justify-between items-center space-x-4">
                {[
                  { team: 'A', data: teamA, score: scoreA },
                  { team: 'B', data: teamB, score: scoreB },
                ].map(({ team, data, score }, index) => (
                  <React.Fragment key={team}>
                    <motion.div
                      className={`flex-1 text-center ${
                        winner === team ? 'scale-105 transition-transform duration-300' : ''
                      }`}
                      animate={winner === team ? { scale: 1.05 } : { scale: 1 }}
                    >
                      <div className="relative inline-block">
                        <img
                          src={data.logo}
                          alt={data.name}
                          className="w-20 h-20 object-contain rounded-[1.5rem]"
                        />
                        <AnimatePresence>
                          {winner === team && (
                            <motion.div
                              className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-1"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <Trophy size={18} className="text-gray-800" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <p className="text-sm text-gray-400 mt-2">TEAM {team}</p>
                      <p className="font-semibold text-white">{data.name}</p>
                    </motion.div>
                    {index === 0 && (
                      <div className="flex items-center space-x-4">
                        <input
                          type="text"
                          value={scoreA}
                          onChange={(e) => handleScoreChange('A', e.target.value)}
                          className="w-16 h-12 rounded bg-gray-700 border border-gray-600 text-white text-center text-2xl font-bold angular-cut"
                          placeholder="0"
                        />
                        <div className="text-white text-3xl font-bold mx-2">:</div>
                        <input
                          type="text"
                          value={scoreB}
                          onChange={(e) => handleScoreChange('B', e.target.value)}
                          className="w-16 h-12 rounded bg-gray-700 border border-gray-600 text-white text-center text-2xl font-bold angular-cut"
                          placeholder="0"
                        />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="mt-8 flex justify-center">
                <motion.button
                  onClick={handleSave}
                  className="px-8 py-3 bg-orange-500 text-white font-semibold hover:bg-orange-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-orange-300 angular-cut-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Save Final Score
                </motion.button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
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
  console.log(group);
  // State for edit popup
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentMatchData, setCurrentMatchData] = useState({
    roundIndex: null,
    matchIndex: null,
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
  const handleEditMatch = (roundIndex, matchIndex, team1Name, team2Name) => {
    const team1 = getTeamInfo(team1Name);
    const team2 = getTeamInfo(team2Name);
    console.log('ere');
    console.log(team1);

    // Prepare team data for dialog
    const teamA = {
      name: team1Name,
      logo: team1.image || 'https://placehold.co/200',
    };

    const teamB = {
      name: team2Name,
      logo: team2.image || 'https://placehold.co/200',
    };

    setCurrentMatchData({
      roundIndex,
      matchIndex,
      teamA,
      teamB,
    });

    setEditDialogOpen(true);
  };

  // Handle saving match result
  const handleSaveScores = (scoreA, scoreB) => {
    const { roundIndex, matchIndex } = currentMatchData;

    // Create updated result object
    const updatedResult = {
      groupId: group.id,
      round: roundIndex,
      matchIndex: matchIndex,
      team1Score: scoreA,
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
      <div className="w-full max-w-7xl h-[90vh] overflow-hidden bg-dark shadow-xl angular-cut">
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
            <div className="flex items-center">
              <div className="text-sm uppercase tracking-wider text-gray-500 mr-3">
                <FaCalendarAlt className="inline mr-1" /> Round:
              </div>
              <div className="flex space-x-1 overflow-x-auto py-1">
                {Array.from({ length: totalRounds }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentRound(index)}
                    className={`px-3 py-1 text-sm rounded ${
                      currentRound === index
                        ? 'bg-primary/20 text-primary border border-primary/50'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body - Scrollable Content */}
        <div className="overflow-y-auto h-[calc(90vh-130px)]">
          <div className="p-6 space-y-6">
            {processedMatches.length > 0 ? (
              processedMatches.map((match) => {
                return (
                  <div
                    key={`match-${currentRound}-${match.matchIndex}`}
                    className="w-full overflow-hidden bg-gray-900/30 rounded-lg"
                  >
                    {/* Match Card */}
                    <div className="relative">
                      {/* Background image containers */}
                      <div className="absolute inset-0 m-0 p-0 border-none z-0">
                        {/* Left side background (Team A) */}
                        <div className="absolute inset-y-0 left-0 w-1/2 overflow-hidden">
                          <div
                            className="absolute inset-0"
                            style={{
                              backgroundImage: match.team1Image
                                ? `url(${match.team1Image})`
                                : 'none',
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
                              backgroundImage: match.team2Image
                                ? `url(${match.team2Image})`
                                : 'none',
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
                              {match.team1Name}
                            </span>
                          </div>

                          {/* Score Section */}
                          <div className="flex items-center space-x-4 w-1/5 justify-center">
                            <span
                              className={`text-3xl font-free-fire ${
                                match.played ? 'text-primary' : 'text-gray-600'
                              }`}
                            >
                              {match.result.team1Score}
                            </span>
                            {/* VS */}
                            <div
                              className={`text-xl font-extrabold relative px-2 ${
                                match.played ? 'text-white' : 'text-gray-600'
                              }`}
                            >
                              VS
                              <span
                                className={`absolute -bottom-1 left-0 w-full h-0.5 ${
                                  match.played ? 'bg-primary' : 'bg-gray-700'
                                }`}
                              ></span>
                            </div>
                            <span
                              className={`text-3xl font-free-fire ${
                                match.played ? 'text-primary' : 'text-gray-600'
                              }`}
                            >
                              {match.result.team2Score}
                            </span>
                          </div>

                          {/* Team B */}
                          <div className="flex flex-col items-start text-left w-2/5">
                            <span className="text-xs font-mono font-semibold text-gray-400 tracking-wide uppercase">
                              TEAM B
                            </span>
                            <span className="text-lg font-valorant hover:text-primary transition-all duration-300 truncate">
                              {match.team2Name}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Edit Button */}
                      <div className="absolute top-2 right-2 z-20">
                        <motion.button
                          onClick={() =>
                            handleEditMatch(
                              currentRound,
                              match.matchIndex,
                              match.team1Name,
                              match.team2Name,
                            )
                          }
                          className="text-gray-400 hover:text-primary transition-colors duration-200 bg-black/30 p-1.5 rounded"
                          title="Edit Result"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaEdit />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 bg-gray-900/20 rounded-lg border border-gray-800">
                <p className="text-gray-400">No matches found for this round</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Score Input Dialog */}
      <ScoreInputDialog
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
