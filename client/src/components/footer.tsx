import { Link } from "wouter";
import { BarChart3, Mail, Phone, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <BarChart3 className="h-6 w-6 text-orange-500 mr-2" />
              <h2 className="text-xl font-bold">Amazon PPC Optimizer</h2>
            </div>
            <p className="text-muted-foreground text-sm">
              Powerful bid optimization and analytics for Amazon PPC advertisers.
              Streamline your campaigns and maximize ROI with our intelligent tools.
            </p>
            <div className="flex items-center text-muted-foreground text-sm">
              <Heart className="h-4 w-4 mr-1 text-orange-500" />
              <span>Crafted with care by Ecom Hawks</span>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/rules" className="text-muted-foreground hover:text-foreground transition-colors">
                  Optimization Rules
                </Link>
              </li>
              <li>
                <Link href="/#features" className="text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/documentation" className="text-muted-foreground hover:text-foreground transition-colors">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="font-medium mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/support" className="text-muted-foreground hover:text-foreground transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/documentation" className="text-muted-foreground hover:text-foreground transition-colors">
                  API Documentation
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  System Status
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="font-medium mb-4">Contact Ecom Hawks</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <Mail className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <span className="text-muted-foreground">contact@ecomhawks.com</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <span className="text-muted-foreground">+1 (555) 123-4567</span>
              </li>
              <li className="text-muted-foreground">
                <span className="block">Founder:</span>
                <span className="font-medium">Meer Hamza</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Ecom Hawks. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="/terms-of-service" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Terms of Service
            </a>
            <a href="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Privacy Policy
            </a>
            <a href="/documentation" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Documentation
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}