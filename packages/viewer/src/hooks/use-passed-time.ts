import { useEffect, useState } from 'react';

export function usePassedTime() {
  const [passedTime, setPassedTime] = useState<number>(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setPassedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  return passedTime;
}
