import { NextResponse } from 'next/server';

const VALID_USER = {
    username: 'hivez',
    password: '1234'
};

export async function POST(request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        if (username === VALID_USER.username && password === VALID_USER.password) {
            const response = NextResponse.json({ success: true });

            response.cookies.set('auth-token', 'sample-token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 3600
            });

            return response;
        }

        return NextResponse.json(
            { error: 'Hatalı kullanıcı adı veya şifre' },
            { status: 401 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500 }
        );
    }
}