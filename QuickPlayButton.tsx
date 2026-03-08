import React, { useState } from 'react';

const QuickPlayButton = () => {
    const [sport, setSport] = useState('Soccer'); // Default sport
    const [gameMode, setGameMode] = useState('Casual'); // Default game mode

    const handleSportChange = (event) => {
        setSport(event.target.value);
    };

    const handleGameModeChange = (event) => {
        setGameMode(event.target.value);
    };

    const startQuickPlay = () => {
        // Logic to start a quick play match
        console.log(`Starting quick play: ${sport} - ${gameMode}`);
    };

    return (
        <div>
            <h1>Quick Play Match</h1>
            <div>
                <label>Sport:
                    <select value={sport} onChange={handleSportChange}>
                        <option value="Soccer">Soccer</option>
                        <option value="Basketball">Basketball</option>
                        <option value="Tennis">Tennis</option>
                        <option value="Baseball">Baseball</option>
                    </select>
                </label>
            </div>
            <div>
                <label>Game Mode:
                    <select value={gameMode} onChange={handleGameModeChange}>
                        <option value="Casual">Casual</option>
                        <option value="Ranked">Ranked</option>
                        <option value="Tournament">Tournament</option>
                    </select>
                </label>
            </div>
            <button onClick={startQuickPlay}>Start Quick Play</button>
        </div>
    );
};

export default QuickPlayButton;
