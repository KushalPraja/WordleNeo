// Grid.js or wherever you're importing
import WordComponent from "./get_word";  // Make sure the path is correct

export default function Grid() {
  const rows = 6;
  const cols = 5;
  
  return (
    <div>
      <div className="grid grid-rows-6 grid-cols-5 gap-2">
        {Array.from({ length: rows * cols }).map((_, index) => (
          <div
            key={index}
            className="w-14 h-14 border-2 border-gray-500 flex items-center justify-center text-2xl font-bold uppercase"
          >
            {/* You can add content here if needed */}
          </div>
        ))}
      </div>
        Words
      <div>
        <WordComponent /> {/* Rendering WordComponent */}
      </div>
    </div>
  );
}

