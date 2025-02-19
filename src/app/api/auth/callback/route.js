import { db, ref, set } from "../../../../firebase"; // Mevcut Firebase modüllerini kullan

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
        return Response.json({ error: "Authorization code missing" }, { status: 400 });
    }

    const TOKEN_URL = "https://id.kick.com/oauth/token";
    const CLIENT_ID = process.env.KICK_CLIENT_ID;
    const CLIENT_SECRET = process.env.KICK_CLIENT_SECRET;
    const REDIRECT_URI = process.env.KICK_REDIRECT_URI;

    const response = await fetch(TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: CLIENT_ID,
            grant_type: "authorization_code",
            code,
            redirect_uri: REDIRECT_URI,
        }),
    });

    if (!response.ok) {
        return Response.json({ error: "Failed to get token" }, { status: 400 });
    }

    const { access_token, refresh_token, expires_in } = await response.json();

    // Firebase'e kaydet (mevcut `firebase.js`'i kullanarak)
    await set(ref(db, `users/${code}`), {
        access_token,
        refresh_token,
        expires_in,
        created_at: Date.now(),
    });

    return Response.json({ message: "Token saved successfully", access_token });
}
