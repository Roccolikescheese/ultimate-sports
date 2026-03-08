import React, { useState } from 'react';
import { Team } from './MatchSimulator';

interface PlayerStatsTrackerProps {
  team: Team;
  teamName: 'team1' | 'team2';
}

export const PlayerStatsTracker: React.FC<PlayerStatsTrackerProps> = ({ team, teamName }) => {
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null);

  return (
    <div
      style={{
        backgroundColor: '#2a2a2a',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '15px',
      }}
    >
      <h3
        style={{
          color: team.color,
          margin: '0 0 15px 0',
          fontSize: '16px',
          fontWeight: 'bold',
        }}
      >
        {team.name} - Players
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '10px',
        }}
      >
        {team.players.map((player) => (
          <div
            key={player.id}
            onClick={() =>
              setExpandedPlayer(expandedPlayer === player.id ? null : player.id)
            }
            style={{
              backgroundColor: '#333',
              padding: '12px',
              borderRadius: '6px',
              cursor: 'pointer',
              border: expandedPlayer === player.id ? `2px solid ${team.color}` : '1px solid #444',
              transition: 'all 0.3s ease',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <span style={{ fontWeight: 'bold', color: '#fff' }}>#{player.number}</span>
              <span style={{ fontSize: '12px', opacity: 0.7 }}>{player.position}</span>
            </div>
            <div style={{ fontSize: '14px', marginBottom: '8px' }}>{player.name}</div>

            {expandedPlayer === player.id && (
              <div
                style={{
                  borderTop: `1px solid ${team.color}`,
                  paddingTop: '10px',
                  marginTop: '10px',
                  fontSize: '12px',
                }}
              >
                {Object.entries(player.stats).map(([key, value]) => (
                  <div key={key} style={{ opacity: 0.8, marginBottom: '5px' }}>
                    <strong>{key}:</strong> {value}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerStatsTracker;