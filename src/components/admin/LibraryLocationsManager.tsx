import { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, Plus, Edit2, Trash2, Search, Building2, 
  Clock, Users, IndianRupee, Power, PowerOff, Save,
  Snowflake, Wifi, MonitorSmartphone, BatteryCharging, Cctv, Coffee
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { indianCities, getStateFromCity, type City } from '@/data/indianCities';

interface Library {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  pin_code: string | null;
  phone: string | null;
  facilities: string[];
  timings: string;
  seats: number;
  price_per_month: number;
  is_active: boolean;
  created_at: string;
}

const FACILITY_OPTIONS = [
  { id: 'ac', label: 'Air Conditioning', icon: Snowflake },
  { id: 'wifi', label: 'High-Speed WiFi', icon: Wifi },
  { id: 'desk', label: 'Personal Desk', icon: MonitorSmartphone },
  { id: 'charging', label: 'Power Points', icon: BatteryCharging },
  { id: 'cctv', label: '24/7 CCTV', icon: Cctv },
  { id: 'water', label: 'Water & Tea', icon: Coffee },
];

const DEFAULT_LIBRARY: Omit<Library, 'id' | 'created_at'> = {
  name: '',
  city: '',
  state: '',
  address: '',
  pin_code: '',
  phone: '',
  facilities: ['ac', 'wifi', 'desk', 'charging', 'cctv'],
  timings: '6:00 AM - 10:00 PM',
  seats: 50,
  price_per_month: 600,
  is_active: true,
};

const LibraryLocationsManager = () => {
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLibrary, setEditingLibrary] = useState<Library | null>(null);
  const [formData, setFormData] = useState<Omit<Library, 'id' | 'created_at'>>(DEFAULT_LIBRARY);
  const [citySearchOpen, setCitySearchOpen] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchLibraries();
  }, []);

  const fetchLibraries = async () => {
    try {
      const { data, error } = await supabase
        .from('libraries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Parse facilities from JSONB
      const parsedData = (data || []).map(lib => ({
        ...lib,
        facilities: Array.isArray(lib.facilities) ? (lib.facilities as string[]) : [],
      }));

      setLibraries(parsedData);
    } catch (error) {
      console.error('Error fetching libraries:', error);
      toast.error('Failed to fetch libraries');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLibraries = useMemo(() => {
    if (!searchQuery) return libraries;
    const query = searchQuery.toLowerCase();
    return libraries.filter(lib =>
      lib.name.toLowerCase().includes(query) ||
      lib.city.toLowerCase().includes(query) ||
      lib.state.toLowerCase().includes(query)
    );
  }, [libraries, searchQuery]);

  const filteredCities = useMemo(() => {
    if (!citySearch || citySearch.length < 2) return [];
    const query = citySearch.toLowerCase();
    return indianCities
      .filter(city => city.name.toLowerCase().includes(query))
      .slice(0, 10);
  }, [citySearch]);

  const handleCitySelect = (city: City) => {
    setFormData(prev => ({
      ...prev,
      city: city.name,
      state: city.state,
    }));
    setCitySearchOpen(false);
    setCitySearch('');
  };

  const handleFacilityToggle = (facilityId: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facilityId)
        ? prev.facilities.filter(f => f !== facilityId)
        : [...prev.facilities, facilityId],
    }));
  };

  const handleOpenDialog = (library?: Library) => {
    if (library) {
      setEditingLibrary(library);
      setFormData({
        name: library.name,
        city: library.city,
        state: library.state,
        address: library.address,
        pin_code: library.pin_code || '',
        phone: library.phone || '',
        facilities: library.facilities,
        timings: library.timings,
        seats: library.seats,
        price_per_month: library.price_per_month,
        is_active: library.is_active,
      });
    } else {
      setEditingLibrary(null);
      setFormData(DEFAULT_LIBRARY);
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.city || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      const libraryData = {
        name: formData.name,
        city: formData.city,
        state: formData.state || getStateFromCity(formData.city) || '',
        address: formData.address,
        pin_code: formData.pin_code || null,
        phone: formData.phone || null,
        facilities: formData.facilities,
        timings: formData.timings,
        seats: formData.seats,
        price_per_month: formData.price_per_month,
        is_active: formData.is_active,
      };

      if (editingLibrary) {
        const { error } = await supabase
          .from('libraries')
          .update(libraryData)
          .eq('id', editingLibrary.id);

        if (error) throw error;
        toast.success('Library updated successfully');
      } else {
        const { error } = await supabase
          .from('libraries')
          .insert(libraryData);

        if (error) throw error;
        toast.success('Library added successfully');
      }

      setDialogOpen(false);
      fetchLibraries();
    } catch (error) {
      console.error('Error saving library:', error);
      toast.error('Failed to save library');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('libraries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Library deleted successfully');
      fetchLibraries();
    } catch (error) {
      console.error('Error deleting library:', error);
      toast.error('Failed to delete library');
    }
  };

  const handleToggleActive = async (library: Library) => {
    try {
      const { error } = await supabase
        .from('libraries')
        .update({ is_active: !library.is_active })
        .eq('id', library.id);

      if (error) throw error;
      toast.success(library.is_active ? 'Library deactivated' : 'Library activated');
      fetchLibraries();
    } catch (error) {
      console.error('Error toggling library status:', error);
      toast.error('Failed to update library status');
    }
  };

  const stats = useMemo(() => ({
    total: libraries.length,
    active: libraries.filter(l => l.is_active).length,
    totalSeats: libraries.reduce((sum, l) => sum + l.seats, 0),
    cities: new Set(libraries.map(l => l.city)).size,
  }), [libraries]);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Libraries</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success rounded-xl flex items-center justify-center">
                <Power className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Seats</p>
                <p className="text-2xl font-bold">{stats.totalSeats}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cities</p>
                <p className="text-2xl font-bold">{stats.cities}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Library Locations
              </CardTitle>
              <CardDescription>Manage library branches across cities</CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Library
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingLibrary ? 'Edit Library' : 'Add New Library'}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Library Name *</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Scope Express - Kota"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>City *</Label>
                      <Popover open={citySearchOpen} onOpenChange={setCitySearchOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            {formData.city || 'Select city...'}
                            <MapPin className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <Command>
                            <CommandInput
                              placeholder="Search city..."
                              value={citySearch}
                              onValueChange={setCitySearch}
                            />
                            <CommandList>
                              <CommandEmpty>No city found. Type to search...</CommandEmpty>
                              <CommandGroup>
                                {filteredCities.map((city) => (
                                  <CommandItem
                                    key={`${city.name}-${city.state}`}
                                    value={city.name}
                                    onSelect={() => handleCitySelect(city)}
                                  >
                                    <MapPin className="mr-2 h-4 w-4" />
                                    {city.name}
                                    <span className="ml-auto text-xs text-muted-foreground">
                                      {city.state}
                                    </span>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        placeholder="Auto-filled from city"
                        value={formData.state}
                        onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pin_code">Pin Code</Label>
                      <Input
                        id="pin_code"
                        placeholder="e.g., 485776"
                        value={formData.pin_code || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, pin_code: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Full Address *</Label>
                    <Textarea
                      id="address"
                      placeholder="Enter complete address..."
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="+91 XXXXX XXXXX"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timings">Opening Hours</Label>
                      <Input
                        id="timings"
                        placeholder="e.g., 6:00 AM - 10:00 PM"
                        value={formData.timings}
                        onChange={(e) => setFormData(prev => ({ ...prev, timings: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="seats">Number of Seats</Label>
                      <Input
                        id="seats"
                        type="number"
                        min="1"
                        value={formData.seats}
                        onChange={(e) => setFormData(prev => ({ ...prev, seats: parseInt(e.target.value) || 50 }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Price per Month (₹)</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        value={formData.price_per_month}
                        onChange={(e) => setFormData(prev => ({ ...prev, price_per_month: parseInt(e.target.value) || 600 }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Facilities</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {FACILITY_OPTIONS.map((facility) => (
                        <div
                          key={facility.id}
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                            formData.facilities.includes(facility.id)
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => handleFacilityToggle(facility.id)}
                        >
                          <Checkbox
                            checked={formData.facilities.includes(facility.id)}
                            onCheckedChange={() => handleFacilityToggle(facility.id)}
                          />
                          <facility.icon className="h-4 w-4" />
                          <span className="text-sm">{facility.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="space-y-0.5">
                      <Label>Active Status</Label>
                      <p className="text-sm text-muted-foreground">
                        Library will be visible to users if active
                      </p>
                    </div>
                    <Switch
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {editingLibrary ? 'Update' : 'Add'} Library
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-md mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, city, or state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading libraries...</p>
            </div>
          ) : filteredLibraries.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No libraries found</p>
              <Button className="mt-4" onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Library
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Library</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Seats</TableHead>
                    <TableHead>Price/Month</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLibraries.map((library) => (
                    <TableRow key={library.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{library.name}</p>
                          <p className="text-xs text-muted-foreground">{library.timings}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p>{library.city}</p>
                            <p className="text-xs text-muted-foreground">{library.state}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {library.seats}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 font-semibold text-primary">
                          <IndianRupee className="h-4 w-4" />
                          {library.price_per_month}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={library.is_active ? 'default' : 'secondary'}
                          className="cursor-pointer"
                          onClick={() => handleToggleActive(library)}
                        >
                          {library.is_active ? (
                            <>
                              <Power className="h-3 w-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <PowerOff className="h-3 w-3 mr-1" />
                              Inactive
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(library)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Library?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete "{library.name}". This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(library.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
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

export default LibraryLocationsManager;
