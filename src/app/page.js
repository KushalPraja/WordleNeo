import Image from "next/image"; 
import Grid from './grid.jsx';

export default function Home() {
  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <div className="flex items-center mt-4 border-white border-solid border-2 p-5">
        <h1 className="text-4xl font-bold text-center text-white">
          Wordle Clone
        </h1>
        <Image
          src="/vercel.svg"
          alt="Vercel Logo"
          width={72}
          height={16}
          className="ml-4"
        />
      </div>
      <div className="flex items-center mt-4">
       <Grid />
      </div>


    </div>
  );
}
