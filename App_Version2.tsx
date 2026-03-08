import React, { useState } from 'react';
import QuickPlayButton from './QuickPlayButton';
import GameUI from './GameUI';
import { Team } from './MatchSimulator';
import teams from './teams.json';

interface GameState {
  isPlaying: boolean;
  sport: string | null;
  mode: string | null;
  team1: Team | null;
  team2: Team | null;
}

function App() {
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    sport: null,
    mode: null,
    team1: null,
    team2: null,
  });

  const handleStartMatch = (sport: string, mode: string, team1Name: string, team2Name: string) => {
    // Find teams from teams.json
    const sportData = teams.sports[sport.toLowerCase() as keyof typeof teams.sports];
    if (!sportData) {
      alert('Sport not found');
      return;
    }

    const selectedTeam1 = sportData.teams.find(
      (t: Team) => t.name === team1Name
    );
    const selectedTeam2 = sportData.teams.find(
      (t: Team) => t.name === team2Name
    );

    if (!selectedTeam1 || !selectedTeam2) {
      alert('Teams not found');
      return;
    }

    setGameState({
      isPlaying: true,
      sport,
      mode,
      team1: selectedTeam1,
      team2: selectedTeam2,
    });
  };

  const handleMatchEnd = (summary: any) => {
    console.log('Match Summary:', summary);
    alert(`
      🏆 MATCH FINISHED!
      
      Winner: ${summary.winner}
      ${summary.team1.name}: ${summary.team1.score}
      ${summary.team2.name}: ${summary.team2.score}
      
      Total Events: ${summary.totalEvents}
    `);
  };

  return (
    <div
      style={{
        backgroundColor: '#0f0f0f',
        color: 'white',
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {!gameState.isPlaying ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <h1 style={{ fontSize: '48px', marginBottom: '30px' }}>
            ⚽🏀🏈 ULTIMATE SPORTS 🎾🏒⛳
          </h1>
          <p style={{ fontSize: '18px', opacity: 0.8, marginBottom: '40px' }}>
            Play every sport with Tournament, Exhibition, and Season modes!
          </p>
          <QuickPlayButton onStartMatch={handleStartMatch} />
        </div>
      ) : (
        <GameUI
          sport={gameState.sport!}
          mode={gameState.mode!}
          team1={gameState.team1!}
          team2={gameState.team2!}
          onMatchEnd={handleMatchEnd}
        />
      )}
    </div>
  );
}

export default App;