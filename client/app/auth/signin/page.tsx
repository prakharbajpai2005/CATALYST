"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Github } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function SignInPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const successMessage = searchParams.get("success")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleCredentialsLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(event.currentTarget)
        const email = formData.get("email")
        const password = formData.get("password")

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                setError("Invalid email or password")
            } else {
                router.push("/")
                router.refresh()
            }
        } catch (err) {
            setError("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="h-screen w-full flex justify-center bg-black text-white overflow-y-auto pt-24 pb-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            <Card className="w-full max-w-md bg-gray-800 border-gray-700 text-white my-auto">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Sign in to CATALYST</CardTitle>
                    <CardDescription className="text-center text-gray-400">
                        Choose your preferred sign in method
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    {successMessage && (
                        <div className="bg-green-900/50 border border-green-500 text-green-200 p-3 rounded-md text-sm text-center">
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleCredentialsLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" required className="bg-gray-900 border-gray-600 text-white" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required className="bg-gray-900 border-gray-600 text-white" />
                        </div>
                        {error && <div className="text-red-500 text-sm">{error}</div>}
                        <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold" type="submit" disabled={loading}>
                            {loading ? "Signing in..." : "Sign In with Email"}
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-600" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-gray-800 px-2 text-gray-400">Or continue with</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            className="flex-1 bg-white hover:bg-gray-200 text-black font-semibold"
                            onClick={() => signIn("github", { callbackUrl: "/" })}
                        >
                            <Github className="mr-2 h-4 w-4" />
                            GitHub
                        </Button>

                        <Button
                            className="flex-1 bg-white hover:bg-gray-200 text-black font-semibold"
                            onClick={() => signIn("google", { callbackUrl: "/" })}
                        >
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google
                        </Button>
                    </div>

                    <div className="mt-4 text-center text-sm text-gray-400">
                        Don't have an account?{" "}
                        <Link href="/auth/signup" className="text-yellow-500 hover:underline">
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
