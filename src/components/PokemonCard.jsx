import React from "react";
import { MoonLoader } from "react-spinners";

const PokemonCard = ({ pokemonId }) => {
  const [pokemonData, setPokemonData] = React.useState({
    name: "",
    sprite: "",
    types: [],
    description: "",
  });
  const [isLoading, setIsLoading] = React.useState(true);
  const [isImageLoading, setIsImageLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setIsLoading(true);
        setIsImageLoading(true);

        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
        );
        const data = await res.json();

        const speciesRes = await fetch(data.species.url);
        const speciesData = await speciesRes.json();

        const englishEntry = speciesData.flavor_text_entries.find(
          (entry) => entry.language.name === "en"
        );

        setPokemonData({
          name: data.name,
          sprite: data.sprites.front_default,
          types: data.types,
          description: englishEntry
            ? englishEntry.flavor_text.replace(/\n|\f/g, " ")
            : "No description available",
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
        setIsLoading(false);
        setIsImageLoading(false);
      }
    };

    fetchPokemon();
  }, [pokemonId]);

  return (
    <div className="skew-3 rounded-lg shadow-steel-blue shadow-lg p-4 flex flex-col justify-center items-center">
      {isLoading ? (
        <div className="w-full h-full flex justify-center items-center">
          <MoonLoader size={50} color="#00A6FB" />
        </div>
      ) : (
        <> 

          <img
            src={pokemonData.sprite}
            alt={pokemonData.name}
            className="w-full h-full object-cover"
            onLoad={() => setIsImageLoading(false)}
            style={{ opacity: isImageLoading ? 0 : 1 }}
          />
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold capitalize">{pokemonData.name.split('-')[0]}</h2>
            <p className="p-4 text-sm font-mono">{pokemonData.description}</p>
            <div className="flex flex-row justify-start mt-4">
              {pokemonData.types.map((type) => (
                <div
                  key={type.type.name}
                  className="rounded-lg shadow-steel-blue shadow-sm p-2 m-2 bg-rich-black text-white capitalize"
                >
                  {type.type.name}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PokemonCard;
