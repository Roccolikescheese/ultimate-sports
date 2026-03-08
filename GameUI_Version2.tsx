import React, { useState, useEffect } from 'react';
import MatchSimulator, { MatchState } from './MatchSimulator';
import Scoreboard from './Scoreboard';
import PlayerStatsTracker from './PlayerStatsTracker';
import { Team } from './MatchSimulator';

interface GameUIProps {
  sport: string;
  mode: string;
  team1: Team;
  team2: Team;
  onMatchEnd?: (summary: any) => void;
}

export const GameUI: React.FC<GameUIProps> = ({ sport, mode, team1, team2, onMatchEnd }) => {
  const [matchState, setMatchState] = useState<MatchState | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [simulator, setSimulator] = useState<MatchSimulator | null>(null);

  useEffect(() => {
    const newSimulator = new MatchSimulator(sport, mode, team1, team2);
    setSimulator(newSimulator);
    setMatchState(newSimulator.getMatchState());
  }, [sport, mode, team1, team2]);

  const handlePlayPause = () => {
    if (!simulator) return;

    setIsPlaying(!isPlaying);

    if (!isPlaying) {
      simulator.startSimulation((state) => {
        setMatchState(state);

        // Update recent events
        if (state.events.length > 0) {
          const newEvents = state.events.slice(-5);
          setRecentEvents(newEvents);
        }

        // Check if match finished
        if (state.gameStatus === 'finished') {
          setIsPlaying(false);
          onMatchEnd?.(simulator.getMatchSummary());
        }
      });
    }
  };

  if (!matchState) {
    return <div style={{ color: 'white', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div
      style={{
        backgroundColor: '#0f0f0f',
        color: 'white',
        minHeight: '100vh',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
          🎮 {sport} - {mode} Mode
        </h1>

        {/* Scoreboard */}
        <Scoreboard matchState={matchState} />

        {/* Control Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            marginBottom: '30px',
          }}
        >
          <button
            onClick={handlePlayPause}
            style={{
              padding: '12px 30px',
              fontSize: '16px',
              fontWeight: 'bold',
              backgroundColor: isPlaying ? '#ff6b6b' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isPlaying ? '#ff5252' : '#45a049';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isPlaying ? '#ff6b6b' : '#4CAF50';
            }}
          >
            {isPlaying ? '⏸ PAUSE' : '▶ PLAY'}
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              const newSimulator = new MatchSimulator(sport, mode, team1, team2);
              setSimulator(newSimulator);
              setMatchState(newSimulator.getMatchState());
              setRecentEvents([]);
            }}
            style={{
              padding: '12px 30px',
              fontSize: '16px',
              fontWeight: 'bold',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#0b7dda';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#2196F3';
            }}
          >
            🔄 RESTART
          </button>
        </div>

        {/* Main Content Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '30px',
          }}
        >
          {/* Team 1 Players */}
          <PlayerStatsTracker team={matchState.team1} teamName="team1" />

          {/* Team 2 Players */}
          <PlayerStatsTracker team={matchState.team2} teamName="team2" />
        </div>

        {/* Live Events Feed */}
        <div
          style={{
            backgroundColor: '#1a1a1a',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '30px',
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: '15px', color: '#ff6b6b' }}>
            📊 Live Events
          </h2>
          <div
            style={{
              maxHeight: '300px',
              overflowY: 'auto',
              borderRadius: '6px',
              backgroundColor: '#0f0f0f',
              padding: '10px',
            }}
          >
            {recentEvents.length === 0 ? (
              <div style={{ opacity: 0.6, textAlign: 'center', padding: '20px' }}>
                No events yet. Click PLAY to start!
              </div>
            ) : (
              <div>
                {recentEvents.map((event, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '10px',
                      marginBottom: '8px',
                      backgroundColor: '#2a2a2a',
                      borderLeft: `3px solid ${
                        event.team === 'team1'
                          ? matchState.team1.color
                          : matchState.team2.color
                      }`,
                      borderRadius: '4px',
                      animation: 'slideIn 0.3s ease-out',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontWeight: 'bold' }}>
                        {event.team === 'team1'
                          ? matchState.team1.name
                          : matchState.team2.name}
                      </span>
                      <span
                        style={{
                          backgroundColor:
                            event.type === 'score' ? '#4CAF50' : '#ff9800',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                        }}
                      >
                        {event.type.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ fontSize: '14px', marginTop: '5px', opacity: 0.8 }}>
                      {event.description}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Match Status */}
        {matchState.gameStatus === 'finished' && (
          <div
            style={{
              backgroundColor: '#1a1a1a',
              border: '2px solid #ff6b6b',
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'center',
            }}
          >
            <h2 style={{ margin: '0 0 15px 0', color: '#ff6b6b' }}>🏆 MATCH FINISHED</h2>
            <div style={{ fontSize: '24px', marginBottom: '15px', fontWeight: 'bold' }}>
              {matchState.team1.score === matchState.team2.score
                ? 'FINAL: TIE 🤝'
                : matchState.team1.score > matchState.team2.score
                ? `${matchState.team1.name} WINS! 🎉`
                : `${matchState.team2.name} WINS! 🎉`}
            </div>
            <div style={{ fontSize: '18px', opacity: 0.8 }}>
              {matchState.team1.name}: {matchState.team1.score} -{' '}
              {matchState.team2.name}: {matchState.team2.score}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        div::-webkit-scrollbar {
          width: 8px;
        }

        div::-webkit-scrollbar-track {
          background: #0f0f0f;
        }

        div::-webkit-scrollbar-thumb {
          background: #444;
          border-radius: 4px;
        }

        div::-webkit-scrollbar-thumb:hover {
          background: #666;
        }
      `}</style>
    </div>
  );
};

export default GameUI;