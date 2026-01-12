import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, Users, Gamepad2, BarChart3, HelpCircle, 
  BookOpen, ShoppingBag, MessageSquare, GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import logo from '@/assets/logo.png';

import AdminStats from '@/components/admin/AdminStats';
import LeadsTable from '@/components/admin/LeadsTable';
import QuizSessionsTable from '@/components/admin/QuizSessionsTable';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import QuestionManager from '@/components/admin/QuestionManager';

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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [quizSessions, setQuizSessions] = useState<QuizSession[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

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
        supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('quiz_sessions')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('quiz_questions')
          .select('id', { count: 'exact', head: true }),
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Scope Express" className="h-10 w-auto" />
            <div>
              <h1 className="font-bold text-lg">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">Scope Express</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <AdminStats 
          leads={leads} 
          quizSessions={quizSessions} 
          totalQuestions={totalQuestions} 
        />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2 h-auto p-2">
            <TabsTrigger value="overview" className="flex items-center gap-2 py-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">All Leads</span>
            </TabsTrigger>
            <TabsTrigger value="practice" className="flex items-center gap-2 py-2">
              <Gamepad2 className="h-4 w-4" />
              <span className="hidden sm:inline">Practice</span>
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2 py-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Library</span>
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="flex items-center gap-2 py-2">
              <Gamepad2 className="h-4 w-4" />
              <span className="hidden sm:inline">Quiz Sessions</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 py-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="questions" className="flex items-center gap-2 py-2">
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Questions</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <LeadsTable 
              leads={leads} 
              quizSessions={quizSessions} 
              isLoading={isLoading} 
            />
          </TabsContent>

          <TabsContent value="practice">
            <LeadsTable 
              leads={leads} 
              quizSessions={quizSessions} 
              isLoading={isLoading}
              sourceFilter="Free Practice"
            />
          </TabsContent>

          <TabsContent value="library">
            <LeadsTable 
              leads={leads} 
              quizSessions={quizSessions} 
              isLoading={isLoading}
              sourceFilter="Library"
            />
          </TabsContent>

          <TabsContent value="quizzes">
            <QuizSessionsTable 
              quizSessions={quizSessions} 
              leads={leads} 
              isLoading={isLoading} 
            />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard 
              leads={leads} 
              quizSessions={quizSessions} 
            />
          </TabsContent>

          <TabsContent value="questions">
            <QuestionManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
