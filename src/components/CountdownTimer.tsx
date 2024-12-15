import { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  maxSeconds: number;
}

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
    maxSeconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const launchDate = new Date('2025-01-30T00:00:00');
      const now = new Date();
      const difference = launchDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalSeconds: 0,
          maxSeconds: 0,
        };
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      const totalSeconds = Math.floor(difference / 1000);
      const maxSeconds = Math.floor((launchDate.getTime() - new Date().getTime()) / 1000);
      
      return {
        days,
        hours,
        minutes,
        seconds,
        totalSeconds,
        maxSeconds,
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const progress = ((timeLeft.maxSeconds - timeLeft.totalSeconds) / timeLeft.maxSeconds) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto bg-black/40 p-6 rounded-lg space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">BETA Launch Countdown</h2>
        <p className="text-gray-300">NFT Badges will return to full price on January 30th, 2025</p>
      </div>
      <div className="grid grid-cols-4 gap-4 text-center">
        <div className="bg-black/30 p-3 rounded-lg">
          <div className="text-3xl font-bold text-white">{timeLeft.days}</div>
          <div className="text-sm text-gray-400">Days</div>
        </div>
        <div className="bg-black/30 p-3 rounded-lg">
          <div className="text-3xl font-bold text-white">{timeLeft.hours}</div>
          <div className="text-sm text-gray-400">Hours</div>
        </div>
        <div className="bg-black/30 p-3 rounded-lg">
          <div className="text-3xl font-bold text-white">{timeLeft.minutes}</div>
          <div className="text-sm text-gray-400">Minutes</div>
        </div>
        <div className="bg-black/30 p-3 rounded-lg">
          <div className="text-3xl font-bold text-white">{timeLeft.seconds}</div>
          <div className="text-sm text-gray-400">Seconds</div>
        </div>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default CountdownTimer;