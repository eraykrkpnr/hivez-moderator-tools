'use client';
import { useState } from 'react';

export default function KickAuthPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleAuth = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/auth/kickAuth');
            if (response.ok) {
                window.location.href = response.url;
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