import { useState, useMemo, useEffect } from 'react';
import { Users, Filter, Search, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

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
  completed: boolean | null;
  created_at: string;
}

interface LeadsTableProps {
  leads: Lead[];
  quizSessions: QuizSession[];
  isLoading: boolean;
  sourceFilter?: string;
}

const sourceColors: Record<string, string> = {
  'Free Practice': 'bg-accent',
  'Career Guidance': 'bg-secondary',
  'Library': 'bg-primary',
  'Stationery': 'bg-success',
  'Contact': 'bg-warning',
};

const LeadsTable = ({ leads, quizSessions, isLoading, sourceFilter: initialSourceFilter }: LeadsTableProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState(initialSourceFilter || 'all');
  const [classFilter, setClassFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    if (initialSourceFilter) {
      setSourceFilter(initialSourceFilter);
    }
  }, [initialSourceFilter]);

  const latestSessionByLeadId = useMemo(() => {
    const map: Record<string, QuizSession> = {};
    for (const session of quizSessions) {
      if (!session.lead_id) continue;
      const existing = map[session.lead_id];
      if (!existing || new Date(session.created_at).getTime() > new Date(existing.created_at).getTime()) {
        map[session.lead_id] = session;
      }
    }
    return map;
  }, [quizSessions]);

  const filteredLeads = useMemo(() => {
    let filtered = [...leads];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(lead => 
        lead.name.toLowerCase().includes(query) ||
        lead.mobile.includes(query) ||
        (lead.school && lead.school.toLowerCase().includes(query))
      );
    }

    if (sourceFilter !== 'all') {
      filtered = filtered.filter(lead => lead.source_page === sourceFilter);
    }

    if (classFilter !== 'all') {
      filtered = filtered.filter(lead => lead.class === classFilter);
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(lead => {
        const leadDate = new Date(lead.created_at);
        switch (dateFilter) {
          case 'today': return leadDate >= today;
          case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return leadDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return leadDate >= monthAgo;
          default: return true;
        }
      });
    }

    return filtered;
  }, [leads, searchQuery, sourceFilter, classFilter, dateFilter]);

  const uniqueSources = [...new Set(leads.map(l => l.source_page))];
  const uniqueClasses = [...new Set(leads.map(l => l.class).filter(Boolean))];

  const exportToCSV = () => {
    const headers = ['Name', 'Mobile', 'Class', 'School', 'Source', 'Quiz Topic', 'Quiz Score', 'Quiz Level', 'Interest', 'Message', 'Date'];
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
          `"${lead.message || ''}"`,
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

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
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

      {/* Table */}
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
                    <TableHead>Interest</TableHead>
                    <TableHead>Message</TableHead>
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
                          <Badge className={`${sourceColors[lead.source_page] || 'bg-muted'} text-white`}>
                            {lead.source_page}
                          </Badge>
                        </TableCell>
                        <TableCell>{session?.topic || '-'}</TableCell>
                        <TableCell>{typeof session?.score === 'number' ? session.score : '-'}</TableCell>
                        <TableCell className="text-sm">
                          {lead.interest_type || lead.career_interest || lead.product_interest || '-'}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate text-sm">
                          {lead.message || '-'}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(lead.created_at).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
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
    </div>
  );
};

export default LeadsTable;
