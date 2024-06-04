import QuickButton from '@/components/QuickButton';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="p-24 min-h-screen flex flex-col items-center justify-between">
      <div>
        <QuickButton />
      </div>
    </main>
  );
}
