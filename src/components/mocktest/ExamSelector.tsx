import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Shield, Train, Building2, GraduationCap, Briefcase, BookOpen, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface ExamSelectorProps {
  onSelectExam: (examName: string) => void;
}

const examCategories = [
  { name: 'SSC CGL', icon: Building2, color: 'bg-primary' },
  { name: 'SSC CHSL', icon: Building2, color: 'bg-primary' },
  { name: 'SSC MTS', icon: Building2, color: 'bg-primary' },
  { name: 'SSC GD Constable', icon: Shield, color: 'bg-primary' },
  { name: 'Army GD', icon: Shield, color: 'bg-destructive' },
  { name: 'Army Clerk', icon: Shield, color: 'bg-destructive' },
  { name: 'Navy AA/SSR', icon: Shield, color: 'bg-destructive' },
  { name: 'Air Force X/Y Group', icon: Shield, color: 'bg-destructive' },
  { name: 'MPPSC', icon: GraduationCap, color: 'bg-secondary' },
  { name: 'UPPSC', icon: GraduationCap, color: 'bg-secondary' },
  { name: 'Railway Group D', icon: Train, color: 'bg-accent' },
  { name: 'Railway NTPC', icon: Train, color: 'bg-accent' },
  { name: 'Patwari', icon: Briefcase, color: 'bg-secondary' },
  { name: 'Police Constable', icon: Shield, color: 'bg-accent' },
  { name: 'Bank PO/Clerk', icon: Building2, color: 'bg-primary' },
  { name: 'CTET/TET', icon: BookOpen, color: 'bg-secondary' },
];

const ExamSelector = ({ onSelectExam }: ExamSelectorProps) => {
  const [search, setSearch] = useState('');

  const { data: testCounts } = useQuery({
    queryKey: ['mock-test-counts'],
    queryFn: async () => {
      const { data } = await supabase
        .from('mock_tests')
        .select('exam_name')
        .eq('is_active', true);
      const counts: Record<string, number> = {};
      data?.forEach(t => {
        counts[t.exam_name] = (counts[t.exam_name] || 0) + 1;
      });
      return counts;
    },
  });

  // Merge hardcoded categories with any additional exams found in the database
  const knownNames = new Set(examCategories.map(e => e.name));
  const extraExams = Object.keys(testCounts || {})
    .filter(name => !knownNames.has(name))
    .map(name => ({ name, icon: BookOpen, color: 'bg-primary' }));
  const allExams = [...examCategories, ...extraExams];

  const filtered = allExams.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search exams..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filtered.map(exam => {
          const count = testCounts?.[exam.name] || 0;
          return (
            <Card
              key={exam.name}
              onClick={() => onSelectExam(exam.name)}
              className="p-4 cursor-pointer card-hover text-center space-y-3 group"
            >
              <div className={`w-12 h-12 mx-auto rounded-xl ${exam.color} text-primary-foreground flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <exam.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-sm">{exam.name}</h3>
              <Badge variant="secondary" className="text-xs">
                {count} {count === 1 ? 'Test' : 'Tests'}
              </Badge>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-8">No exams found matching "{search}"</p>
      )}
    </div>
  );
};

export default ExamSelector;
