import { useState } from 'react';

const CaptureForm = ({ pokemonName }: { pokemonName: string }) => {
  const [nickname, setNickname] = useState<string>('');
  const [date, setDate] = useState<string>('');

  const handleCapture = () => {
    const capturedPokemons = JSON.parse(localStorage.getItem('captured') || '[]');
    const newEntry = { name: pokemonName, nickname, date };
    localStorage.setItem('captured', JSON.stringify([...capturedPokemons, newEntry]));

    // Reset fields after capture
    setNickname('');
    setDate('');
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        className="mr-2"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="mr-2"
      />
      <button onClick={handleCapture}>Tag as Captured</button>
    </div>
  );
};

export default CaptureForm;
