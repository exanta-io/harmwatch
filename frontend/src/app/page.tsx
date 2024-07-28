import Link from 'next/link';
import ExantaLogo from '@/components/icons/ExantaLogo';
export default function Home() {
  // check if cookie currentUserHash is equal to NEXT_PUBLIC_HASH and if is set redirect to /conversations
if (typeof window !== 'undefined') {
  const currentUserHash = document.cookie
    .split('; ')
    .find((row) => row.startsWith('currentUserHash='))
    ?.split('=')[1];

  if (currentUserHash === process.env.NEXT_PUBLIC_HASH) {
    window.location.href = '/conversations';
  }
}
  return (
    <div className="min-h-screen w-screen bg-base-300 p-10">
      <ExantaLogo />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl font-semibold">Chat with any PDF</h1>
          </div>
          <div className="flex mt-4">
            <Link href="/conversations">
              <button className="btn btn-primary">Start Chatting</button>
            </Link>
          </div>
          <div className="flex mt-4">
            <Link href="/login">
              <span className="text-sm text-neutral-content">
                powered by{' '}
                <span className="text-primary hover:underline">Exanta</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
