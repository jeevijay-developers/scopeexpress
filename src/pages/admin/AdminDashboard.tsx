import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, BookOpen, GraduationCap, Gamepad2, LogOut, Download, 
  Filter, Calendar, Search, ChevronDown, FileSpreadsheet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import logo from '@/assets/logo.png';

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
  quiz_topic: string | null;
  quiz_score: number | null;
  quiz_level: string | null;
  message: string | null;
  created_at: string;
}

interface QuizSession {
  id: string;
  lead_id: string | null;
  topic: string;
  score: number | null;
  level: string | null;
  completed: boolean | null;
  completed_at: string | null;
  created_at: string;
}

const sourceColors: Record<string, string> = {
  'Free Practice': 'bg-accent',
  'Career Guidance': 'bg-secondary',
  'Library': 'bg-primary',
  'Stationery': 'bg-success',
  'Contact': 'bg-warning',
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [quizSessions, setQuizSessions] = useState<QuizSession[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const latestSessionByLeadId = useMemo(() => {
    const map: Record<string, QuizSession> = {};
    for (const session of quizSessions) {
      if (!session.lead_id) continue;
      const existing = map[session.lead_id];
      if (!existing) {
        map[session.lead_id] = session;
        continue;
      }
      const existingTime = new Date(existing.created_at).getTime();
      const newTime = new Date(session.created_at).getTime();
      if (newTime > existingTime) map[session.lead_id] = session;
    }
    return map;
  }, [quizSessions]);

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
  ];

  useEffect(() => {
    checkAuth();
    fetchLeads();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [leads, searchQuery, sourceFilter, classFilter, dateFilter]);

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

  const fetchLeads = async () => {
    try {
      const [leadsRes, sessionsRes] = await Promise.all([
        supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('quiz_sessions')
          .select('*')
          .order('created_at', { ascending: false }),
      ]);

      if (leadsRes.error) throw leadsRes.error;
      if (sessionsRes.error) throw sessionsRes.error;

      setLeads(leadsRes.data || []);
      setQuizSessions(sessionsRes.data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to fetch leads');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...leads];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(lead => 
        lead.name.toLowerCase().includes(query) ||
        lead.mobile.includes(query) ||
        (lead.school && lead.school.toLowerCase().includes(query))
      );
    }

    // Source filter
    if (sourceFilter !== 'all') {
      filtered = filtered.filter(lead => lead.source_page === sourceFilter);
    }

    // Class filter
    if (classFilter !== 'all') {
      filtered = filtered.filter(lead => lead.class === classFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(lead => {
        const leadDate = new Date(lead.created_at);
        
        switch (dateFilter) {
          case 'today':
            return leadDate >= today;
          case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return leadDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return leadDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    setFilteredLeads(filtered);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Mobile', 'Class', 'School', 'Source', 'Quiz Topic', 'Quiz Score', 'Quiz Level', 'Interest', 'Date'];
    const csvContent = [
      headers.join(','),
      ...filteredLeads.map(lead => {
        const session = latestSessionByLeadId[lead.id];
        return [
          `"${lead.name}"`,
          lead.mobile,
          lead.class || '',
          `"${lead.school || ''}"`,
          lead.source_page,
          session?.topic ?? '',
          session?.score ?? '',
          session?.level ?? '',
          lead.interest_type || lead.career_interest || lead.product_interest || '',
          new Date(lead.created_at).toLocaleDateString(),
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `scope_express_leads_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported successfully!');
  };

  const uniqueSources = [...new Set(leads.map(l => l.source_page))];
  const uniqueClasses = [...new Set(leads.map(l => l.class).filter(Boolean))];

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
        {/* Stats Cards */}
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

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, mobile, school..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {uniqueSources.map(source => (
                    <SelectItem key={source} value={source}>{source}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {uniqueClasses.map(cls => (
                    <SelectItem key={cls} value={cls!}>Class {cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Leads Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">
              Leads ({filteredLeads.length})
            </CardTitle>
            <Button onClick={exportToCSV} variant="outline" size="sm">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading leads...</p>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No leads found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Mobile</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>School</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Quiz Topic</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Interest</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.map((lead) => {
                      const session = latestSessionByLeadId[lead.id];

                      return (
                        <TableRow key={lead.id}>
                          <TableCell className="font-medium">{lead.name}</TableCell>
                          <TableCell>
                            <a href={`tel:${lead.mobile}`} className="text-primary hover:underline">
                              {lead.mobile}
                            </a>
                          </TableCell>
                          <TableCell>{lead.class || '-'}</TableCell>
                          <TableCell className="max-w-[150px] truncate">{lead.school || '-'}</TableCell>
                          <TableCell>
                            <Badge 
                              className={`${sourceColors[lead.source_page] || 'bg-muted'} text-white`}
                            >
                              {lead.source_page}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {session?.topic || '-'}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {typeof session?.score === 'number' ? session.score : '-'}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {session?.level || '-'}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {lead.interest_type || lead.career_interest || lead.product_interest || '-'}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(lead.created_at).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
