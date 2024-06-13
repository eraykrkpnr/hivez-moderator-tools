import React from "react";
import { useState, useEffect } from "react";

function Countdown() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [startTime, setStartTime] = useState(0);

  const setTime = () => {
    setStartTime(Date.now());
    console.log(startTime);
  };

  const getTime = () => {
    const time = Date.now() - startTime;
    console.log("asd");
    if (startTime != 0) {
      setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
      setMinutes(Math.floor((time / 1000 / 60) % 60));
      setSeconds(Math.floor((time / 1000) % 60));
      console.log(seconds);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => getTime(), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <b>{hours}</b>
      <b>{minutes}</b>
      <b>{seconds}</b>
      <button onClick={setTime}>Set Time</button>
    </div>
  );
}

export default Countdown;
