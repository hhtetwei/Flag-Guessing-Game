import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <p className="text-2xl text-white font-bold mt-5">Welcome to the flag guessing game 🎌 </p>

      <div className="mt-32">
        <Image src="/guessing-2.svg" width={500} height={500} alt="Guessing the flag" />
      </div>

      <div className="flex justify-center mt-32">
        <Link href="/multiple-choice">
          <Button size="lg" className="bg-white text-black active:bg-white focus:bg-white">
            Start the game
          </Button>
        </Link>
      </div>
    </div>
  );
}
