import Link from "next/link"
import { Building2, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="footer section-bg" aria-label="Site footer">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start md:items-center">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="font-bold font-headline text-2xl">Lodgify Lite</span>
            </Link>
            <p className="mt-4 text-sm text-muted">Your next unforgettable stay is just a few clicks away.</p>
          </div>

          <div>
            <h3 className="font-headline text-lg font-semibold footer-heading">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/" className="text-sm hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/search" className="text-sm hover:text-primary transition-colors">Featured Hotels</Link></li>
              <li><Link href="/admin" className="text-sm hover:text-primary transition-colors">Admin Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-headline text-lg font-semibold footer-heading">Support</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="#" className="text-sm hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="text-sm hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="#" className="text-sm hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div className="flex flex-col">
            <h3 className="font-headline text-lg font-semibold footer-heading">Connect</h3>
            <div className="flex mt-4 justify-center md:justify-start space-x-4">
              <Link href="#" className="text-muted hover:text-primary transition-colors">
                <Twitter className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted">
          <p>&copy; {new Date().getFullYear()} Lodgify Lite. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
