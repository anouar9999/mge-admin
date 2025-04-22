import { FaMedal, FaTrophy } from 'react-icons/fa';

// Component to display knockout stage (after group stage)
const PlayoffsBracket = ({ groups }) => {
  // Get top 2 teams from each group for playoffs
  const qualifiedTeams = groups.map((group) => {
    // Sort standings by points (just to be sure)
    const sortedStandings = [...group.standings].sort((a, b) => b.points - a.points);
    return {
      groupName: group.name,
      winner: sortedStandings[0] || { teamName: 'TBD', teamImage: null },
      runnerUp: sortedStandings[1] || { teamName: 'TBD', teamImage: null },
    };
  });

  // Mock playoff results (this would come from your database in a real application)
  const semifinalResults = [
    { homeScore: 3, awayScore: 1, played: true },
    { homeScore: 2, awayScore: 2, penalties: '5-4', played: true },
  ];

  const finalResult = { homeScore: 4, awayScore: 2, played: true };
  const thirdPlaceResult = { homeScore: 3, awayScore: 0, played: false };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="overflow-x-auto">
        <div className="w-full h-[600px] relative">
          {/* Background pattern */}
          <div className="absolute inset-0 z-0 opacity-5">
            <div
              className="absolute inset-0 bg-repeat"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
              }}
            ></div>
          </div>

          {/* Connection lines */}

          {/* Semifinals Column */}
          <div className="w-56 h-full">
            <div className="text-lg font-bold mb-6 text-center text-primary">Semifinals</div>

            {/* Semifinal 1 */}
            <div className="mb-24">
              <MatchCard
                homeTeam={qualifiedTeams[0]?.winner}
                awayTeam={qualifiedTeams[1]?.runnerUp}
                result={semifinalResults[0]}
                matchId="SF1"
              />
            </div>

            {/* Semifinal 2 */}
            <div>
              <MatchCard
                homeTeam={qualifiedTeams[1]?.winner}
                awayTeam={qualifiedTeams[2]?.runnerUp}
                result={semifinalResults[1]}
                matchId="SF2"
              />
            </div>
          </div>

          {/* Finals Column */}
          <div className="absolute left-64 top-20 w-56 h-full">
            {/* Final */}
            <div className="mb-24">
              <div className="text-lg font-bold mb-6 text-center text-yellow-500 flex justify-center items-center">
                <FaTrophy className="mr-2" /> Final
              </div>
              <MatchCard
                homeTeam={
                  semifinalResults[0].homeScore > semifinalResults[0].awayScore
                    ? qualifiedTeams[0]?.winner
                    : qualifiedTeams[1]?.runnerUp
                }
                awayTeam={
                  semifinalResults[1].homeScore > semifinalResults[1].awayScore ||
                  semifinalResults[1].penalties
                    ? qualifiedTeams[1]?.winner
                    : qualifiedTeams[2]?.runnerUp
                }
                result={finalResult}
                matchId="Final"
                highlight={true}
              />
            </div>

            {/* Third Place Match */}
            <div>
              <div className="text-lg font-bold mb-6 text-center text-amber-600 flex justify-center items-center">
                <FaMedal className="mr-2" /> Third Place
              </div>
              <MatchCard
                homeTeam={
                  semifinalResults[0].homeScore < semifinalResults[0].awayScore
                    ? qualifiedTeams[0]?.winner
                    : qualifiedTeams[1]?.runnerUp
                }
                awayTeam={
                  semifinalResults[1].homeScore < semifinalResults[1].awayScore &&
                  !semifinalResults[1].penalties
                    ? qualifiedTeams[1]?.winner
                    : qualifiedTeams[2]?.runnerUp
                }
                result={thirdPlaceResult}
                matchId="3rd"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// Component for team card (group winners/runners-up)
const TeamCard = ({ team, position, type, score }) => {
  return (
    <div className={`p-1 rounded-md relative overflow-hidden angular-cut `}>
      {/* Background image with overlay */}
      {team.teamImage && (
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${team.teamImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.2,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                type === 'winner'
                  ? 'linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5))'
                  : 'linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5))',
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex items-center justify-between relative z-10 px-1">
        <div className="flex-1 min-w-0 font-mono">
          <div className={`text-xs ${type === 'winner' ? 'text-yellow-500' : 'text-gray-400'}`}>
            {position}
          </div>
          <div className="font-valorant text-md truncate">{team.teamName || 'TBD'}</div>
        </div>

        {/* Score Element */}
        {/* {score !== undefined && (
          <div className="ml-2 flex-shrink-0">
            <div className={`font-free-fire text-xl ${
              type === 'winner' ? 'text-primary' : 'text-white'
            }`}>
              {score}
            </div>
          </div>
        )} */}
        <div className=" flex-shrink-0">
          <div
            className={`font-free-fire text-lg ${
              type === 'winner' ? 'text-primary' : 'text-white'
            }`}
          >
            5
          </div>
        </div>
      </div>
    </div>
  );
};

// Component for match card (semifinals, final, 3rd place)
const MatchCard = ({ homeTeam, awayTeam, result, matchId, highlight = false }) => {
  return (
    <div className="mb-8">
      {/* Group Winner */}
      <div className="mb-2">
        <TeamCard team={homeTeam} position="1st" type="winner" />
      </div>

      {/* Group Runner-up */}
      <div>
        <TeamCard team={awayTeam} position="2nd" type="runner-up" />
      </div>
    </div>
  );
};
export default PlayoffsBracket;
