'use client';
import { useState } from 'react';

export default function KickAuthPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleAuth = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/auth/kickAuth');
            if (response.ok) {
                const data = await response.json(); // JSON olarak yanıtı al
                if (data.url) {
                    window.location.href = data.url; // Dönen URL'ye yönlendir
                }
            } else {
                console.error('Failed to get auth URL');
            }
        } catch (error) {
            console.error('Authentication error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center">
            <button
                onClick={handleAuth}
                disabled={isLoading}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
                {isLoading ? 'Connecting...' : 'Connect with Kick'}
            </button>
        </div>
    );
}
