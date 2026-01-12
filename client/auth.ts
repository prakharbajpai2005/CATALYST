import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        GitHub,
        Google,
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                try {
                    const res = await fetch("http://localhost:5000/api/users/login", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                    })

                    const user = await res.json()

                    if (!res.ok) {
                        throw new Error(user.error || "Invalid credentials")
                    }

                    return {
                        id: user._id,
                        name: user.goodname || user.username,
                        email: user.email,
                        ...user
                    }
                } catch (error) {
                    console.error("Login error:", error)
                    return null
                }
            },
        }),
    ],
    pages: {
        signIn: "/auth/signin",
    },
    callbacks: {
        async jwt({ token, user }: { token: any, user: any }) {
            if (user) {
                console.log("DEBUG: JWT Callback User:", JSON.stringify(user, null, 2));
                token.name = user.goodname || user.username || user.name
                token.id = user._id
                console.log("DEBUG: JWT Token set to:", JSON.stringify(token, null, 2));
            }
            return token
        },
        async session({ session, token }: { session: any, token: any }) {
            console.log("DEBUG: Session Callback Token:", JSON.stringify(token, null, 2));
            if (session.user) {
                session.user.name = token.name
                session.user.id = token.id
            }
            return session
        }
    }
})
