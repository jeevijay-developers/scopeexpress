import { Users, BookOpen, GraduationCap, Gamepad2, ShoppingBag, MessageSquare, HelpCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Lead {
  id: string;
  source_page: string;
}

interface QuizSession {
  id: string;
  completed: boolean | null;
}

interface AdminStatsProps {
  leads: Lead[];
  quizSessions: QuizSession[];
  totalQuestions: number;
}

const AdminStats = ({ leads, quizSessions, totalQuestions }: AdminStatsProps) => {
  const stats = [
    { 
      label: 'Total Leads', 
      value: leads.length, 
      icon: Users, 
      color: 'bg-primary' 
    },
    { 
      label: 'Practice Users', 
      value: leads.filter(l => l.source_page === 'Free Practice').length, 
      icon: Gamepad2, 
      color: 'bg-accent' 
    },
    { 
      label: 'Library Enquiries', 
      value: leads.filter(l => l.source_page === 'Library').length, 
      icon: BookOpen, 
      color: 'bg-primary' 
    },
    { 
      label: 'Career Requests', 
      value: leads.filter(l => l.source_page === 'Career Guidance').length, 
      icon: GraduationCap, 
      color: 'bg-secondary' 
    },
    { 
      label: 'Stationery', 
      value: leads.filter(l => l.source_page === 'Stationery').length, 
      icon: ShoppingBag, 
      color: 'bg-success' 
    },
    { 
      label: 'Contact Forms', 
      value: leads.filter(l => l.source_page === 'Contact').length, 
      icon: MessageSquare, 
      color: 'bg-warning' 
    },
    { 
      label: 'Quiz Completed', 
      value: quizSessions.filter(s => s.completed).length, 
      icon: Gamepad2, 
      color: 'bg-accent' 
    },
    { 
      label: 'Total Questions', 
      value: totalQuestions, 
      icon: HelpCircle, 
      color: 'bg-primary' 
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminStats;
