import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Vote, Shield, Home } from "lucide-react";

export default function Header() {
  const [location] = useLocation();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Vote className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">VoteApp</span>
          </Link>
          
          <nav className="flex items-center space-x-4">
            <Link href="/">
              <Button 
                variant={location === "/" ? "default" : "ghost"}
                size="sm"
                className="flex items-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>Vote</span>
              </Button>
            </Link>
            
            <Link href="/admin">
              <Button 
                variant={location.startsWith("/admin") ? "default" : "ghost"}
                size="sm"
                className="flex items-center space-x-2"
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}