import { db, ref, get } from "../../../../firebase"; // Firebase bağlantısını kullan

export async function GET(req) {
    const {searchParams} = new URL(req.url);
    const userId = searchParams.get("user_id"); // Kullanıcı kimliğini al

    if (!userId) {
        return Response.json({error: "User ID is required"}, {status: 400});
    }

    try {
        const snapshot = await get(ref(db, `users/${userId}`));

        if (!snapshot.exists()) {
            return Response.json({error: "User not found"}, {status: 404});
        }

        return Response.json(snapshot.val(), {status: 200});
    } catch (error) {
        return Response.json({error: "Failed to fetch token"}, {status: 500});
    }
}
