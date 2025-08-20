"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Add your login logic here
    setTimeout(() => setIsLoading(false), 1000)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-xs">
        {/* Back to home link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-2 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-xs">Back to home</span>
        </Link>

        {/* Login card */}
        <div className="bg-card/50 backdrop-blur-sm rounded-xl px-4 py-5 md:py-8 border border-border">
          <div className="text-center mb-6">
            <h1 className="text-lg md:text-xl mb-1 font-playfair-regular">Welcome back</h1>
            <p className="text-xs md:text-sm text-muted-foreground/70">Sign in to your TidyMind account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Email field */}
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 text-sm rounded-md bg-background/70 border-border focus:bg-background focus:outline-none focus:ring-0 focus:border-border focus-visible:ring-0 focus-visible:ring-offset-0"
                required
              />
            </div>

            {/* Password field */}
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-9 text-sm rounded-md bg-background/70 border-border focus:bg-background focus:outline-none focus:ring-0 focus:border-border focus-visible:ring-0 focus-visible:ring-offset-0"
                required
              />
              {/* Forgot password link */}
              <div className="text-right">
                <Link 
                  href="#" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full h-8 text-sm rounded-lg bg-foreground text-background font-medium hover:opacity-90 transition-opacity disabled:opacity-50 mt-4"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button> 

            {/* Divider */}
            <div className="relative my-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card/50 px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
 
            {/* Social login buttons */}
            <div className="w-full">
              <button
                type="button"
                className="w-full h-8 text-sm rounded-md border border-border bg-background hover:bg-muted transition-colors font-medium text-foreground mt-2"
              >
                Continue with Google
              </button>
            </div>
          </form>

          {/* Sign up link */}
          <p className="text-center mt-4 text-xs text-muted-foreground">
            Don't have an account?{" "}
            <Link 
              href="/signup" 
              className="font-medium hover:text-foreground transition-colors"
              style={{ color: 'var(--tidymind-accent)' }}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}