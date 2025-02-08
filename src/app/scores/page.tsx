'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function Scores() {
  const searchParams = useSearchParams();
  const score = parseInt(searchParams.get('score') || '0', 10); // Convert score to an integer

  let message = '';
  if (score === 0) {
    message = `Hey, keep learning! Don't give up! Your Score is ${score}`;
  } else if (score < 5) {
    message = `Good score, keep learning with your score of ${score}!`;
  } else if (score >= 10) {
    message = `Perfect!! Your score is ${score}!`;
  } else {
    message = `Well done! Your score is ${score}.`;
  }
  return (
    <div className="text-center text-white">
      <h1 className="text-3xl font-bold mt-10">Game Over!</h1>
      <div className="flex justify-center mt-10">
        <Image src="/trophy.gif" alt="Trophy" width={300} height={300} />
      </div>
      <div className="mt-10 animate-bounce font-bold">{message}</div>

      <div className="mt-5">
        <Link href="/">
          <Button size="lg" className="bg-white text-black active:bg-white focus:bg-white">
            Back To Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
