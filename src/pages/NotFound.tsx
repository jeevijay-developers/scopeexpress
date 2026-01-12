import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Home, ArrowLeft, Search, BookOpen, Briefcase, HelpCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const NotFound = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const quickLinks = [
    { icon: Home, label: 'Home', href: '/', color: 'bg-primary' },
    { icon: BookOpen, label: 'Practice Quiz', href: '/practice', color: 'bg-success' },
    { icon: Briefcase, label: 'Career Guidance', href: '/career', color: 'bg-secondary' },
    { icon: HelpCircle, label: 'Contact Us', href: '/contact', color: 'bg-accent' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 right-1/3 w-40 h-40 bg-success/10 rounded-full blur-2xl animate-bounce-slow"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-10 right-10 text-6xl animate-float">🔍</div>
      <div className="absolute bottom-10 left-10 text-5xl animate-float" style={{ animationDelay: '0.5s' }}>📚</div>
      <div className="absolute top-1/4 left-10 text-4xl animate-bounce-slow" style={{ animationDelay: '0.3s' }}>🎯</div>
      
      <div className="text-center relative z-10 max-w-2xl mx-auto">
        {/* 404 Display */}
        <div className="relative mb-8">
          <h1 className="text-[150px] md:text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary leading-none animate-fade-in">
            404
          </h1>
          <div className="absolute inset-0 text-[150px] md:text-[200px] font-black text-primary/5 leading-none blur-lg">
            404
          </div>
        </div>
        
        {/* Error Message */}
        <div className="space-y-4 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="inline-flex items-center gap-2 bg-warning/10 text-warning px-4 py-2 rounded-full">
            <Sparkles className="h-4 w-4" />
            <span className="font-medium">Page Not Found</span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Oops! This page seems to be on a study break 📖
          </h2>
          
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track!
          </p>
          
          <p className="text-sm text-muted-foreground">
            Attempted path: <code className="bg-muted px-2 py-1 rounded">{location.pathname}</code>
          </p>
        </div>
        
        {/* Search Box */}
        <div className="max-w-md mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for what you're looking for..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg rounded-2xl border-2 border-muted focus:border-primary"
            />
          </div>
        </div>
        
        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          {quickLinks.map((link, i) => (
            <Link 
              key={i}
              to={link.href}
              className="group p-4 bg-card rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border"
            >
              <div className={`w-12 h-12 ${link.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                <link.icon className="h-6 w-6 text-white" />
              </div>
              <p className="font-semibold text-sm">{link.label}</p>
            </Link>
          ))}
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Button 
            asChild 
            size="lg" 
            className="bg-gradient-to-r from-primary to-accent text-white h-14 px-8 text-lg rounded-2xl shadow-lg hover:shadow-xl"
          >
            <Link to="/">
              <Home className="mr-2 h-5 w-5" />
              Go to Homepage
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => window.history.back()}
            className="h-14 px-8 text-lg rounded-2xl"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </Button>
        </div>
        
        {/* Fun Stats */}
        <div className="mt-12 pt-8 border-t border-border animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <p className="text-muted-foreground mb-4">While you're here, did you know?</p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">1000+</p>
              <p className="text-sm text-muted-foreground">Students Guided</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-success">30+</p>
              <p className="text-sm text-muted-foreground">Career Paths</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-secondary">500+</p>
              <p className="text-sm text-muted-foreground">Quiz Questions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
