"use client"

import Link from "next/link"

export function Footer() {
  return (
    <div className="relative mt-8">
      <div className="mx-4 md:mx-6">
        <footer className="bg-card/90 backdrop-blur-sm rounded-t-3xl border-t border-border px-4 md:px-8 py-6">
          <div className="max-w-6xl mx-auto">
            {/* Main footer content */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* Column 1 */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">About</h3>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground text-sm">Why TidyMind</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground text-sm">Our Pricing</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground text-sm">How it Works</Link></li>
                </ul>
              </div>

              {/* Column 2 */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Our Apps</h3>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground text-sm">iOS App</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground text-sm">Android App</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground text-sm">Browser Extension</Link></li>
                </ul>
              </div>

              {/* Column 3 */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">About Us</h3>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground text-sm">Our Manifesto</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground text-sm">Our Promise</Link></li>
                </ul>
              </div>

              {/* Column 4 */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Help & Contact</h3>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground text-sm">@tidymind on Twitter</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground text-sm">Guides & Contact Form</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground text-sm">Video Tutorials</Link></li>
                </ul>
              </div>
            </div>

            {/* Bottom section */}
            <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-border gap-4">
              <div className="text-sm text-muted-foreground">
                © TidyMind, Inc. 2025
              </div>
              <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms & Conditions</Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">FAQ</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}