'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Flags() {
  const [randomFlag, setRandomFlag] = useState<string | undefined>();
  const [options, setOptions] = useState<string[] | undefined>(undefined);
  const [clicked, setClicked] = useState<number | null>(null);
  const [rounds, setRounds] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('https://restcountries.com/v3.1/all?fields=name,flags');
        const countries = await res.json();

        const randomCountry = countries[Math.floor(Math.random() * countries.length)];
        setRandomFlag(randomCountry.flags.svg);

        const correctAnswer = randomCountry.name.common;
        setCorrectAnswer(correctAnswer);

        console.log(correctAnswer);

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
      } catch (error) {
        console.log(error);
      }
    }

    if (rounds < 10) {
      fetchData();
      setClicked(null);
    }
  }, [rounds]);

  const trackAnswer = (index: number, option: string) => {
    if (clicked === null) {
      setClicked(index);
      if (option === correctAnswer) {
        setScore((prev) => prev + 1);
      }
    }
  };

  const nextRound = () => {
    if (rounds < 10) {
      setRounds((prev) => prev + 1);
    }
  };

  return (
    <div>
      <div className="flex justify-start text-white text-2xl font-bold mt-10">
        Game Starts Now !!!
      </div>

      {randomFlag && (
        <div className="flex justify-center mt-20">
          <Image src={randomFlag} width={400} height={400} alt="Guess the flag" />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mt-20">
        {options &&
          options.map((option, index) => (
            <Badge
              key={index}
              className={`w-40 border border-white text-lg ${
                clicked === index
                  ? 'bg-black text-white' // Show black for clicked badge
                  : 'bg-white text-black' // Default color for others
              }`}
              onClick={() => trackAnswer(index, option)}
            >
              {option}
            </Badge>
          ))}
      </div>

      <div className="mt-10 text-white flex justify-items-end justify-end">
        {rounds < 10 ? (
          <>
            <Button onClick={nextRound} className="bg-black text-white py-2 px-4 rounded-lg">
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
          </>
        ) : (
          <div>Your Score: {score}</div>
        )}
      </div>
    </div>
  );
}
