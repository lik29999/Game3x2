import React, { useState, useEffect } from 'react';
import './App.css';
import { validateAnswer, generateNumbers, generateTarget, formatExpression } from './utils/validator';

function App() {
  const [gameNumbers, setGameNumbers] = useState([]);
  const [target, setTarget] = useState(0);
  const [selectedOperators, setSelectedOperators] = useState(['', '', '']);
  const [selectedNumbers, setSelectedNumbers] = useState([null, null, null, null]);
  const [validationResult, setValidationResult] = useState(null);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'
  const [score, setScore] = useState(0);
  const [gamesWon, setGamesWon] = useState(0);

  // Initialize game
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const newNumbers = generateNumbers();
    setGameNumbers(newNumbers);
    setTarget(generateTarget(newNumbers));
    setSelectedOperators(['', '', '']);
    setSelectedNumbers([null, null, null, null]);
    setValidationResult(null);
    setGameStatus('playing');
  };

  const handleNumberSelect = (index, num) => {
    const newSelected = [...selectedNumbers];
    newSelected[index] = num;
    setSelectedNumbers(newSelected);
  };

  const handleOperatorSelect = (index, operator) => {
    const newOps = [...selectedOperators];
    newOps[index] = operator;
    setSelectedOperators(newOps);
  };

  const handleSubmit = () => {
    // Check if all numbers and operators are selected
    if (selectedNumbers.includes(null) || selectedOperators.includes('')) {
      setValidationResult({
        isCorrect: false,
        result: null,
        error: 'Please select all numbers and operators'
      });
      return;
    }

    // Get the actual numbers from indices
    const actualNumbers = selectedNumbers.map(idx => gameNumbers[idx]);

    // Validate the answer
    const result = validateAnswer(actualNumbers, selectedOperators, target);
    setValidationResult(result);

    if (result.isCorrect) {
      setGameStatus('won');
      const points = calculatePoints();
      setScore(score + points);
      setGamesWon(gamesWon + 1);
    } else {
      setGameStatus('lost');
    }
  };

  const calculatePoints = () => {
    // Award points based on difficulty (sum of numbers)
    const difficulty = gameNumbers.reduce((a, b) => a + b, 0);
    return Math.floor(difficulty / 10) || 10;
  };

  const handleReset = () => {
    setSelectedOperators(['', '', '']);
    setSelectedNumbers([null, null, null, null]);
    setValidationResult(null);
    setGameStatus('playing');
  };

  const operatorOptions = ['+', '-', '*', '/'];

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎮 Game 3x2</h1>
        <p className="subtitle">Use 4 numbers and 3 operators to reach the target!</p>
      </header>

      <div className="game-container">
        {/* Stats */}
        <div className="stats">
          <div className="stat-box">
            <span className="stat-label">Score:</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Games Won:</span>
            <span className="stat-value">{gamesWon}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Target:</span>
            <span className="stat-value target">{target}</span>
          </div>
        </div>

        {/* Game Numbers */}
        <div className="numbers-section">
          <h3>Available Numbers:</h3>
          <div className="numbers-grid">
            {gameNumbers.map((num, idx) => (
              <button
                key={idx}
                className={`number-btn ${selectedNumbers.includes(idx) ? 'selected' : ''}`}
                onClick={() => {
                  const positionIdx = selectedNumbers.indexOf(idx);
                  if (positionIdx > -1) {
                    handleNumberSelect(positionIdx, null);
                  } else {
                    const emptyPos = selectedNumbers.indexOf(null);
                    if (emptyPos > -1) {
                      handleNumberSelect(emptyPos, idx);
                    }
                  }
                }}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Expression Builder */}
        <div className="expression-section">
          <h3>Build Your Expression:</h3>
          <div className="expression-builder">
            {[0, 1, 2, 3].map((pos) => (
              <div key={pos} className="expression-item">
                <div className="number-slot">
                  <select
                    value={selectedNumbers[pos] !== null ? selectedNumbers[pos] : ''}
                    onChange={(e) => handleNumberSelect(pos, e.target.value ? parseInt(e.target.value) : null)}
                    className="number-input"
                  >
                    <option value="">--</option>
                    {gameNumbers.map((num, idx) => (
                      <option key={idx} value={idx}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>

                {pos < 3 && (
                  <div className="operator-slot">
                    <select
                      value={selectedOperators[pos]}
                      onChange={(e) => handleOperatorSelect(pos, e.target.value)}
                      className="operator-input"
                    >
                      <option value="">--</option>
                      {operatorOptions.map((op) => (
                        <option key={op} value={op}>
                          {op}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Validation Result */}
        {validationResult && (
          <div className={`result-box ${validationResult.isCorrect ? 'correct' : 'incorrect'}`}>
            {validationResult.error ? (
              <p className="error-message">❌ {validationResult.error}</p>
            ) : (
              <>
                <p className="expression">
                  {formatExpression(selectedNumbers.map(idx => gameNumbers[idx]), selectedOperators)} = {validationResult.result}
                </p>
                {validationResult.isCorrect ? (
                  <p className="success-message">✅ Correct! You found the target!</p>
                ) : (
                  <p className="fail-message">
                    ❌ Wrong! Your result is {validationResult.result}, but the target is {target}
                  </p>
                )}
              </>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="button-group">
          {gameStatus === 'playing' && (
            <>
              <button onClick={handleSubmit} className="btn btn-submit">
                Submit Answer
              </button>
              <button onClick={handleReset} className="btn btn-reset">
                Reset
              </button>
            </>
          )}
          {gameStatus !== 'playing' && (
            <button onClick={startNewGame} className="btn btn-next">
              Next Game
            </button>
          )}
        </div>
      </div>

      <footer className="App-footer">
        <p>💡 Tip: Remember the order of operations (Multiplication and Division before Addition and Subtraction)</p>
      </footer>
    </div>
  );
}

export default App;
