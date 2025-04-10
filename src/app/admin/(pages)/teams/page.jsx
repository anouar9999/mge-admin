'use client';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { X, Edit, Trash2, Eye, EyeOff, Loader2, Search, Users, Shield, Award, Trophy, Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import EditTeamModal from './EditTeamModal';
import { useToast } from '@/utils/ToastProvider';
import LoadingScreen from '@/app/loading';
import { TbTournament } from 'react-icons/tb';

const TeamCard = ({ team, onEdit, onDelete }) => {
  const { 
    id,
    name, 
    team_game, 
    total_members, 
    image, 
    owner_username,
    wins = Math.floor(Math.random() * 100),
    losses = Math.floor(Math.random() * 50),
    points = Math.floor(Math.random() * 50000),
    tier = "professional",
    division = "diamond"
  } = team;
  
  const matches = wins + losses;
  const winRate = matches > 0 ? Math.round((wins / matches) * 100) : 0;
  
  // Game themes with refined aesthetics
  const gameThemes = {
    'Valorant': {
      primary: '#FF4655',
      secondary: '#0F1923',
      accent: '#18E4B7',
      cardBg: 'bg-gradient-to-br from-[#1F2326] to-[#16171B]',
      pattern: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff4655' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      banner: "https://www.riotgames.com/darkroom/1440/8d5c497da1c2eeec8cffa99b01abc64b:5329ca773963a5b739e98e715957ab39/ps-f2p-val-console-launch-16x9.jpg"
    },
    'Free Fire': {
      primary: '#FF9D00',
      secondary: '#18191A',
      accent: '#F5515F',
      cardBg: 'bg-gradient-to-br from-[#1D1C1A] to-[#141412]',
      pattern: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff9d00' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      banner: "https://cdn12.idcgames.com/storage/image/1258/free-new-logo/default.jpg"
    },
    'Street Fighter': {
      primary: '#0075C9',
      secondary: '#0D1F2D',
      accent: '#FFDD00',
      cardBg: 'bg-gradient-to-br from-[#131F2C] to-[#0B161F]',
      pattern: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230075c9' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      banner: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    'Call of Duty': {
      primary: '#41AF53',
      secondary: '#1C2124',
      accent: '#FFFFFF',
      cardBg: 'bg-gradient-to-br from-[#1E2326] to-[#14171A]',
      pattern: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2341af53' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      banner: "https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchui/blog/hero/mw-wz/WZ-Season-Three-Roadmap-TOUT.jpg"
    },
    'PUBG': {
      primary: '#F2A900',
      secondary: '#131313',
      accent: '#E63E2D',
      cardBg: 'bg-gradient-to-br from-[#1A1A1A] to-[#0E0E0E]',
      pattern: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f2a900' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      banner: "https://wstatic-prod.pubg.com/web/live/static/og/img-og-pubg.jpg"
    },
    'League of Legends': {
      primary: '#0AC8B9',
      secondary: '#091428',
      accent: '#C89B3C',
      cardBg: 'bg-gradient-to-br from-[#0A1428] to-[#06111D]',
      pattern: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230ac8b9' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      banner: "https://www.leagueoflegends.com/static/open-graph-2e582ae9fae8b0b396ca46ff21fd47a8.jpg"
    },
    'default': {
      primary: '#9147FF',
      secondary: '#15091F',
      accent: '#00E5A0',
      cardBg: 'bg-gradient-to-br from-[#1E1425] to-[#120A18]',
      pattern: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239147ff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      banner: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
  };

  const theme = gameThemes[team_game] || gameThemes.default;
  
  // Division styling with modern aesthetics
  const getDivisionData = (div) => {
    switch(div?.toLowerCase()) {
      case 'diamond': 
        return {
          color: '#00CFFF',
          gradient: 'linear-gradient(135deg, #00CFFF20, #00CFFF00)',
          border: 'border-[#00CFFF60]',
          icon: <Shield className="w-3.5 h-3.5" stroke="#00CFFF" />
        };
      case 'platinum': 
        return {
          color: '#E5E4E2',
          gradient: 'linear-gradient(135deg, #E5E4E220, #E5E4E200)',
          border: 'border-[#E5E4E260]',
          icon: <Shield className="w-3.5 h-3.5" stroke="#E5E4E2" />
        };
      case 'gold': 
        return {
          color: '#FFD700',
          gradient: 'linear-gradient(135deg, #FFD70020, #FFD70000)',
          border: 'border-[#FFD70060]',
          icon: <Shield className="w-3.5 h-3.5" stroke="#FFD700" />
        };
      case 'silver': 
        return {
          color: '#C0C0C0',
          gradient: 'linear-gradient(135deg, #C0C0C020, #C0C0C000)',
          border: 'border-[#C0C0C060]',
          icon: <Shield className="w-3.5 h-3.5" stroke="#C0C0C0" />
        };
      case 'bronze': 
        return {
          color: '#CD7F32',
          gradient: 'linear-gradient(135deg, #CD7F3220, #CD7F3200)',
          border: 'border-[#CD7F3260]',
          icon: <Shield className="w-3.5 h-3.5" stroke="#CD7F32" />
        };
      default: 
        return {
          color: '#FFFFFF',
          gradient: 'linear-gradient(135deg, #FFFFFF20, #FFFFFF00)',
          border: 'border-[#FFFFFF60]',
          icon: <Shield className="w-3.5 h-3.5" stroke="#FFFFFF" />
        };
    }
  };
  
  const divisionData = getDivisionData(division);
  
  // Tier icons with matching aesthetic
  const getTierData = (tier) => {
    switch(tier?.toLowerCase()) {
      case 'professional': 
        return {
          icon: <Trophy className="w-3.5 h-3.5" />,
          label: 'PRO',
          color: '#FFD700'
        };
      case 'semi-pro': 
        return {
          icon: <Star className="w-3.5 h-3.5" />,
          label: 'SEMI-PRO',
          color: '#C0C0C0'
        };
      case 'amateur': 
        return {
          icon: <Zap className="w-3.5 h-3.5" />,
          label: 'AMATEUR',
          color: '#CD7F32'
        };
      default: 
        return {
          icon: <Zap className="w-3.5 h-3.5" />,
          label: 'AMATEUR',
          color: '#FFFFFF'
        };
    }
  };
  
  const tierData = getTierData(tier);
  
  // Generate team tag
  const teamTag = name.substring(0, 3).toUpperCase();

  return (
    <motion.div 
      className={`rounded-xl overflow-hidden relative bg-secondary border border-white/5`}
      initial={{ opacity: 0.9, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -5,
        boxShadow: `0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 0 10px 1px ${theme.primary}30`,
        transition: { duration: 0.2 }
      }}
      style={{
        backgroundImage: theme.pattern
      }}
    >
 
      

      {/* Banner with game image */}
      <div className="h-24 relative overflow-hidden">
        <img 
          src={theme.banner} 
          alt={team_game} 
          className="w-full h-full object-cover opacity-60"
        />
        <div 
          className="absolute inset-0" 
          style={{ 
            background: `linear-gradient(to bottom, ${theme.secondary}30, ${theme.secondary})`,
            mixBlendMode: 'multiply'
          }}
        ></div>
        
        {/* Game badge */}
        <div 
          className="absolute top-0 left-0 px-2.5 py-1  text-xs font-medium flex items-center"
          style={{ 
            background: `linear-gradient(135deg, ${theme.primary}30, ${theme.primary}10)`,
            color: theme.primary,
            backdropFilter: 'blur(8px)'
          }}
        >
          {team_game}
        </div>
        
        {/* Action buttons - MOVED TO TOP RIGHT */}
        <div className="absolute top-2 right-2 flex gap-2 z-10">
          <motion.button
            onClick={() => onEdit(team)}
            className="p-1.5 rounded-lg backdrop-blur-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ 
              background: `${theme.secondary}80`,
              border: `1px solid ${theme.primary}30`,
              color: theme.primary
            }}
          >
            <Edit className="h-4 w-4" />
          </motion.button>
          <motion.button
            onClick={() => onDelete(id)}
            className="p-1.5 rounded-lg backdrop-blur-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ 
              background: `${theme.secondary}80`,
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444'
            }}
          >
            <Trash2 className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      {/* Team info area */}
      <div className="px-4 pt-4 pb-3 relative">
        {/* Team logo */}
        <div className="flex items-start">
          <motion.div 
            className="w-16 h-16 rounded-lg overflow-hidden border border-white/10 shadow-lg -mt-12 mr-3 flex-shrink-0"
            whileHover={{ scale: 1.05 }}
           
          >
            {image ? (
              <img src={image} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-xl font-bold" style={{ color: theme.primary }}>{name.charAt(0).toUpperCase()}</span>
              </div>
            )}
          </motion.div>

          {/* Team name and badges */}
          <div className="flex-1">
            <h3 className="text-lg font-custom tracking-widest text-white leading-tight truncate">{name}</h3>
            
            {/* Tier and division badges */}
            <div className="flex items-center mt-1.5 gap-2">
              <div 
                className={`flex items-center px-2 py-0.5 rounded text-xs ${divisionData.border}`}
                style={{ 
                  background: divisionData.gradient,
                  color: divisionData.color
                }}
              >
                {divisionData.icon}
                <span className="ml-1 font-medium">{division.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* User info and details */}
        <div className="mt-3 flex items-center justify-between text-xs text-white/60">
          <div className="flex items-center">
            <Users className="w-3.5 h-3.5 mr-1" style={{ color: theme.accent }} />
            <span>{total_members} members</span>
          </div>
          <div className="flex items-center">
            <Award className="w-3.5 h-3.5 mr-1" style={{ color: theme.accent }} />
            <span>{owner_username}</span>
          </div>
        </div>
        
        {/* Stats grid */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {/* Wins */}
          <div 
            className="rounded-lg p-2 text-center"
            style={{ 
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.03)'
            }}
          >
            <div className="text-white/60 text-xs font-medium">WINS</div>
            <div 
              className="text-lg font-bold mt-0.5"
              style={{ color: theme.primary }}
            >
              {wins}
            </div>
          </div>
          
          {/* Matches */}
          <div 
            className="rounded-lg p-2 text-center"
            style={{ 
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.03)'
            }}
          >
            <div className="text-white/60 text-xs font-medium">MATCHES</div>
            <div 
              className="text-lg font-bold mt-0.5"
              style={{ color: theme.primary }}
            >
              {matches}
            </div>
          </div>
          
          {/* Points */}
          <div 
            className="rounded-lg p-2 text-center"
            style={{ 
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.03)'
            }}
          >
            <div className="text-white/60 text-xs font-medium">POINTS</div>
            <div 
              className="text-lg font-bold mt-0.5"
              style={{ color: theme.primary }}
            >
              {points.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};



const TeamManagement = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTeam, setEditingTeam] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useToast();

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get_teams.php`);
      if (response.data.success) {
        setTeams(response.data.data || []);
      } else {
        setError(response.data.error || 'Failed to fetch teams');
      }
    } catch (err) {
      setError('Error fetching teams: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const handleEditTeam = async (editedTeam) => {
    setLoading(true);
    try {
        const response = await axios.put(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/edit_team.php`,
            {
                ...editedTeam,
                id: editedTeam.id // Ensure id is included
            }
        );
        if (response.data.success) {
            setTeams(teams.map(team => 
                team.id === editedTeam.id ? { ...team, ...editedTeam } : team
            ));
            showToast('Team updated successfully', 'success',1500);
            setEditingTeam(null);
        } else {
            setError(response.data.message || 'Failed to update team');
        }
    } catch (err) {
        setError('Error updating team: ' + err.message);
        showToast(`Error updating team: ${err.message}`, 'error',1500);

        console.error('Update error:', err);
    }finally {
        setLoading(false);
    }
};

  const handleDeleteTeam = async (teamId) => {
    if (!window.confirm('Are you sure you want to delete this team?')) return;
    setLoading(true);

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete_team.php`,
        { data: { team_id: teamId } }
      );
      if (response.data.success) {
        setTeams(teams.filter(team => team.id !== teamId));
        showToast('Team deleted successfully', 'success',1500);
      } else {
        setError(response.data.message || 'Failed to delete team');
        
      }
    } catch (err) {
      setError('Error deleting team: ' + err.message);
      showToast(`Error deleting team: ${err.message}`, 'error',1500);
    } finally {
      setLoading(false);}
  };

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.team_game.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
     return (
     <LoadingScreen/>
     );
   }

  return (
    <div className="container mx-auto px-4 py-8  ">
       <div className="mb-6">
              <div className="flex items-center text-primary ">
                <TbTournament />
                <p className="mx-2 font-semibold uppercase tracking-wider"> Teams Management</p>
              </div>
      
              <h1 className="text-3xl flex items-center font-custom tracking-wider uppercase">
              Manage and monitor teams
              </h1>
            </div>
    

            <div className=" mb-8 gap-4 grid grid-cols-1 md:grid-cols-3">
            <div className="relative md:col-span-2">
      <input
            type="text"
            placeholder="Search teams by name or game"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-secondary text-white angular-cut pl-10 focus:outline-none"
          />
<Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTeams.map(team => (
          <>
          <TeamCard
            key={team.id}
            team={team}
            onEdit={setEditingTeam}
            onDelete={handleDeleteTeam}
          />
          <TeamCard
            key={team.id}
            team={team}
            onEdit={setEditingTeam}
            onDelete={handleDeleteTeam}
          /><TeamCard
          key={team.id}
          team={team}
          onEdit={setEditingTeam}
          onDelete={handleDeleteTeam}
        /><TeamCard
        key={team.id}
        team={team}
        onEdit={setEditingTeam}
        onDelete={handleDeleteTeam}
      /><TeamCard
      key={team.id}
      team={team}
      onEdit={setEditingTeam}
      onDelete={handleDeleteTeam}
    /><TeamCard
    key={team.id}
    team={team}
    onEdit={setEditingTeam}
    onDelete={handleDeleteTeam}
  />
          </>
        ))}
      </div>

      {filteredTeams.length === 0 && !loading && (
        <div className="text-center text-gray-400 mt-8">
          <Users size={48} className="mx-auto mb-4" />
          <p>No teams found matching.</p>
        </div>
      )}

      {editingTeam && (
        <EditTeamModal
          isOpen={!!editingTeam}
          onClose={() => setEditingTeam(null)}
          team={editingTeam}
          onSave={handleEditTeam}
        />
      )}
    </div>
  );
};

export default TeamManagement;