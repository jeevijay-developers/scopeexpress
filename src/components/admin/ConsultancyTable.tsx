import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { toast } from 'sonner';
import { Briefcase, GraduationCap, MessageSquare } from 'lucide-react';

interface Submission {
  id: string;
  category: string;
  full_name: string;
  mobile: string;
  email: string | null;
  data: Record<string, any>;
  created_at: string;
}

const categoryMeta: Record<string, { label: string; icon: any }> = {
  job: { label: 'Job', icon: Briefcase },
  admission: { label: 'Admission', icon: GraduationCap },
  other: { label: 'Other', icon: MessageSquare },
};

const ConsultancyTable = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('job');

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('consultancy_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        toast.error('Failed to load consultancy submissions');
      } else {
        setSubmissions((data || []) as Submission[]);
      }
      setLoading(false);
    })();
  }, []);

  const filtered = submissions.filter((s) => s.category === tab);

  const renderDataCell = (data: Record<string, any>) => (
    <div className="space-y-1 text-xs">
      {Object.entries(data || {}).map(([k, v]) =>
        v ? (
          <div key={k}>
            <span className="font-medium capitalize">{k.replace(/_/g, ' ')}:</span>{' '}
            <span className="text-muted-foreground">{String(v)}</span>
          </div>
        ) : null
      )}
    </div>
  );

  return (
    <Card className="p-4">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4">
          {Object.entries(categoryMeta).map(([key, meta]) => {
            const count = submissions.filter((s) => s.category === key).length;
            const Icon = meta.icon;
            return (
              <TabsTrigger key={key} value={key} className="gap-2">
                <Icon className="h-4 w-4" />
                {meta.label}
                <Badge variant="secondary" className="ml-1">{count}</Badge>
              </TabsTrigger>
            );
          })}
        </TabsList>
        {Object.keys(categoryMeta).map((key) => (
          <TabsContent key={key} value={key}>
            {loading ? (
              <p className="text-muted-foreground p-6 text-center">Loading...</p>
            ) : filtered.length === 0 ? (
              <p className="text-muted-foreground p-6 text-center">No {categoryMeta[key].label.toLowerCase()} queries yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="text-xs whitespace-nowrap">
                          {new Date(s.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-medium">{s.full_name}</TableCell>
                        <TableCell>{s.mobile}</TableCell>
                        <TableCell>{s.email || '-'}</TableCell>
                        <TableCell>{renderDataCell(s.data)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
};

export default ConsultancyTable;
