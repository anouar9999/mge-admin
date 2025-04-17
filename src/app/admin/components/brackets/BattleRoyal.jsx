/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react';
import { TbTournament } from 'react-icons/tb';
import {
  FaLock,
  FaUnlock,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSave,
  FaTimes,
  FaSearch,
} from 'react-icons/fa';
import { X } from 'lucide-react';

const BattleRoyale = () => {
  // Sample data for the tournament with realistic stats
  const [teams, setTeams] = useState([
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
  ]);

  // Admin modal state
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Editing state
  const [editingTeam, setEditingTeam] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', kills: 0, classPoints: 0, image: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate total points when kills or classPoints change
  useEffect(() => {
    if (editingTeam) {
      setEditingTeam({
        ...editingTeam,
        total: parseInt(editingTeam.kills || 0) + parseInt(editingTeam.classPoints || 0),
      });
    }
  }, [editingTeam?.kills, editingTeam?.classPoints]);

  useEffect(() => {
    setNewTeam({
      ...newTeam,
      total: parseInt(newTeam.kills || 0) + parseInt(newTeam.classPoints || 0),
    });
  }, [newTeam.kills, newTeam.classPoints]);

  // Sort teams by total points
  const sortedTeams = [...teams].sort((a, b) => b.total - a.total);

  // Filter teams based on search term
  const filteredTeams = sortedTeams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.id.toString().includes(searchTerm) ||
      team.total.toString().includes(searchTerm),
  );

  // Handle edit actions
  const handleEditClick = (team) => {
    setEditingTeam({ ...team });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingTeam((prev) => ({
      ...prev,
      [name]: name === 'kills' || name === 'classPoints' ? parseInt(value) : value,
    }));
  };

  const handleEditSave = () => {
    setTeams((prev) =>
      prev.map((team) =>
        team.id === editingTeam.id
          ? {
              ...editingTeam,
              total: parseInt(editingTeam.kills) + parseInt(editingTeam.classPoints),
            }
          : team,
      ),
    );
    setEditingTeam(null);
    setShowEditModal(false);
  };

  const handleEditCancel = () => {
    setEditingTeam(null);
    setShowEditModal(false);
  };

  // Handle delete action
  const handleDeleteTeam = (id) => {
    setTeams((prev) => prev.filter((team) => team.id !== id));
  };

  // Handle add team
  const handleAddTeamChange = (e) => {
    const { name, value } = e.target;
    setNewTeam((prev) => ({
      ...prev,
      [name]: name === 'kills' || name === 'classPoints' ? parseInt(value) : value,
    }));
  };

  const handleAddTeamSubmit = () => {
    const maxId = Math.max(...teams.map((team) => team.id), 0);
    const teamToAdd = {
      ...newTeam,
      id: maxId + 1,
      total: parseInt(newTeam.kills) + parseInt(newTeam.classPoints),
    };

    setTeams((prev) => [...prev, teamToAdd]);
    setNewTeam({ name: '', kills: 0, classPoints: 0, image: '' });
    setShowAddForm(false);
  };

  // Handle search
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const Header = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl flex items-center font-custom tracking-wider uppercase">
            Tournament Bracket
          </h1>
          <div className="flex items-center text-primary">
            <TbTournament />
            <p className="mx-2">Manage and review tournament bracket</p>
          </div>
        </div>

        {/* Admin toggle button */}
        <button
          onClick={() => setIsAdminModalOpen(!isAdminModalOpen)}
          className="flex items-center bg-primary hover:bg-primary/85 text-white py-2 px-4 angular-cut transition-all duration-300"
        >
          {isAdminModalOpen ? <FaUnlock className="mr-2" /> : <FaLock className="mr-2" />}
          {isAdminModalOpen ? 'Exit Admin Mode' : 'Admin Mode'}
        </button>
      </div>
    </div>
  );

  const EditTeamModal = () => {
    if (!showEditModal || !editingTeam) return null;
  
    return (
      <div className="fixed inset-0 bg-black/75 z-[60] flex items-center justify-center backdrop-blur-sm transition-all duration-300">
        <div 
          className="bg-gradient-to-b from-gray-800 to-gray-900 shadow-2xl w-full max-w-2xl mx-4 rounded-lg overflow-hidden relative animate-fadeIn"
        >
          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
          
          {/* Header with team image background */}
          <div className="relative overflow-hidden">
            {/* Team image background with improved overlay */}
            {editingTeam.image && (
              <div className="absolute inset-0 z-0">
                <div 
                  className="absolute inset-0 bg-cover bg-center z-0 filter blur-sm" 
                  style={{backgroundImage: `url(${editingTeam.image})`, opacity: 0.15, transform: 'scale(1.1)'}}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
              </div>
            )}
            
            <div className="relative z-20 px-6 pt-5 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Team logo/icon */}
                  {editingTeam.logo && (
                    <div className="w-10 h-10 rounded-md overflow-hidden ring-2 ring-white/20 shadow-lg">
                      <img src={editingTeam.logo} alt="Team logo" className="w-full h-full object-cover" />
                    </div>
                  )}
                  
                  {/* Team name with enhanced typography */}
                  <div>
                    <span className="text-xs text-blue-300 uppercase tracking-wider font-medium">Editing Team</span>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide leading-tight group-hover:text-blue-300 transition-colors">
                      {editingTeam.name}
                    </h2>
                  </div>
                </div>
                
                {/* Close button with better hover effect */}
                <button 
                  onClick={handleEditCancel}
                  className="rounded-full p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 hover:shadow-inner transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  aria-label="Close modal"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
  
          {/* Main content area with refined spacing */}
          <div className="px-6 py-5">
            {/* Inputs area with improved visual design */}
            <div className="grid grid-cols-2 gap-8 mb-8 px-4">
              {/* Kills Input */}
              <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 p-4 hover:border-blue-500/50 transition-all duration-300 group relative overflow-hidden shadow-md">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="flex flex-col items-center justify-center mb-3 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-800 to-blue-600 border border-blue-500/30 flex items-center justify-center mb-2 shadow-lg group-hover:shadow-blue-500/20 transition-all">
                    <span className="text-white text-xl font-bold">K</span>
                  </div>
                  <label className="block text-gray-300 text-sm uppercase tracking-wider font-medium">Kills</label>
                </div>
                
                <div className="relative">
                  <input
                    type="number"
                    name="kills"
                    value={editingTeam.kills}
                    onChange={handleEditChange}
                    className="w-full bg-gray-900/80 text-white text-center text-2xl px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 border-b-2 border-blue-600/50 relative z-10 transition-all"
                    min="0"
                  />
                  <div className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500/70 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </div>
              </div>
              
              {/* Class Points Input */}
              <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 p-4 hover:border-purple-500/50 transition-all duration-300 group relative overflow-hidden shadow-md">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="flex flex-col items-center justify-center mb-3 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-800 to-purple-600 border border-purple-500/30 flex items-center justify-center mb-2 shadow-lg group-hover:shadow-purple-500/20 transition-all">
                    <span className="text-white text-xl font-bold">CP</span>
                  </div>
                  <label className="block text-gray-300 text-sm uppercase tracking-wider font-medium">Class Points</label>
                </div>
                
                <div className="relative">
                  <input
                    type="number"
                    name="classPoints"
                    value={editingTeam.classPoints}
                    onChange={handleEditChange}
                    className="w-full bg-gray-900/80 text-white text-center text-2xl px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 border-b-2 border-purple-600/50 relative z-10 transition-all"
                    min="0"
                  />
                  <div className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500/70 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </div>
              </div>
            </div>
  
            {/* Total Points with visual impact */}
            <div className="mt-8 text-center bg-gradient-to-b from-gray-800/70 to-gray-900/70 py-6 rounded-lg border border-gray-700/70 shadow-inner relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300 mx-4">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <p className="text-gray-300 text-sm uppercase tracking-wider font-semibold mb-1">Total Score</p>
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 text-5xl block my-2">{editingTeam.total}</span>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-3 rounded-full"></div>
            </div>
          </div>
  
          {/* Footer with improved buttons */}
          <div className="bg-gray-900/90 px-6 py-4 flex justify-between border-t border-gray-800">
            <button
              onClick={handleEditCancel}
              className="text-gray-300 hover:text-white py-2 px-4 rounded-md transition duration-200 flex items-center hover:bg-gray-800/70 focus:outline-none focus:ring-2 focus:ring-gray-500/30"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>
            
            <button
              onClick={handleEditSave}
              className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 px-5 rounded-md shadow-md hover:shadow-lg transition-all duration-200 flex items-center group focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              type="button"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="relative z-10">Update Team</span>
            </button>
          </div>
        </div>
      </div>
    );
  };
  // Admin Modal Component
  const AdminModal = () => {
    if (!isAdminModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-secondary z-50 overflow-y-auto">
        <div className="container mx-auto p-4 md:p-8">
          <div className=" flex justify-between items-center mb-6">
            <h2 className="text-3xl md:text-4xl font-custom tracking-wider text-primary">
            
            </h2>
            <button onClick={() => setIsAdminModalOpen(false)}>
              <X className="text-primary" />
            </button>
          </div>
         
          {/* <div className="flex justify-between items-start mb-8">
          <div className="flex items-center">
            <div className="text-primary bg-primary/10 p-3 rounded-full mr-3">
              <TbTournament size={24} />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-custom tracking-wider text-white">
                Admin Dashboard
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Manage tournament data and team information
              </p>
            </div>
          </div>

  <div className="relative w-full md:w-72">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <FaSearch className="text-gray-400" />
    </div>
    <input
      type="text"
      placeholder="Search teams..."
      value={searchTerm}
      onChange={handleSearchChange}
      className="w-full bg-dark text-white py-4 px-8 h-12 angular-cut focus:outline-none focus:ring-2 focus:ring-primary"
    />
  </div>
</div> */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
              <h3 className="text-xl font-valorant  ">Leaderboard Management</h3>

              <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                
                <div className="relative w-full md:w-64">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search teams..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full bg-secondary  text-white  py-2 px-8 angular-cut focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          <div className="bg-dark angular-cut p-4 md:p-6  shadow-lg mb-6">
           

            {/* Teams table */}
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead className="angular-cut bg-secondary text-gray-300 font-mono uppercase text-sm">
                  <tr>
                    <th className="py-3 text-left text-base">#</th>
                    <th className="py-3 text-left text-base">Team</th>
                    <th className="py-3 text-center text-base">Kills</th>
                    <th className="py-3 text-center text-base">Class Points</th>
                    <th className="py-3 text-center text-base">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y-8 divide-gray-800">
                  {filteredTeams.length > 0 ? (
                    filteredTeams.map((team, index) => (
                      <tr
                        onClick={() => handleEditClick(team)}
                        key={team.id}
                        className={`cursor-pointer `}
                      >
                        
                        <td className="py-4">{index + 1}</td>
                        <td className="py-4">{team.name}</td>
                        <td className="py-4 text-center">{team.kills}</td>
                        <td className="py-4 text-center">{team.classPoints}</td>
                        <td className="py-4 w-1/6 text-center relative z-10 align-middle">
                          <div
                            className={`transition-all duration-300 text-primary font-bold text-lg hover:font-bold  `}
                          >
                            {team.total} <span className="ml-2 text-xs font-normal">pts</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-4 text-center text-gray-400">
                        No teams found matching "{searchTerm}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Results count */}
              <div className="mt-3 text-gray-400 text-sm">
                {searchTerm
                  ? `Found ${filteredTeams.length} team${
                      filteredTeams.length !== 1 ? 's' : ''
                    } matching "${searchTerm}"`
                  : `Showing all ${teams.length} teams`}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full text-white">
      {/* Tournament Table */}
      <Header />
      <table className="w-full border-collapse table-fixed">
        {/* Table Header */}
        <thead className="bg-secondary text-gray-300 font-mono uppercase text-sm">
          <tr>
            <th className="py-3 w-1/6 text-center"></th>
            <th className="py-3 w-1/6 text-left text-base">#</th>
            <th className="py-3 w-1/6 text-left text-base">Team</th>
            <th className="py-3 w-1/6 text-center text-base">Kills</th>
            <th className="py-3 w-1/6 text-center text-base">Class Points</th>
            <th className="py-3 w-1/6 text-center text-base">Total</th>
          </tr>
        </thead>

        {/* Add spacing between thead and tbody */}
        <tr className="h-2 bg-transparent"></tr>

        <tbody className="divide-y-8 divide-gray-800/30">
          {sortedTeams.map((team, index) => (
            <tr key={team.id} className="angular-cut hover:bg-gray-800/30 cursor-pointer relative">
              {/* Background image container */}
              <td colSpan={5} className="absolute inset-0 m-0 p-0 border-none">
                <div className="absolute inset-0 z-0">
                  {/* Team logo or background image */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: team.image ? `url('${team.image}')` : '',
                      backgroundSize: 'cover',
                      backgroundPosition: 'left center',
                      opacity: 0.5,
                    }}
                  ></div>

                  {/* Fade gradient overlay - Different for top 3 with gold, silver, bronze */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        index === 0
                          ? 'linear-gradient(to right, transparent 0%, rgba(255,215,0,0.3) 40%, rgba(218,165,32,0.6) 70%)' // Gold gradient for 1st
                          : index === 1
                          ? 'linear-gradient(to right, transparent 0%, rgba(192,192,192,0.3) 40%, rgba(169,169,169,0.6) 70%)' // Silver gradient for 2nd
                          : index === 2
                          ? 'linear-gradient(to right, transparent 0%, rgba(205,127,50,0.3) 40%, rgba(184,115,51,0.6) 70%)' // Bronze gradient for 3rd
                          : 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.7) 40%, black 70%)', // Original dark gradient for others
                    }}
                  ></div>
                </div>
              </td>

              {/* Rank Cell */}
              <td className="py-4 w-1/6 text-center font-custom relative z-10 align-middle">
                <div
                  className={`inline-block w-8 h-8 rounded-full ${
                    index === 0
                      ? 'bg-gradient-to-r from-yellow-300 to-yellow-600' // Gold for 1st
                      : index === 1
                      ? 'bg-gradient-to-r from-gray-300 to-gray-500' // Silver for 2nd
                      : index === 2
                      ? 'bg-gradient-to-r from-amber-600 to-amber-800' // Bronze for 3rd
                      : 'bg-gradient-to-r from-yellow-400 to-yellow-600' // Default yellow
                  } text-black font-bold flex items-center justify-center`}
                >
                  {index + 1}
                </div>
              </td>

              {/* Team Name Cell */}
              <td className="py-4 w-1/4 text-left relative z-10 pl-2 align-middle">
                <span
                  className={`font-valorant hover:text-primary transition-all duration-300 relative group ${
                    index < 3 ? 'text-white font-bold' : 'text-white'
                  }`}
                >
                  {team.name}
                  <span className="absolute -bottom-1 font-base left-0 w-0 h-0.5 bg-primtext-primary group-hover:w-full transition-all duration-300"></span>
                </span>
              </td>

              {/* Kill Points Cell */}
              <td className="py-4 w-1/6 text-center relative z-10 align-middle">
                <div className="transition-all font-base duration-300  hover:font-bold">
                  {team.kills}
                </div>
              </td>

              {/* Class Points Cell */}
              <td className="py-4 w-1/6 text-center relative z-10 align-middle">
                <div className="transition-all font-base duration-300 hover:font-bold">
                  {team.classPoints}
                </div>
              </td>

              {/* Total Points Cell */}
              <td className="py-4 w-1/6 text-center relative z-10 align-middle">
                <div
                  className={`transition-all duration-300 ${
                    index < 3 ? 'text-white font-bold' : 'text-primary font-bold'
                  } text-lg hover:font-bold`}
                >
                  {team.total}
                  <span className="ml-2 text-xs font-normal">pts</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Admin Modal */}
      <AdminModal />

      {/* Edit Team Popup Modal */}
      <EditTeamModal />
    </div>
  );
};

export default BattleRoyale;
