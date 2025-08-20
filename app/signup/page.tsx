"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Add your sign up logic here
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

        {/* Sign up card */}
        <div className="bg-card/50 backdrop-blur-sm rounded-xl px-4 py-5 md:py-8 border border-border">
          <div className="text-center mb-6">
            <h1 className="text-lg md:text-xl mb-1 font-playfair-regular">Create account</h1>
            <p className="text-xs md:text-sm text-muted-foreground/70">Join TidyMind to organize your thoughts</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Name field */}
            <div>
              <Input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-9 text-sm rounded-md bg-background/70 border-border focus:bg-background focus:outline-none focus:ring-0 focus:border-border focus-visible:ring-0 focus-visible:ring-offset-0"
                required
              />
            </div>

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
              <p className="text-xs text-muted-foreground mt-1">Must be at least 8 characters</p>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading || !email || !password || !name}
              className="w-full h-8 text-sm rounded-lg bg-foreground text-background font-medium hover:opacity-90 transition-opacity disabled:opacity-50 mt-4"
            >
              {isLoading ? "Creating account..." : "Sign up"}
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

            {/* Social signup buttons */}
            <div className="w-full">
              <button
                type="button"
                className="w-full h-8 text-sm rounded-md border border-border bg-background hover:bg-muted transition-colors font-medium text-foreground mt-2"
              >
                Continue with Google
              </button>
            </div>
          </form>

          {/* Sign in link */}
          <p className="text-center mt-4 text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link 
              href="/login" 
              className="font-medium hover:text-foreground transition-colors"
              style={{ color: 'var(--tidymind-accent)' }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}