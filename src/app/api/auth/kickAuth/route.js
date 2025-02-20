import { db, ref, set } from "../../../../firebase"; // Import Firebase

export async function GET() {
    const CLIENT_ID = process.env.KICK_CLIENT_ID;
    const REDIRECT_URI = process.env.KICK_REDIRECT_URI;

    // Function to generate a random string (code_verifier)
    function generateRandomString(length) {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let text = '';
        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    try {
        const codeVerifier = generateRandomString(128); // Create a random string for code_verifier

        // Convert the code_verifier to a buffer and hash it using SHA-256
        const encoder = new TextEncoder();
        const data = encoder.encode(codeVerifier);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data); // Hash using SHA-256
        const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convert buffer to array
        const codeChallenge = btoa(String.fromCharCode(...hashArray)) // Encode the hash in base64
            .replace(/=/g, '') // Remove any "=" padding
            .replace(/\+/g, '-') // Replace "+" with "-"
            .replace(/\//g, '_'); // Replace "/" with "_"

        // Construct the authorization URL
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: CLIENT_ID,
            redirect_uri: REDIRECT_URI,
            scope: 'user:read channel:read channel:write chat:write streamkey:read events:subscribe',
            code_challenge: codeChallenge,
            code_challenge_method: 'S256',
            state: 'S256', // You can generate a random state if needed
        });

        const authUrl = `https://id.kick.com/oauth/authorize?${params.toString()}`;

        // Save code_verifier to Firebase
        await set(ref(db, `auth/code_verifiers/${CLIENT_ID}`), {
            code_verifier: codeVerifier,
            created_at: Date.now(),
        });

        return new Response(JSON.stringify({ url: authUrl }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (error) {
        console.error('Error generating auth URL:', error);
        return new Response(JSON.stringify({ error: 'Failed to generate auth URL', details: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    }
}
