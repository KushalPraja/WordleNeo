import Image from "next/image"; 
import WordleGame from "./WordleGame";

export default function Home() {
  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
        <WordleGame/>
    </div>
  );
}
