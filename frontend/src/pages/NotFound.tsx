
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { AnimatedElement } from "@/components/AnimatedElement";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <AnimatedElement animation="scale-in">
            <div className="mb-8">
              <div className="text-9xl font-bold bg-gradient-to-br from-brand-red to-brand-tangerine bg-clip-text text-transparent">
                404
              </div>
              <h1 className="text-3xl font-bold mt-4 mb-2">Page Not Found</h1>
              <p className="text-muted-foreground">
                Oops! The page you're looking for doesn't exist or has been moved.
              </p>
            </div>
            
            <Link to="/">
              <Button className="btn-primary flex items-center">
                <Home className="h-4 w-4 mr-2" />
                <span>Back to Home</span>
              </Button>
            </Link>
          </AnimatedElement>
        </div>
      </div>
      
      <footer className="bg-brand-charcoal dark:bg-brand-purple text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/70">© {new Date().getFullYear()} JobLinker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default NotFound;
