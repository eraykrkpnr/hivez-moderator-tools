import { db, ref, set,get } from "../../../../firebase"; // Firebase import
import { NextResponse } from "next/server";

export async function GET(req) {

    const TOKEN_URL = "https://id.kick.com/oauth/token";
    const CLIENT_ID = process.env.KICK_CLIENT_ID;
    const CLIENT_SECRET = process.env.KICK_CLIENT_SECRET;
    const REDIRECT_URI = process.env.KICK_REDIRECT_URI;

    const { searchParams } = new URL(req.url);
    const paramcode = searchParams.get("code");

    if (!paramcode) {
        return NextResponse.json({ error: "Authorization code missing" }, { status: 400 });
    }

    // Retrieve the stored code_verifier (MUST be saved during authorization request)
    const codeVerifierSnapshot = await get(ref(db, `auth/code_verifiers/${CLIENT_ID}`));
    if (!codeVerifierSnapshot.exists()) {
        return NextResponse.json({ error: "Missing code_verifier. Ensure it's stored correctly." }, { status: 400 });
    }
    const codeVerifier = codeVerifierSnapshot.val().code_verifier;

    if (!codeVerifier) {
        return NextResponse.json({ error: "Missing code_verifier. Ensure it's stored correctly." }, { status: 400 });
    }

    try {
        const response = await fetch(TOKEN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: "authorization_code",
                code_verifier: codeVerifier,
                code: paramcode,
                redirect_uri: REDIRECT_URI,
            }),
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return NextResponse.json({ error: "Failed to get token", details: errorDetails }, { status: 400 });
        }

        const { access_token, refresh_token, expires_in } = await response.json();

        // Save token to Firebase under a proper user ID (change as needed)
        await set(ref(db, `users/${paramcode}`), {
            access_token,
            refresh_token,
            expires_in,
            created_at: Date.now(),
        });

        return NextResponse.json({ message: "Token saved successfully", access_token });

    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}
