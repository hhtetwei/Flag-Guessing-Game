'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import Scores from '../scores/page';
import { useRouter } from 'next/navigation';

export default function Flags() {
  const router = useRouter();
  const [randomFlag, setRandomFlag] = useState<string | undefined>();
  const [options, setOptions] = useState<string[] | undefined>(undefined);
  const [clickedOption, setClickedOption] = useState<number | null>(null);
  const [rounds, setRounds] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState<string | undefined>(undefined);
  const [timer, setTimer] = useState(30);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const roundUpdatedRef = useRef(false);

  useEffect(() => {
    if (rounds >= 10) return;

    async function fetchData() {
      try {
        const res = await fetch('https://restcountries.com/v3.1/all?fields=name,flags');
        const countries = await res.json();

        const randomCountry = countries[Math.floor(Math.random() * countries.length)];
        setRandomFlag(randomCountry.flags.svg);
        const correctAnswer = randomCountry.name.common;
        setCorrectAnswer(correctAnswer);

        console.log('Correct answer:', correctAnswer);

        const incorrectAnswers: string[] = [];
        while (incorrectAnswers.length < 5) {
          const randomCountryName =
            countries[Math.floor(Math.random() * countries.length)].name.common;
          if (
            randomCountryName !== correctAnswer &&
            !incorrectAnswers.includes(randomCountryName)
          ) {
            incorrectAnswers.push(randomCountryName);
          }
        }

        const allOptions = [correctAnswer, ...incorrectAnswers].sort(() => Math.random() - 0.5);
        setOptions(allOptions);
        setTimer(30);
        setClickedOption(null);
        roundUpdatedRef.current = false;
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, [rounds]);

  useEffect(() => {
    if (rounds >= 10) {
      console.log('Clearing timer for last round.');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    console.log('Starting new timer for round:', rounds);

    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;

          if (!roundUpdatedRef.current) {
            console.log('Timer ended, moving to next round:', rounds + 1);
            moveToNextRound();
            roundUpdatedRef.current = true;
          }

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      console.log('Clearing timer for round:', rounds);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [rounds]);

  const trackAnswer = (index: number) => {
    setClickedOption(index);
    if (options && options[index] === correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const moveToNextRound = () => {
    if (roundUpdatedRef.current) return;
    roundUpdatedRef.current = true;

    setRounds((prevRounds) => {
      if (prevRounds >= 9) {
        console.log('Game over. Final round:', prevRounds + 1);
        return 10;
      }
      console.log('Manually moving to next round:', prevRounds + 1);
      return prevRounds + 1;
    });

    setClickedOption(null);
    setTimer(30);
  };

  useEffect(() => {
    if (rounds === 10) {
      console.log('Redirecting to scores...');
      router.replace(`/scores?score=${score}`);
    }
  }, [rounds, score, router]);

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div>
      <div className="flex justify-start text-white text-2xl font-bold mt-10">
        Game Starts Now !!!
      </div>

      <div className="mt-5 flex">
        <div>
          <Image src="/stopwatch-2.svg" alt="timer" width={50} height={50} />
        </div>
        <div
          className={`text-center text-white text-3xl font-bold mt-2 ${timer === 0 ? 'text-red-500' : ''}`}
        >
          {formatTime(timer)}
        </div>
      </div>

      {randomFlag && (
        <div className="flex justify-center mt-20 bg-gray-300">
          <Image
            src={randomFlag}
            width={200}
            height={200}
            alt="Guess the flag"
            priority
            className="mt-3 mb-3"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mt-20">
        {options &&
          options.map((option, index) => (
            <Badge
              key={`${option}-${index}`}
              className={`border border-white text-md transition-all duration-300 ${
                clickedOption === index ? 'bg-black text-white' : 'bg-white text-black'
              }`}
              onClick={() => trackAnswer(index)}
            >
              {option}
            </Badge>
          ))}
      </div>

      <div className="mt-10 text-white flex justify-items-end justify-end">
        {rounds < 10 ? (
          <Button onClick={moveToNextRound} className="bg-black text-white py-2 px-4 rounded-lg">
            Next
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-chevrons-right"
            >
              <path d="m6 17 5-5-5-5" />
              <path d="m13 17 5-5-5-5" />
            </svg>
          </Button>
        ) : (
          <Scores />
        )}
      </div>
    </div>
  );
}
