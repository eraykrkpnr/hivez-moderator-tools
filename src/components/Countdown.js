import React, { useState, useEffect, useRef } from "react";

function Countdown() {
  const [mainHours, setMainHours] = useState(0);
  const [mainMinutes, setMainMinutes] = useState(0);
  const [mainSeconds, setMainSeconds] = useState(0);

  const [intervalHours, setIntervalHours] = useState(0);
  const [intervalMinutes, setIntervalMinutes] = useState(0);
  const [intervalSeconds, setIntervalSeconds] = useState(0);
  const [intervalStartTime, setIntervalStartTime] = useState(null);

  const [savedTimes, setSavedTimes] = useState([]);
  const [title, setTitle] = useState("");

  const mainTimerRef = useRef(Date.now());
  const intervalTimerRef = useRef(null);

  const startMainTimer = () => {
    mainTimerRef.current = Date.now();
  };

  const getMainTime = () => {
    const timeElapsed = Date.now() - mainTimerRef.current;
    setMainHours(Math.floor((timeElapsed / (1000 * 60 * 60)) % 24));
    setMainMinutes(Math.floor((timeElapsed / 1000 / 60) % 60));
    setMainSeconds(Math.floor((timeElapsed / 1000) % 60));
  };

  const startIntervalTimer = () => {
    setIntervalStartTime(Date.now());
    intervalTimerRef.current = setInterval(() => {
      const intervalElapsed = Date.now() - intervalStartTime;
      setIntervalHours(Math.floor((intervalElapsed / (1000 * 60 * 60)) % 24));
      setIntervalMinutes(Math.floor((intervalElapsed / 1000 / 60) % 60));
      setIntervalSeconds(Math.floor((intervalElapsed / 1000) % 60));
    }, 1000);
  };

  const saveIntervalTime = () => {
    if (!intervalStartTime) return;

    clearInterval(intervalTimerRef.current);
    const intervalEndTime = Date.now();

    const mainStartTime = new Date(intervalStartTime - mainTimerRef.current);
    const mainEndTime = new Date(intervalEndTime - mainTimerRef.current);

    const formatTime = (date) =>
      `${date.getUTCHours().toString().padStart(2, "0")}:${date
        .getUTCMinutes()
        .toString()
        .padStart(2, "0")}:${date.getUTCSeconds().toString().padStart(2, "0")}`;

    const start = formatTime(mainStartTime);
    const end = formatTime(mainEndTime);

    setSavedTimes([...savedTimes, { title, start, end }]);
    setTitle("");
    resetIntervalTimer();
  };

  const resetIntervalTimer = () => {
    setIntervalHours(0);
    setIntervalMinutes(0);
    setIntervalSeconds(0);
    setIntervalStartTime(null);
  };

  useEffect(() => {
    startMainTimer();
    const mainInterval = setInterval(() => getMainTime(), 1000);
    return () => clearInterval(mainInterval);
  }, []);

  return (
    <div>
      <div>
        <h2>Yayın Süresi</h2>
        <b>{mainHours.toString().padStart(2, "0")}:</b>
        <b>{mainMinutes.toString().padStart(2, "0")}:</b>
        <b>{mainSeconds.toString().padStart(2, "0")}</b>
      </div>
      <div>
        <h2>Video Süresi</h2>
        <b>{intervalHours.toString().padStart(2, "0")}:</b>
        <b>{intervalMinutes.toString().padStart(2, "0")}:</b>
        <b>{intervalSeconds.toString().padStart(2, "0")}</b>
      </div>
      <input
        type="text"
        placeholder="Enter title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={startIntervalTimer}>Videoyu başlat</button>
      <button onClick={saveIntervalTime}>Videoyu kaydet</button>
      <ul>
        {savedTimes.map((entry, index) => (
          <li key={index}>
            <b>{entry.title}</b>: {entry.start} - {entry.end}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Countdown;
