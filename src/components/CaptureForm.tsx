import { useState, useEffect } from "react";
import PokeButton from "./ui/Pokeball";

type Pokemon = {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  typeAdvantages: {
    weaknesses: string[];
    strengths: string[];
  };
  stats: {
    stat: { name: string };
    base_stat: number;
  }[];
};

const CaptureForm = ({
  pokemon,
  pokemonName,
}: {
  pokemonName: string;
  pokemon: Pokemon;
}) => {
  const [nickname, setNickname] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [nicknameTouched, setNicknameTouched] = useState<boolean>(false);
  const [dateTouched, setDateTouched] = useState<boolean>(false);
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  useEffect(() => {
    setIsButtonDisabled(!(nickname && date));
  }, [nickname, date]);

  useEffect(() => {
    if (nicknameTouched && !nickname) {
      setNicknameError("Nickname is required.");
    } else {
      setNicknameError(null);
    }
  }, [nickname, nicknameTouched]);

  useEffect(() => {
    if (dateTouched && !date) {
      setDateError("Date is required.");
    } else {
      setDateError(null);
    }
  }, [date, dateTouched]);

  const handleCapture = () => {
    const capturedPokemons = JSON.parse(
      localStorage.getItem("captured") || "[]"
    );
    const newEntry = { nickname, date, pokemon, name: pokemonName };
    localStorage.setItem(
      "captured",
      JSON.stringify([...capturedPokemons, newEntry])
    );

    // Reset fields after capture
    setNickname("");
    setDate("");
    setNicknameTouched(false);
    setDateTouched(false);
    
    // Show the modal
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="flex items-baseline gap-4 my-1 flex-wrap">
      <div>
        <input
          type="text"
          placeholder="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          onBlur={() => setNicknameTouched(true)}
          className="mr-2 text-black rounded-md p-2 px-2 bg-gray-100"
        />
        {nicknameTouched && nicknameError && (
          <div className="text-red-500">{nicknameError}</div>
        )}
      </div>
      <div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          onBlur={() => setDateTouched(true)}
          className="mr-2 text-black rounded-md p-2 bg-gray-100"
        />
        {dateTouched && dateError && (
          <div className="text-red-500">{dateError}</div>
        )}
      </div>
      <button
        className="border-2 border-white rounded-full relative w-fit p-3 px-4 flex justify-center items-center disabled:brightness-50 group"
        onClick={handleCapture}
        disabled={isButtonDisabled}
      >
        <div
          className="pokeball shake group-disabled:!animate-none absolute top-0.5 left-1"
          id="normal"
        />
        <span className="ml-[2.5rem] text-xl capitalize">Capture</span>
      </button>

      {/* Modal */}
      {isModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white text-black flex flex-col gap-4 p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold">Captured!</h2>
            <span>You have successfully captured <span className="capitalize font-semibold">{pokemonName}</span>!</span>
            <button
              onClick={handleCloseModal}
              className="w-1/4 bg-blue-500 text-white p-1 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaptureForm;
