/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react';
import { TbTournament } from 'react-icons/tb';

const BattleRoyale = () => {
  // Sample data for the tournament with realistic stats
  const [teams, setTeams] = useState([
    { id: 1, name: "WINNERS ESPORTS", kills: 32, classPoints: 45, total: 77, image:'https://img.freepik.com/premium-vector/falcon-mascot-esport-logo-design-with-shield_1271121-37.jpg?w=740'},
    { id: 2, name: "JOKO FORCE", kills: 28, classPoints: 52, total: 80, image:'https://img.freepik.com/free-vector/flat-design-basketball-logo-logo_52683-83957.jpg?t=st=1744731320~exp=1744734920~hmac=d68cab5b1341b9c02a6cbe5da4b98bca788f89f03fda4864de01f96b8a368ba6&w=740'},
    { id: 3, name: "Old School", kills: 24, classPoints: 38, total: 62, image:'https://img.freepik.com/premium-vector/falcon-mascot-esport-logo-design-with-shield_1271121-37.jpg?w=740'},
    { id: 4, name: "Amateras", kills: 35, classPoints: 30, total: 65, image:'https://img.freepik.com/free-vector/flat-design-swimming-logo-template_23-2149368753.jpg?t=st=1744731338~exp=1744734938~hmac=7cf5f07eed1ef5071a451c91cfb2e44c93f8bf589974685253fed743fa361133&w=740' },
    { id: 5, name: "Tyranids", kills: 42, classPoints: 41, total: 83, image:'https://img.freepik.com/premium-vector/falcon-mascot-esport-logo-design-with-shield_1271121-37.jpg?w=740' },
    { id: 6, name: "FANTASMAjr", kills: 19, classPoints: 47, total: 66 },
    { id: 7, name: "TOXIC TX", kills: 38, classPoints: 49, total: 87, image:'https://img.freepik.com/free-vector/flat-design-swimming-logo-template_23-2149368753.jpg?t=st=1744731338~exp=1744734938~hmac=7cf5f07eed1ef5071a451c91cfb2e44c93f8bf589974685253fed743fa361133&w=740' },
    { id: 8, name: "TripleX.Team", kills: 21, classPoints: 35, total: 56 },
    { id: 9, name: "EQUIPE 808", kills: 26, classPoints: 33, total: 59 },
    { id: 10, name: "CSS AFRICA", kills: 31, classPoints: 40, total: 71 }
  ]);

  // Sort teams by total points
  const sortedTeams = [...teams].sort((a, b) => b.total - a.total);
  const Header = () => (
    <div className="mb-8">
      <h1 className="text-4xl flex items-center font-custom tracking-wider uppercasem">Tournament Bracket</h1>
      <div className="flex items-center text-primary">
      
      <TbTournament />
        <p className="mx-2">Manage and review tournament bracket</p>
      </div>
      
    </div>
  );
  return (
    <div className="min-h-screen w-full text-white">
      {/* Tournament Table */}
      <Header/>
      <table className="w-full border-collapse table-fixed">
        {/* Table Header */}
        <thead className="bg-secondary text-gray-300 font-mono uppercase text-sm">
          <tr>
            <th className="py-3 w-1/6 text-center"></th>
            <th className="py-3 w-1/6 text-left text-base  ">#</th>
            <th className="py-3 w-1/6 text-left text-base  ">Team</th>
            <th className="py-3 w-1/6 text-center text-base  ">Kills</th>
            <th className="py-3 w-1/6 text-center text-base  ">Class Points</th>
            <th className="py-3 w-1/6 text-center text-base  ">Total</th>
          </tr>
        </thead>  
        
        {/* Add spacing between thead and tbody */}
        <tr className="h-2 bg-transparent"></tr>
      
        <tbody className="divide-y-8 divide-gray-800/30">
          {sortedTeams.map((team, index) => (
            <tr 
              key={team.id} 
              className="angular-cut hover:bg-gray-800/30 cursor-pointer relative"
            >
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
                      opacity: 0.5
                    }}
                  ></div>
                  
                  {/* Fade gradient overlay */}
                  <div 
                    className="absolute inset-0" 
                    style={{
                      background: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.7) 40%, black 70%)'
                    }}
                  ></div>
                </div>
              </td>
              
              {/* Rank Cell */}
              <td className="py-4 w-1/6 text-center font-custom relative z-10 align-middle">
                <div className="inline-block w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold flex items-center justify-center">
                  {index + 1}
                </div>
              </td>
              
              {/* Team Name Cell */}
              <td className="py-4 w-1/4 text-left relative z-10 pl-2 align-middle">
                <span className="text-white font-valorant hover:text-primary transition-all duration-300 relative group">
                  {team.name}
                  <span className="absolute -bottom-1 font-base left-0 w-0 h-0.5 bg-primtext-primary group-hover:w-full transition-all duration-300"></span>
                </span>
              </td>
              
              {/* Kill Points Cell */}
              <td className="py-4 w-1/6 text-center relative z-10 align-middle">
                <div className="transition-all font-base duration-300 hover:text-red-400 hover:font-bold">
                  {team.kills}
                </div>
              </td>
              
              {/* Class Points Cell */}
              <td className="py-4 w-1/6 text-center relative z-10 align-middle">
                <div className="transition-all font-base duration-300 hover:text-blue-400 hover:font-bold">
                  {team.classPoints}
                </div>
              </td>
              
              {/* Total Points Cell */}
             {/* Total Points Cell */}
             <td className="py-4 w-1/6 text-center relative z-10 align-middle">
                  <div className={`transition-all duration-300 text-primary font-bold text-lg hover:font-bold  `}>
                    {team.total}                      <span className="ml-2 text-xs font-normal">pts</span>

                  
                  </div>
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BattleRoyale;