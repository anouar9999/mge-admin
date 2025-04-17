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
    total_members, 
    owner_username,
    wins ,
    losses,
    win_rate,
    tier = "professional",
    division = "diamond"
  } = team;
  
  const matches = wins + losses;
  
  
  
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
  


  return (
    <motion.div 
      className={`angular-cut overflow-hidden relative bg-secondary`}
      initial={{ opacity: 0.9, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
     
      
    >
 
      

      {/* Banner with game image */}
      <div className="h-24 relative overflow-hidden">
        <img 
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${team.banner}`} 
          alt={team.name} 
          className="w-full h-full object-cover opacity-60"
        />
      
        
        {/* Game badge */}
        <div 
  className="absolute bottom-0 right-0 px-2.5 py-1 text-xs font-medium flex items-center  overflow-hidden "
  style={{ 
    backgroundImage: `url(${team.game.image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backdropFilter: 'blur(8px)'
  }}
>
  {/* Dark overlay */}
  <div 
    className="absolute inset-0 bg-black/50 z-0"
    style={{ mixBlendMode: 'multiply' }}
  ></div>
  
  {/* Content (on top of the overlay) */}
  <span className="relative z-10 text-white">
    {team.game.name}
  </span>
</div>
        
        {/* Action buttons - MOVED TO TOP RIGHT */}
        <div className="absolute top-2 right-2 flex gap-2 z-10">
          <motion.button
            onClick={() => onEdit(team)}
            className="p-1.5 rounded-lg backdrop-blur-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            
          >
            <Edit className="h-4 w-4" />
          </motion.button>
          <motion.button
            onClick={() => onDelete(id)}
            className="p-1.5 rounded-lg backdrop-blur-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ 
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
            className="w-16 h-16 rounded-lg overflow-hidden shadow-lg -mt-12 mr-3 flex-shrink-0"
            whileHover={{ scale: 1.05 }}
           
          >
            {team.logo ? (
              <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${team.logo}`} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-dark">
                <span className="text-xl font-bold" >{name.charAt(0).toUpperCase()}</span>
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
            <Users className="w-3.5 h-3.5 mr-1"  />
            <span>{total_members} members</span>
          </div>
          {/* <div className="flex items-center">
            <Award className="w-3.5 h-3.5 mr-1" />
            <span>{owner_username}</span>
          </div> */}
        </div>
        
        {/* Stats grid */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {/* Wins */}
          <div 
            className="angular-cut p-2 text-center"
            style={{ 
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.03)'
            }}
          >
            <div className="text-primary text-xs font-valorant">WINS</div>
            <div 
              className="text-lg font-bold mt-0.5"
            >
              {wins}
            </div>
          </div>
          
          {/* Matches */}
          <div 
            className="angular-cut p-2 text-center"
            style={{ 
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.03)'
            }}
          >
            <div className="text-primary text-xs font-valorant">MATCHES</div>
            <div 
              className="text-lg font-bold mt-0.5"
            >
              {matches}
            </div>
          </div>
          
          {/* Points */}
          <div 
            className="angular-cut p-2 text-center"
            style={{ 
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.03)'
            }}
          >
            <div className="text-primary text-xs font-valorant">POINTS</div>
            <div 
              className="text-lg font-bold mt-0.5"
            >
              {
win_rate
.toLocaleString()}
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
        console.log(response.data)
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

const handleEditTeam = async (formData) => {
    setLoading(true);
    try {
        // Ensure the form data contains the ID
        if (!formData.get('id') && editingTeam?.id) {
            formData.append('id', editingTeam.id);
        }

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/edit_team.php`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        );

        if (response.data.success) {
            // Refresh teams data instead of manually updating
            fetchTeams();
            showToast('Team updated successfully', 'success', 1500);
            setEditingTeam(null);
        } else {
            setError(response.data.message || 'Failed to update team');
            showToast(response.data.message || 'Failed to update team', 'error', 1500);
        }
    } catch (err) {
        setError('Error updating team: ' + err.message);
        showToast(`Error updating team: ${err.message}`, 'error', 1500);
        console.error('Update error:', err);
    } finally {
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