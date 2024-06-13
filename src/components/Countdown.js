import React, { useState, useEffect, useRef } from "react";

function Countdown() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const startTimeRef = useRef(0); // Use useRef to store the start time

  const setTime = () => {
    startTimeRef.current = Date.now();
    console.log(startTimeRef.current);
  };

  const getTime = () => {
    const time = Date.now() - startTimeRef.current;
    console.log("asd");
    if (startTimeRef.current !== 0) {
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
      <b>{hours.toString().padStart(2, "0")}:</b>
      <b>{minutes.toString().padStart(2, "0")}:</b>
      <b>{seconds.toString().padStart(2, "0")}</b>
      <br />
      <button onClick={setTime}>Set Time</button>
    </div>
  );
}

export default Countdown;
