// pages/index.tsx
import { usePokemon } from '../hooks/usePokemon';
import { useState } from 'react';
import CaptureForm from '../components/CaptureForm';
// import ThemeToggle from '../components/ThemeToggle';

const Home = () => {
  const [page, setPage] = useState(0);
  const { pokemonData, loading } = usePokemon(10, page * 10);

  const handleNext = () => setPage(prevPage => prevPage + 1);
  const handlePrev = () => setPage(prevPage => Math.max(prevPage - 1, 0));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Pokédex</h1>
      {/* <ThemeToggle /> */}
      <p>
        <a href="/captured" className="text-blue-500">View Captured Pokémon</a>
      </p>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {pokemonData.map((pokemon) => (
            <li key={pokemon.id} className="mb-4">
              <div className="flex items-center">
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                  alt={pokemon.name}
                  className="w-16 h-16 mr-4"
                />
                <div className="mr-4">
                  <p><strong>ID:</strong> {pokemon.id}</p>
                  <p><strong>Name:</strong> {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</p>
                  <p><strong>Types:</strong> {pokemon.types.map(t => t.type.name).join(', ')}</p>
                  <p><strong>Stats:</strong></p>
                  <ul>
                    {pokemon.stats.map(stat => (
                      <li key={stat.stat.name} className='uppercase'>
                        {stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1)}: {stat.base_stat}
                      </li>
                    ))}
                  </ul>
                </div>
                <CaptureForm pokemonName={pokemon.name} />
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 flex justify-between">
        <button onClick={handlePrev} disabled={page === 0} className="bg-gray-500 text-white p-2 rounded disabled:opacity-50">
          Previous
        </button>
        <button onClick={handleNext} className="bg-blue-500 text-white p-2 rounded">
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
