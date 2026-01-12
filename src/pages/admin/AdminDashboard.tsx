import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LogOut, Users, Gamepad2, BarChart3, HelpCircle, 
  BookOpen, ShoppingBag, GraduationCap, Menu, X,
  Home, Settings, ChevronRight, Sparkles, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import logo from '@/assets/logo.png';

import AdminStats from '@/components/admin/AdminStats';
import LeadsTable from '@/components/admin/LeadsTable';
import QuizSessionsTable from '@/components/admin/QuizSessionsTable';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import QuestionManager from '@/components/admin/QuestionManager';
import LibraryManager from '@/components/admin/LibraryManager';

interface Lead {
  id: string;
  name: string;
  mobile: string;
  class: string | null;
  school: string | null;
  source_page: string;
  interest_type: string | null;
  career_interest: string | null;
  preferred_timing: string | null;
  product_interest: string | null;
  message: string | null;
  created_at: string;
}

interface QuizSession {
  id: string;
  lead_id: string | null;
  topic: string;
  score: number | null;
  level: string | null;
  correct_answers: number | null;
  questions_attempted: number | null;
  completed: boolean | null;
  completed_at: string | null;
  created_at: string;
}

const menuItems = [
  { id: 'overview', label: 'All Leads', icon: Users },
  { id: 'practice', label: 'Practice Quiz', icon: Gamepad2 },
  { id: 'library', label: 'Library', icon: BookOpen },
  { id: 'career', label: 'Career Guidance', icon: GraduationCap },
  { id: 'stationery', label: 'Stationery', icon: ShoppingBag },
  { id: 'contact', label: 'Contact Forms', icon: MessageSquare },
  { id: 'quizzes', label: 'Quiz Sessions', icon: Gamepad2 },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'questions', label: 'Question Bank', icon: HelpCircle },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [quizSessions, setQuizSessions] = useState<QuizSession[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin');
      return;
    }

    const { data: adminData } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (!adminData) {
      await supabase.auth.signOut();
      navigate('/admin');
    }
  };

  const fetchData = async () => {
    try {
      const [leadsRes, sessionsRes, questionsRes] = await Promise.all([
        supabase.from('leads').select('*').order('created_at', { ascending: false }),
        supabase.from('quiz_sessions').select('*').order('created_at', { ascending: false }),
        supabase.from('quiz_questions').select('id', { count: 'exact', head: true }),
      ]);

      if (leadsRes.error) throw leadsRes.error;
      if (sessionsRes.error) throw sessionsRes.error;

      setLeads(leadsRes.data || []);
      setQuizSessions(sessionsRes.data || []);
      setTotalQuestions(questionsRes.count || 0);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <LeadsTable leads={leads} quizSessions={quizSessions} isLoading={isLoading} />;
      case 'practice':
        return <LeadsTable leads={leads} quizSessions={quizSessions} isLoading={isLoading} sourceFilter="Free Practice" />;
      case 'library':
        return <LibraryManager leads={leads} isLoading={isLoading} />;
      case 'career':
        return <LeadsTable leads={leads} quizSessions={quizSessions} isLoading={isLoading} sourceFilter="Career Guidance" />;
      case 'stationery':
        return <LeadsTable leads={leads} quizSessions={quizSessions} isLoading={isLoading} sourceFilter="Stationery" />;
      case 'contact':
        return <LeadsTable leads={leads} quizSessions={quizSessions} isLoading={isLoading} sourceFilter="Contact" />;
      case 'quizzes':
        return <QuizSessionsTable quizSessions={quizSessions} leads={leads} isLoading={isLoading} />;
      case 'analytics':
        return <AnalyticsDashboard leads={leads} quizSessions={quizSessions} />;
      case 'questions':
        return <QuestionManager />;
      default:
        return <LeadsTable leads={leads} quizSessions={quizSessions} isLoading={isLoading} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 bg-sidebar text-sidebar-foreground
        transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'w-64' : 'w-20'}
        hidden lg:flex flex-col
      `}>
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Scope Express" className="h-10 w-10 rounded-lg" />
            {sidebarOpen && (
              <div className="animate-fade-in">
                <h1 className="font-bold text-lg">Admin Panel</h1>
                <p className="text-xs text-sidebar-foreground/70">Scope Express</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu */}
        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-3">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-3 rounded-xl
                    transition-all duration-200 group
                    ${isActive 
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg' 
                      : 'hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground'
                    }
                  `}
                >
                  <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'animate-pulse' : ''}`} />
                  {sidebarOpen && (
                    <>
                      <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                      {isActive && <ChevronRight className="h-4 w-4" />}
                    </>
                  )}
                </button>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full justify-start gap-3 text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <Menu className="h-5 w-5" />
            {sidebarOpen && <span>Collapse</span>}
          </Button>
          <Link to="/" className="mt-2 w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all">
            <Home className="h-5 w-5" />
            {sidebarOpen && <span className="text-sm">View Website</span>}
          </Link>
        </div>
      </aside>

      {/* Mobile Menu */}
      <div className={`
        fixed inset-0 z-50 bg-black/50 lg:hidden transition-opacity
        ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `} onClick={() => setMobileMenuOpen(false)}>
        <aside 
          className={`
            w-72 h-full bg-sidebar text-sidebar-foreground
            transform transition-transform duration-300
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
          onClick={e => e.stopPropagation()}
        >
          <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Scope Express" className="h-10 w-10 rounded-lg" />
              <div>
                <h1 className="font-bold text-lg">Admin Panel</h1>
                <p className="text-xs text-sidebar-foreground/70">Scope Express</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <ScrollArea className="flex-1 py-4">
            <nav className="space-y-1 px-3">
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                    className={`
                      w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all
                      ${isActive 
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                        : 'hover:bg-sidebar-accent'
                      }
                    `}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </ScrollArea>
        </aside>
      </div>

      {/* Main Content */}
      <main className={`
        flex-1 min-h-screen transition-all duration-300
        ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}
      `}>
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-card/95 backdrop-blur border-b border-border shadow-sm">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="font-bold text-lg flex items-center gap-2">
                  {menuItems.find(m => m.id === activeTab)?.label}
                  <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                </h1>
                <p className="text-xs text-muted-foreground">
                  {leads.length} total leads • {quizSessions.length} quiz sessions
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-6 space-y-6">
          {/* Stats - Show on overview */}
          {activeTab === 'overview' && (
            <AdminStats 
              leads={leads} 
              quizSessions={quizSessions} 
              totalQuestions={totalQuestions} 
            />
          )}

          {/* Content */}
          <div className="animate-fade-in">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
