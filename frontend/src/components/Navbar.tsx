import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X, Briefcase } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-white/80 dark:bg-brand-purple/80 backdrop-blur-md py-2 shadow-md"
          : "bg-transparent py-4"
        }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-2xl font-bold">
          <Briefcase className="h-8 w-8 text-brand-red" />
          <span className="bg-gradient-to-r from-brand-red to-brand-tangerine bg-clip-text text-transparent">
            JobLinker
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLinks />
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {!isAuthenticated ? (
              <div className="flex space-x-4">
                <Link to="/login">
                  <Button variant="outline" className="font-medium px-4">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-brand-red hover:bg-brand-red/90 text-white font-medium px-4">
                    Sign Up
                  </Button>
                </Link>
              </div>
            ) : (
              <Button
                variant="ghost"
                onClick={()=>{
                  logout()
                  navigate("/");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                Logout
              </Button>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            className="text-foreground"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-dark animate-fade-in">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <NavLinks mobile />
              <div className="pt-4 flex flex-col space-y-3">
                {!isAuthenticated ? (
                  <div className="flex space-x-4">
                    <Link to="/login">
                      <Button variant="outline" className="w-full font-medium">
                        Login
                      </Button>
                    </Link>
                    <Link to="/signup">
                      <Button className="w-full bg-brand-red hover:bg-brand-red/90 text-white font-medium">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    onClick={logout}
                    className="w-full text-gray-500 hover:text-gray-700"
                  >
                    Logout
                  </Button>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

const NavLinks = ({ mobile = false }: { mobile?: boolean }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const role = localStorage.getItem("role"); // 'employer' or 'candidate'

  const links = [
    ...(role === "candidate" ? [{ name: "Find Jobs", path: "/jobs" }] : []),
    ...(role === "employer" ? [{ name: "For Employers", path: "/employers" }] : []),
    { name: "Resources", path: "/resources" },
    ...(isAuthenticated
      ? [
          { name: "Dashboard", path: "/dashboard" },
          { name: "Profile", path: "/profile/update" },
          { name: "Interviews", path: "/interviews" },
          // { name: "Reviews", path: "/reviews" },
        ]
      : []),
  ];

  return (
    <>
      {links.map((link) => {
        const isActive = location.pathname === link.path;

        return (
          <Link
            key={link.name}
            to={link.path}
            className={`font-medium transition-colors duration-300 ${isActive ? "text-brand-red" : "hover:text-brand-red"
              } ${mobile ? "text-lg py-2" : ""}`}
          >
            {link.name}
          </Link>
        );
      })}
    </>
  );
};
