// src/app/page.js
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import styles from './page.module.css';
import Link from 'next/link';

export default async function Home() {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth-token');

    if (!authToken) {
        redirect('/login');
    }

    return (
        <div className={styles.container}>
            <div className={styles.buttonGroup}>
                <Link href="/TeamSelector" className={styles.button}>
                    Ekip Listesi
                </Link>
                <Link href="/Countdown" className={styles.button}>
                    Countdown
                </Link>
                <Link href="/EkipList" className={styles.button}>
                    Team Selector
                </Link>
            </div>
        </div>
    );
}