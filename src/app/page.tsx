import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <p className="text-2xl text-white font-bold mt-3 lg:flex lg:justify-center">
        Welcome to the flag guessing game 🎌{' '}
      </p>

      <p className="text-xl text-white mt-2 text-justify ">
        Welcome to the ultimate flag challenge! 🎉🌍 You&apos;ll be racing against the clock with 10
        exciting questions about flags from around the world. You have 30 seconds to answer each
        one, so stay sharp and have fun! Think you can spot the world&apos;s most iconic flags?
        Let&apos;s find out! Ready, set, go! 🌟 Click &apos;Start&apos; to begin the game
      </p>

      <div className="mt-3 flex justify-center">
        <Image src="/guessing-2.svg" width={200} height={200} alt="Guessing the flag" />
      </div>

      <div className="flex justify-center mt-5">
        <Link href="/multiple-choice">
          <Button size="lg" className="bg-white text-black active:bg-white focus:bg-white">
            Start the game
          </Button>
        </Link>
      </div>
    </div>
  );
}
