import crypto from "crypto";
import base64url from "base64url";

const CLIENT_ID = process.env.KICK_CLIENT_ID;
const REDIRECT_URI = process.env.KICK_REDIRECT_URI;

export async function GET(req) {
    const codeVerifier = base64url(crypto.randomBytes(32));
    const codeChallenge = base64url(crypto.createHash("sha256").update(codeVerifier).digest());

    const authUrl = `https://id.kick.com/oauth/authorize?` +
        `response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
        `&scope=identify&code_challenge=${codeChallenge}&code_challenge_method=S256`;

    return Response.redirect(authUrl);
}
