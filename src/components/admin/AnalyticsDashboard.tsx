import { useMemo } from 'react';
import { TrendingUp, Users, Target, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

interface Lead {
  id: string;
  source_page: string;
  class: string | null;
  created_at: string;
}

interface QuizSession {
  id: string;
  topic: string;
  score: number | null;
  level: string | null;
  completed: boolean | null;
  created_at: string;
}

interface AnalyticsDashboardProps {
  leads: Lead[];
  quizSessions: QuizSession[];
}

const COLORS = ['hsl(217, 91%, 50%)', 'hsl(24, 95%, 53%)', 'hsl(4, 90%, 58%)', 'hsl(142, 71%, 45%)', 'hsl(38, 92%, 50%)'];

const AnalyticsDashboard = ({ leads, quizSessions }: AnalyticsDashboardProps) => {
  // Source distribution
  const sourceData = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach(lead => {
      counts[lead.source_page] = (counts[lead.source_page] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [leads]);

  // Class distribution
  const classData = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach(lead => {
      const cls = lead.class || 'Unknown';
      counts[cls] = (counts[cls] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name: `Class ${name}`, value }))
      .sort((a, b) => {
        const aNum = parseInt(a.name.replace('Class ', ''));
        const bNum = parseInt(b.name.replace('Class ', ''));
        return aNum - bNum;
      });
  }, [leads]);

  // Quiz topic distribution
  const topicData = useMemo(() => {
    const counts: Record<string, number> = {};
    quizSessions.forEach(session => {
      counts[session.topic] = (counts[session.topic] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ 
      name: name.charAt(0).toUpperCase() + name.slice(1), 
      value 
    }));
  }, [quizSessions]);

  // Average score by topic
  const avgScoreByTopic = useMemo(() => {
    const totals: Record<string, { sum: number; count: number }> = {};
    quizSessions.forEach(session => {
      if (typeof session.score === 'number') {
        if (!totals[session.topic]) {
          totals[session.topic] = { sum: 0, count: 0 };
        }
        totals[session.topic].sum += session.score;
        totals[session.topic].count += 1;
      }
    });
    return Object.entries(totals).map(([topic, { sum, count }]) => ({
      name: topic.charAt(0).toUpperCase() + topic.slice(1),
      avgScore: Math.round(sum / count),
    }));
  }, [quizSessions]);

  // Leads over time (last 7 days)
  const leadsOverTime = useMemo(() => {
    const days: Record<string, number> = {};
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const key = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      days[key] = 0;
    }

    leads.forEach(lead => {
      const date = new Date(lead.created_at);
      const key = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      if (key in days) {
        days[key]++;
      }
    });

    return Object.entries(days).map(([date, count]) => ({ date, leads: count }));
  }, [leads]);

  // Key metrics
  const metrics = useMemo(() => {
    const completedQuizzes = quizSessions.filter(s => s.completed).length;
    const avgScore = quizSessions.reduce((acc, s) => acc + (s.score || 0), 0) / (quizSessions.length || 1);
    const conversionRate = leads.length > 0 ? ((completedQuizzes / leads.filter(l => l.source_page === 'Free Practice').length) * 100) : 0;
    
    return {
      completedQuizzes,
      avgScore: Math.round(avgScore),
      conversionRate: Math.round(conversionRate) || 0,
      totalLeads: leads.length,
    };
  }, [leads, quizSessions]);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold">{metrics.totalLeads}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed Quizzes</p>
                <p className="text-2xl font-bold">{metrics.completedQuizzes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Score</p>
                <p className="text-2xl font-bold">{metrics.avgScore}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">{metrics.conversionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Leads Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Leads Over Time</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={leadsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="leads" stroke="hsl(217, 91%, 50%)" strokeWidth={2} dot={{ fill: 'hsl(217, 91%, 50%)' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Source Distribution Pie */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
            <CardDescription>Distribution by source</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Class Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Students by Class</CardTitle>
            <CardDescription>Distribution across classes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={classData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(217, 91%, 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quiz Topic Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Average Score by Topic</CardTitle>
            <CardDescription>Quiz performance analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={avgScoreByTopic}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="avgScore" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quiz Topics Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Quiz Attempts by Topic</CardTitle>
          <CardDescription>Which topics are most popular</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topicData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" fontSize={12} />
              <YAxis dataKey="name" type="category" fontSize={12} width={80} />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(24, 95%, 53%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
