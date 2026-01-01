'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Orbitron } from 'next/font/google';

const orbitron = Orbitron({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'] });

export default function Navbar() {
    const router = useRouter();

    return (
        <header className="fixed top-0 right-0 left-20 z-40 bg-black">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className={`text-3xl font-bold text-white tracking-widest ${orbitron.className}`}>
                        CATALYST
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <button className="text-white bg-zinc-700 px-4 py-2 rounded-full">
                        Sign In
                    </button>
                    <Button
                        className="text-white bg-zinc-700 px-4 py-3 rounded-full  hover:bg-yellow-600"
                        onClick={() => router.push('/upload')}
                    >
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
