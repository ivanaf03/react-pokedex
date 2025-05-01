import React from "react";
import PokemonCard from "./components/PokemonCard";

const FIRST_UNOVA_POKEMON_ID = 494;
const LAST_UNOVA_POKEMON_ID = 649;
const BATCH_SIZE = 20;
const TOTAL_UNOVA = LAST_UNOVA_POKEMON_ID - FIRST_UNOVA_POKEMON_ID + 1;

const App = () => {
  const [visibleCount, setVisibleCount] = React.useState(BATCH_SIZE);
  const loaderRef = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setVisibleCount((prev) => {
            if (prev >= TOTAL_UNOVA) return prev;
            return Math.min(prev + BATCH_SIZE, TOTAL_UNOVA);
          });
        }
      },
      { threshold: 0.1 }
    );

    const loader = loaderRef.current;
    if (loader) observer.observe(loader);

    return () => {
      if (loader) observer.unobserve(loader);
    };
  }, []);

  return (
    <>
      <h1 className="w-full text-center mt-10 p-2 text-2xl sm:text-4xl md:text-8xl font-extrabold">
        Unova Pokedex
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-4 px-4">
        {[...Array(visibleCount)].map((_, i) => (
          <PokemonCard key={i} pokemonId={FIRST_UNOVA_POKEMON_ID + i} />
        ))}
      </div>

      {visibleCount < TOTAL_UNOVA && (
        <div
          ref={loaderRef}
          className="h-32 flex justify-center items-center"
        >
          <p className="text-gray-500">Loading more Pokémon...</p>
        </div>
      )}
    </>
  );
};

export default App;
