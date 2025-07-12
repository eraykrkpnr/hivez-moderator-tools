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

        // Parse the start time string to get hours, minutes, seconds
        const [h, m, s] = startTimeStr.split(':').map(Number);

        // Convert start time to seconds
        const startTimeInSeconds = h * 3600 + m * 60 + s;

        // Get the stream start reference from Firebase
        const initialTimeRef = ref(db, "initialTime");
        onValue(initialTimeRef, (snapshot) => {
            if (snapshot.exists()) {
                const initialData = snapshot.val();
                const streamStartTimestamp = initialData.timestamp;

                timerRef.current = setInterval(() => {
                    // Calculate current elapsed time since stream start (in seconds)
                    const now = Date.now();
                    const elapsedSinceStreamStart = Math.floor((now - streamStartTimestamp) / 1000);

                    // Calculate how long the video has been playing
                    let videoElapsedSeconds = elapsedSinceStreamStart - startTimeInSeconds;

                    // Update the timer display
                    setHours(Math.floor(videoElapsedSeconds / 3600));
                    setMinutes(Math.floor((videoElapsedSeconds % 3600) / 60));
                    setSeconds(videoElapsedSeconds % 60);
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