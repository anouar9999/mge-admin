import { Activity, Award, CheckCircle, Edit, Flame, Mail, MoreVertical, Shield, Trash2, Users } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from "react";

const ProfileCard = ({ user, onEdit, onDelete }) => {
  const { 
    id,
    username = "User", 
    email = "",
    type = "player",
    points = 0,
    is_verified = false,
    avatar,
    sources = email ? ["Email"] : [],
    engagement = Math.min(5, Math.ceil(points / 200))
  } = user || {};
  
  const [showActions, setShowActions] = useState(false);
  const actionsRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target) && showActions) {
        setShowActions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActions]);
  
  const handleEdit = () => {
    setShowActions(false);
    onEdit && onEdit(user);
  };
  
  const handleDelete = () => {
    setShowActions(false);
    onDelete && onDelete(id);
  };
  
  // Engagement visualization with tooltip
  const renderEngagementDots = () => {
    const colors = [
      "bg-red-400",
      "bg-orange-400",
      "bg-yellow-400", 
      "bg-lime-400",
      "bg-green-400"
    ];
    
    return (
      <div className="flex items-center space-x-1 group relative">
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-40 bg-gray-900 text-xs text-gray-200 py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Engagement Level: {engagement}/5
        </div>
        {colors.map((color, index) => (
          <motion.div 
            key={index} 
            className={`w-3 h-3 rounded-full ${index < engagement ? color : "bg-gray-700"}`}
            whileHover={{ scale: 1.2 }}
            initial={{ scale: 0.9, opacity: 0.7 }}
            animate={{ 
              scale: index < engagement ? 1 : 0.9, 
              opacity: index < engagement ? 1 : 0.5 
            }}
            transition={{ duration: 0.2 }}
          />
        ))}
      </div>
    );
  };
  
 
  
  // Gradient background based on user type
  const getCardGradient = () => {
    switch(type.toLowerCase()) {
      case 'admin':
        return "bg-gradient-to-br from-purple-950 to-gray-900";
      case 'organizer':
        return "bg-gradient-to-br from-blue-950 to-gray-900";
      default:
        return "bg-secondary";
    }
  };
  
  return (
    <motion.div
      className={`${getCardGradient()} angular-cut shadow-lg overflow-hidden  transition-all duration-200`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ 
        y: -5, 
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
        borderColor: type.toLowerCase() === 'admin' ? "#9F7AEA" : 
                    type.toLowerCase() === 'organizer' ? "#63B3ED" : "#4B5563"
      }}
    >
      <div className="relative p-5">
      
        
        {/* Top section with avatar and actions */}
        <div className="flex justify-between items-start mb-2">
          <motion.div 
            className="w-16 h-16 rounded-full overflow-hidden bg-gray-800 flex-shrink-0 "
            whileHover={{ scale: 1.05, borderColor: "#6B7280" }}
          >
            {avatar ? (
              <img
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${avatar}`}
                alt={username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold bg-gradient-to-br from-gray-700 to-gray-900">
                {username.charAt(0).toUpperCase()}
              </div>
            )}
          </motion.div>
          
          <div className="relative" ref={actionsRef}>
            <motion.button
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowActions(!showActions)}
              aria-label="User actions"
            >
              <MoreVertical className="w-4 h-4 text-white" />
            </motion.button>
            
            <AnimatePresence>
              {showActions && (
                <motion.div 
                  className="absolute top-10 right-0 bg-dark rounded-lg shadow-lg p-2 z-10 w-36 "
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                >
                  <div className="flex flex-col space-y-1">
                    <motion.button 
                      onClick={handleEdit}
                      className="flex items-center px-3 py-2 hover:bg-gray-800 rounded text-sm text-gray-300 w-full text-left"
                      whileHover={{ x: 2 }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </motion.button>
                    <motion.button 
                      onClick={handleDelete}
                      className="flex items-center px-3 py-2 hover:bg-red-900 rounded text-sm text-red-400 w-full text-left"
                      whileHover={{ x: 2 }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* User information */}
        <div className="mb-5">
          <div className="flex items-center ">
            <h3 className="text-lg text-white mr-2 uppercase font-valorant">{username}</h3>
            {is_verified && 
              <CheckCircle className="w-4 h-4 text-green-500" title="Verified Account" />
            }
          </div>
          
          {email && (
            <div className="flex items-center text-sm text-gray-400 mb-2">
              <Mail className="w-3 h-3 mr-2" />
              <p className="truncate" title={email}>{email}</p>
            </div>
          )}
        </div>
        
        {/* User stats */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
            <motion.span 
            className="px-2 py-1 bg-gray-800 text-gray-300 angular-cut text-xs flex items-center"
            whileHover={{ scale: 1.05, backgroundColor: "#1F2937" }}
          >
            <Users className="w-3 h-3 mr-1" />
            Player
          </motion.span>
              
              <motion.div 
                className="flex items-center px-2 py-1 bg-amber-900/40 text-amber-400 angular-cut text-xs"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(146, 64, 14, 0.4)" }}
              >
                <Award className="w-3 h-3 mr-1" />
                {points.toLocaleString()} pts
              </motion.div>
            </div>
          </div>
          
          {/* Engagement level */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
            <div className="text-xs text-gray-500 flex items-center">
              <Activity className="w-3 h-3 mr-1" />
              Activity Level:
            </div>
            <div className="flex items-center" title="User Engagement">
              <Flame className="w-4 h-4 text-orange-500 mr-2" />
              {renderEngagementDots()}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export default ProfileCard;