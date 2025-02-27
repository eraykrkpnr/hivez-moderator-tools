import React, { useState, useEffect, useRef } from "react";
import "../components/Countdown.css";
import { db } from "../firebase";
import { push, ref, onValue, set, remove, get } from "firebase/database";

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

  const [isStreamStarted, setIsStreamStarted] = useState(1);

  const [initialHours, setInitialHours] = useState(0);
  const [initialMinutes, setInitialMinutes] = useState(0);
  const [initialSeconds, setInitialSeconds] = useState(0);

  const mainTimerRef = useRef(Date.now());
  const intervalTimerRef = useRef(null);

  const startMainTimer = (initialTimeInMs) => {
    const now = Date.now();
    mainTimerRef.current = now - initialTimeInMs;
  };

  const getMainTime = () => {
    if (isStreamStarted !== 0) {
      const timeElapsed = Date.now() - mainTimerRef.current;
      setMainHours(Math.floor((timeElapsed / (1000 * 60 * 60)) % 24));
      setMainMinutes(Math.floor((timeElapsed / 1000 / 60) % 60));
      setMainSeconds(Math.floor((timeElapsed / 1000) % 60));
    }
  };

  const clearDatabase = () => {
    const savedTimesRef = ref(db, "savedTimes");
    remove(savedTimesRef)
        .then(() => {
          console.log("Database cleared successfully!");
          setSavedTimes([]);
        })
        .catch((error) => {
          console.error("Error clearing database:", error);
        });
  };

  const startIntervalTimer = () => {
    const startTime = Date.now();
    setIntervalStartTime(startTime);
    intervalTimerRef.current = setInterval(() => {
      const intervalElapsed = Date.now() - startTime;
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

    const newEntryRef = push(ref(db, "savedTimes"));
    set(newEntryRef, {
      title,
      status: "completed",
    });
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

  const handleManualStart = async () => {
    const initialTimeInMs =
        initialHours * 60 * 60 * 1000 +
        initialMinutes * 60 * 1000 +
        initialSeconds * 1000;
    startMainTimer(initialTimeInMs);

    // Save the initial time to Firebase
    await set(ref(db, "initialTime"), {
      initialTimeInMs,
      timestamp: Date.now(),
    });
  };

  useEffect(() => {
    const savedTimesRef = ref(db, "savedTimes");
    onValue(savedTimesRef, (snapshot) => {
      const data = snapshot.val();
      const formattedData = data
          ? Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
            inProgress: data[key].status === "in progress",
          }))
          : [];
      setSavedTimes(formattedData);
    });

    // Read the initial time from Firebase
    const initialTimeRef = ref(db, "initialTime");
    get(initialTimeRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const elapsedTime = Date.now() - data.timestamp;
        const initialTimeInMs = data.initialTimeInMs + elapsedTime;
        startMainTimer(initialTimeInMs);
      }
    });

    const mainInterval = setInterval(() => getMainTime(), 1000);
    return () => clearInterval(mainInterval);
  }, []);

  useEffect(() => {
    savedTimes.forEach((entry) => {
      if (entry.inProgress) {
        const elapsed = Date.now() - new Date(entry.start).getTime();
        setMainHours(Math.floor((elapsed / (1000 * 60 * 60)) % 24));
        setMainMinutes(Math.floor((elapsed / 1000 / 60) % 60));
        setMainSeconds(Math.floor((elapsed / 1000) % 60));
      }
    });
  }, [savedTimes]);

  return (
      <div className="countdown-container">
        <div className="time-display" style={{ fontSize: "24px" }}>
          <h2>Yayın Süresi</h2>
          <b>{mainHours.toString().padStart(2, "0")}:</b>
          <b>{mainMinutes.toString().padStart(2, "0")}:</b>
          <b>{mainSeconds.toString().padStart(2, "0")}</b>
        </div>
        <div className="time-display">
          <h2>Video Süresi</h2>
          <b>{intervalHours.toString().padStart(2, "0")}:</b>
          <b>{intervalMinutes.toString().padStart(2, "0")}:</b>
          <b>{intervalSeconds.toString().padStart(2, "0")}</b>
        </div>
        <input
            type="text"
            className="title-input"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
        />
        <div className="buttons">
          <button onClick={startIntervalTimer}>Videoyu başlat</button>
          <button onClick={saveIntervalTime}>Videoyu kaydet</button>
          <button onClick={clearDatabase}>Veritabanını Temizle</button>
        </div>
        <ul>
          {savedTimes.map((entry, index) => (
              <li key={index}>
                <b>{entry.title}</b>: {entry.start} - {entry.end}
              </li>
          ))}
        </ul>
        <div className="time-display" style={{ paddingTop: "20px" }}>
          <h3>Manuel Başlangıç Zamanı Ayarla</h3>
          <input
              type="number"
              placeholder="Saat"
              value={initialHours}
              onChange={(e) => setInitialHours(parseInt(e.target.value) || 0)}
          />
          :
          <input
              type="number"
              placeholder="Dakika"
              value={initialMinutes}
              onChange={(e) => setInitialMinutes(parseInt(e.target.value) || 0)}
          />
          :
          <input
              type="number"
              placeholder="Saniye"
              value={initialSeconds}
              onChange={(e) => setInitialSeconds(parseInt(e.target.value) || 0)}
          />
          <div
              className="buttons"
              style={{ justifyContent: "center", paddingTop: "12px" }}
          >
            <button onClick={handleManualStart}>Başlangıç Zamanını Ayarla</button>
          </div>
        </div>
      </div>
  );
}

export default Countdown;