export default function Grid() {
  const rows = 6;
  const cols = 5;

  return (
    <div className="grid grid-rows-6 grid-cols-5 gap-2">
      {Array.from({ length: rows * cols }).map((_, index) => (
        <div
          key={index}
          className="w-14 h-14 border-2 border-gray-500 flex items-center justify-center text-2xl font-bold uppercase"
        >
          {/* Letter will go here */}
        </div>
      ))}
    </div>
  );
}
