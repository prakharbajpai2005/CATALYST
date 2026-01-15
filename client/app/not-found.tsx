"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Orbit } from "lucide-react"

export default function NotFound() {
    return (
        <div className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Stars */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute bg-white rounded-full opacity-50"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 3 + 1}px`,
                            height: `${Math.random() * 3 + 1}px`,
                            animation: `twinkle ${Math.random() * 5 + 3}s infinite`,
                        }}
                    />
                ))}
            </div>

            <div className="z-10 flex flex-col items-center text-center space-y-8">
                <div className="relative">
                    {/* Planet Icon */}
                    <div className="absolute -left-32 top-1/2 -translate-y-1/2 hidden md:block">
                        <Orbit className="w-24 h-24 text-white opacity-80 -rotate-45" strokeWidth={1.5} />
                    </div>

                    {/* 404 Text */}
                    <h1
                        className="text-[150px] md:text-[200px] font-bold leading-none tracking-tighter text-transparent"
                        style={{ WebkitTextStroke: '2px white' }}
                    >
                        404
                    </h1>
                </div>

                <div className="space-y-4 max-w-md mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold">Page Not Found!</h2>
                    <p className="text-gray-400 text-lg">
                        The requested page could not be found on the server.
                    </p>
                </div>

                <Link href="/">
                    <Button
                        variant="outline"
                        className="rounded-full px-8 py-6 text-lg border-2 border-white text-white hover:bg-white hover:text-black transition-colors bg-transparent mt-8"
                    >
                        GO HOME
                    </Button>
                </Link>
            </div>

            <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
      `}</style>
        </div>
    )
}
