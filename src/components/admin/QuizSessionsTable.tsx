import { useState, useMemo } from 'react';
import { Gamepad2, Filter, Search, FileSpreadsheet, CheckCircle, XCircle } from 'lucide-react';
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

interface QuizSessionsTableProps {
  quizSessions: QuizSession[];
  leads: Lead[];
  isLoading: boolean;
}

const topicColors: Record<string, string> = {
  'maths': 'bg-primary',
  'science': 'bg-success',
  'gk': 'bg-secondary',
  'reasoning': 'bg-accent',
  'history': 'bg-warning',
};

const QuizSessionsTable = ({ quizSessions, leads, isLoading }: QuizSessionsTableProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [topicFilter, setTopicFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [completedFilter, setCompletedFilter] = useState('all');

  const leadsMap = useMemo(() => {
    const map: Record<string, Lead> = {};
    for (const lead of leads) {
      map[lead.id] = lead;
    }
    return map;
  }, [leads]);

  const filteredSessions = useMemo(() => {
    let filtered = [...quizSessions];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(session => {
        const lead = session.lead_id ? leadsMap[session.lead_id] : null;
        return lead && (
          lead.name.toLowerCase().includes(query) ||
          lead.mobile.includes(query)
        );
      });
    }

    if (topicFilter !== 'all') {
      filtered = filtered.filter(s => s.topic === topicFilter);
    }

    if (levelFilter !== 'all') {
      filtered = filtered.filter(s => s.level === levelFilter);
    }

    if (completedFilter !== 'all') {
      filtered = filtered.filter(s => 
        completedFilter === 'completed' ? s.completed : !s.completed
      );
    }

    return filtered;
  }, [quizSessions, searchQuery, topicFilter, levelFilter, completedFilter, leadsMap]);

  const uniqueTopics = [...new Set(quizSessions.map(s => s.topic))];
  const uniqueLevels = [...new Set(quizSessions.map(s => s.level).filter(Boolean))];

  const exportToCSV = () => {
    const headers = ['Student Name', 'Mobile', 'Class', 'Topic', 'Level', 'Score', 'Correct', 'Attempted', 'Completed', 'Date'];
    const csvContent = [
      headers.join(','),
      ...filteredSessions.map(session => {
        const lead = session.lead_id ? leadsMap[session.lead_id] : null;
        return [
          `"${lead?.name || 'Unknown'}"`,
          lead?.mobile || '',
          lead?.class || '',
          session.topic,
          session.level || '',
          session.score ?? '',
          session.correct_answers ?? '',
          session.questions_attempted ?? '',
          session.completed ? 'Yes' : 'No',
          new Date(session.created_at).toLocaleDateString(),
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quiz_sessions_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Quiz sessions exported!');
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
                placeholder="Search by student name, mobile..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={topicFilter} onValueChange={setTopicFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                {uniqueTopics.map(topic => (
                  <SelectItem key={topic} value={topic}>{topic.charAt(0).toUpperCase() + topic.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {uniqueLevels.map(level => (
                  <SelectItem key={level} value={level!}>Level {level}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={completedFilter} onValueChange={setCompletedFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="incomplete">Incomplete</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">
            Quiz Sessions ({filteredSessions.length})
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
              <p className="text-muted-foreground">Loading sessions...</p>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="text-center py-12">
              <Gamepad2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No quiz sessions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Topic</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Correct/Attempted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSessions.map((session) => {
                    const lead = session.lead_id ? leadsMap[session.lead_id] : null;
                    return (
                      <TableRow key={session.id}>
                        <TableCell className="font-medium">{lead?.name || 'Unknown'}</TableCell>
                        <TableCell>
                          {lead?.mobile ? (
                            <a href={`tel:${lead.mobile}`} className="text-primary hover:underline">
                              {lead.mobile}
                            </a>
                          ) : '-'}
                        </TableCell>
                        <TableCell>{lead?.class || '-'}</TableCell>
                        <TableCell>
                          <Badge className={`${topicColors[session.topic] || 'bg-muted'} text-white`}>
                            {session.topic.charAt(0).toUpperCase() + session.topic.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {session.level ? (
                            <Badge variant="outline">Level {session.level}</Badge>
                          ) : '-'}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {typeof session.score === 'number' ? session.score : '-'}
                        </TableCell>
                        <TableCell>
                          {session.correct_answers !== null && session.questions_attempted !== null 
                            ? `${session.correct_answers}/${session.questions_attempted}`
                            : '-'
                          }
                        </TableCell>
                        <TableCell>
                          {session.completed ? (
                            <Badge className="bg-success text-white">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <XCircle className="h-3 w-3 mr-1" />
                              In Progress
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(session.created_at).toLocaleDateString('en-IN', {
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

export default QuizSessionsTable;
