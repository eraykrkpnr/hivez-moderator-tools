// src/app/api/auth/kickAuth/route.js

export async function GET() {
    const CLIENT_ID = process.env.KICK_CLIENT_ID;
    const REDIRECT_URI = process.env.KICK_REDIRECT_URI;

    // Function to generate random string (code verifier)
    function generateRandomString(length) {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let text = '';
        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    try {
        // Generate code verifier and code challenge
        const codeVerifier = generateRandomString(128); // Using 128 characters for code verifier
        const codeChallenge = await crypto.subtle.digest(
            'SHA-256',
            new TextEncoder().encode(codeVerifier)
        ).then(buffer =>
            btoa(String.fromCharCode(...new Uint8Array(buffer)))
                .replace(/=/g, '')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
        );

        // Create parameters for the OAuth URL
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: CLIENT_ID,
            redirect_uri: REDIRECT_URI,
            scope: 'user:read channel:read channel:write chat:write streamkey:read events:subscribe',
            code_challenge: codeChallenge,
            code_challenge_method: 'S256',
            state: 'S256'
        });

        // Construct the authorization URL
        const authUrl = `https://id.kick.com/oauth/authorize?${params.toString()}`;

        // Return the URL as a JSON response
        return new Response(JSON.stringify({ url: authUrl }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error) {
        // Handle error in generating the auth URL
        return new Response(JSON.stringify({ error: 'Failed to generate auth URL' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}
