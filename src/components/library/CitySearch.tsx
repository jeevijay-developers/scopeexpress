import { useState, useMemo } from 'react';
import { MapPin, Search, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { indianCities, type City } from '@/data/indianCities';

interface CitySearchProps {
  onCitySelect: (city: City) => void;
  selectedCity?: string;
  language?: 'en' | 'hi';
}

const POPULAR_CITIES = ['Amarpatan', 'Kota', 'Jabalpur', 'Delhi', 'Jaipur', 'Lucknow', 'Bhopal', 'Indore'];

const CitySearch = ({ onCitySelect, selectedCity, language = 'en' }: CitySearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCities = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    const query = searchQuery.toLowerCase();
    return indianCities
      .filter(city => city.name.toLowerCase().includes(query))
      .slice(0, 15);
  }, [searchQuery]);

  const popularCitiesData = useMemo(() => {
    return POPULAR_CITIES.map(name => 
      indianCities.find(c => c.name === name)
    ).filter((city): city is City => city !== undefined);
  }, []);

  const handleSelect = (city: City) => {
    onCitySelect(city);
    setSearchQuery('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            {language === 'hi' ? 'अपना शहर खोजें' : 'Find Your City'}
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          {language === 'hi' ? '📍 अपने शहर की Library खोजें' : '📍 Find Library in Your City'}
        </h2>
        <p className="text-muted-foreground">
          {language === 'hi' 
            ? 'नीचे अपने शहर का नाम टाइप करें'
            : 'Type your city name below to find libraries near you'}
        </p>
      </div>

      <div className="bg-card rounded-2xl shadow-xl border p-2">
        <Command className="rounded-xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <CommandInput
              placeholder={language === 'hi' ? 'शहर का नाम टाइप करें...' : 'Type city name...'}
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="h-14 text-lg pl-12"
            />
          </div>
          <CommandList className="max-h-[300px]">
            {searchQuery.length >= 2 && (
              <>
                <CommandEmpty className="py-6 text-center">
                  <MapPin className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p>
                    {language === 'hi' 
                      ? 'कोई शहर नहीं मिला'
                      : 'No city found'}
                  </p>
                </CommandEmpty>
                <CommandGroup heading={language === 'hi' ? 'खोज परिणाम' : 'Search Results'}>
                  {filteredCities.map((city) => (
                    <CommandItem
                      key={`${city.name}-${city.state}`}
                      value={city.name}
                      onSelect={() => handleSelect(city)}
                      className="py-3 px-4 cursor-pointer"
                    >
                      <MapPin className="mr-3 h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium">{city.name}</p>
                        <p className="text-sm text-muted-foreground">{city.state}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </div>

      {/* Popular Cities */}
      <div className="mt-8">
        <p className="text-center text-sm text-muted-foreground mb-4">
          {language === 'hi' ? '🔥 लोकप्रिय शहर' : '🔥 Popular Cities'}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {popularCitiesData.map((city) => (
            <Button
              key={city.name}
              variant={selectedCity === city.name ? 'default' : 'outline'}
              size="sm"
              className="rounded-full"
              onClick={() => handleSelect(city)}
            >
              <MapPin className="h-3 w-3 mr-1" />
              {city.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CitySearch;
