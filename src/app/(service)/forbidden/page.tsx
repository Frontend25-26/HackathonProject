import Link from 'next/link';

export default async function Forbidden() {
    return (
        <>
            <h1>403 - Forbidden</h1>
            <Link href="/">На главную</Link>
        </>
    );
}
