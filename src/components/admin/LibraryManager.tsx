import { useState, useEffect, useMemo } from 'react';
import { BookOpen, Users, Calendar, Search, Filter, MapPin, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface Lead {
  id: string;
  name: string;
  mobile: string;
  class: string | null;
  school: string | null;
  source_page: string;
  interest_type: string | null;
  preferred_timing: string | null;
  message: string | null;
  created_at: string;
  city: string | null;
  library_id: string | null;
}

interface LibraryInfo {
  id: string;
  name: string;
}

interface LibraryManagerProps {
  leads: Lead[];
  isLoading: boolean;
}

// Library membership types
const MEMBERSHIP_TYPES = [
  { value: 'monthly', label: 'Monthly', duration: '1 Month', price: '₹500' },
  { value: 'quarterly', label: 'Quarterly', duration: '3 Months', price: '₹1,200' },
  { value: 'halfyearly', label: 'Half Yearly', duration: '6 Months', price: '₹2,000' },
  { value: 'yearly', label: 'Yearly', duration: '12 Months', price: '₹3,500' },
];

const LibraryManager = ({ leads, isLoading }: LibraryManagerProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [librariesMap, setLibrariesMap] = useState<Record<string, string>>({});

  // Fetch libraries to map library_id -> name
  useEffect(() => {
    const fetchLibraries = async () => {
      const { data } = await supabase.from('libraries').select('id, name');
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((lib) => { map[lib.id] = lib.name; });
        setLibrariesMap(map);
      }
    };
    fetchLibraries();
  }, []);

  // Filter leads that came from Library page
  const libraryLeads = useMemo(() => {
    return leads.filter(l => l.source_page === 'Library');
  }, [leads]);

  const filteredLeads = useMemo(() => {
    let filtered = [...libraryLeads];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(lead => 
        lead.name.toLowerCase().includes(query) ||
        lead.mobile.includes(query) ||
        (lead.city && lead.city.toLowerCase().includes(query)) ||
        (lead.school && lead.school.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [libraryLeads, searchQuery]);

  // Stats
  const stats = useMemo(() => ({
    total: libraryLeads.length,
    thisMonth: libraryLeads.filter(l => {
      const date = new Date(l.created_at);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length,
    thisWeek: libraryLeads.filter(l => {
      const date = new Date(l.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date >= weekAgo;
    }).length,
  }), [libraryLeads]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Enquiries</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">{stats.thisMonth}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold">{stats.thisWeek}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-primary text-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-white/80">Membership Plans</p>
                <p className="text-2xl font-bold">{MEMBERSHIP_TYPES.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Membership Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Membership Plans</CardTitle>
          <CardDescription>Available library membership options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {MEMBERSHIP_TYPES.map(plan => (
              <div key={plan.value} className="border rounded-lg p-4 text-center">
                <h4 className="font-semibold">{plan.label}</h4>
                <p className="text-sm text-muted-foreground">{plan.duration}</p>
                <p className="text-lg font-bold text-primary mt-2">{plan.price}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Library Enquiries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, mobile, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Enquiries ({filteredLeads.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No library enquiries found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Library</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Interest</TableHead>
                    <TableHead>Preferred Timing</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>
                        <a href={`tel:${lead.mobile}`} className="text-primary hover:underline">
                          {lead.mobile}
                        </a>
                      </TableCell>
                      <TableCell>
                        {lead.city ? (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span>{lead.city}</span>
                          </div>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        {lead.library_id && librariesMap[lead.library_id] ? (
                          <div className="flex items-center gap-1">
                            <Building2 className="h-3 w-3 text-muted-foreground" />
                            <span className="max-w-[150px] truncate">{librariesMap[lead.library_id]}</span>
                          </div>
                        ) : '-'}
                      </TableCell>
                      <TableCell>{lead.class || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{lead.interest_type || 'Membership'}</Badge>
                      </TableCell>
                      <TableCell>{lead.preferred_timing || '-'}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(lead.created_at).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LibraryManager;