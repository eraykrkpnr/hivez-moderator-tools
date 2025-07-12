"use client";

import React, { useState, useEffect, useRef } from "react";
import "./CountdownLast.css";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";

function CountdownLast() {
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [latestInProgress, setLatestInProgress] = useState(null);
    const [loading, setLoading] = useState(true);

    const timerRef = useRef(null);

    useEffect(() => {
        // Listen for changes in the savedTimes database
        const savedTimesRef = ref(db, "savedTimes");

        onValue(savedTimesRef, (snapshot) => {
            setLoading(false);
            const data = snapshot.val();

            if (!data) {
                resetTimer();
                return;
            }

            // Convert to array
            const entries = Object.keys(data).map(key => ({
                id: key,
                ...data[key]
            }));

            // Find any entry with an empty end field or "in progress" status
            const inProgressEntry = entries.find(entry =>
                entry.end === "" || entry.status === "in progress"
            );

            if (inProgressEntry) {
                setLatestInProgress(inProgressEntry);

                // Start the timer using the current time and the video's start time
                if (inProgressEntry.start) {
                    startTimerFromTimeString(inProgressEntry.start);
                } else {
                    resetTimer();
                }
            } else {
                resetTimer();
            }
        }, (error) => {
            console.error("Firebase error:", error);
            setLoading(false);
            resetTimer();
        });

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const startTimerFromTimeString = (startTimeStr) => {
        if (timerRef.current) clearInterval(timerRef.current);

        const initialTimeRef = ref(db, "initialTime");
        onValue(initialTimeRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const streamStartTimestamp = data.timestamp;
                const initialTimeInMs = data.initialTimeInMs || 0;

                // Parse the start time (HH:MM:SS)
                const [startH, startM, startS] = startTimeStr.split(":").map(Number);
                const videoStartOffsetMs = (startH * 3600 + startM * 60 + startS) * 1000;

                // The actual video start timestamp
                const videoStartTimestamp = streamStartTimestamp + videoStartOffsetMs - initialTimeInMs;

                timerRef.current = setInterval(() => {
                    const now = Date.now();
                    const elapsedMs = now - videoStartTimestamp;

                    setHours(Math.floor((elapsedMs / (1000 * 60 * 60)) % 24));
                    setMinutes(Math.floor((elapsedMs / (1000 * 60)) % 60));
                    setSeconds(Math.floor((elapsedMs / 1000) % 60));
                }, 1000);
            }
        });
    };

    const resetTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setLatestInProgress(null);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
    };

    return (
        <div className="countdown-last-container">
            <div className="countdown-center">
                {loading ? (
                    <div className="video-title">Loading...</div>
                ) : latestInProgress ? (
                    <div className="video-title">{latestInProgress.title || "Untitled Video"}</div>
                ) : (
                    <div className="video-title">No Video Playing</div>
                )}
                <div className="divider"></div>
                <span className="time-display-large">
                    {hours.toString().padStart(2, "0")}:
                    {minutes.toString().padStart(2, "0")}:
                    {seconds.toString().padStart(2, "0")}
                </span>
            </div>
        </div>
    );
}

export default CountdownLast;