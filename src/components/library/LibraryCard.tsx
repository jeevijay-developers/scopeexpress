import { 
  MapPin, Clock, Users, IndianRupee, Phone, ArrowRight,
  Snowflake, Wifi, MonitorSmartphone, BatteryCharging, Cctv, Coffee, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
}

interface LibraryCardProps {
  library: Library;
  onJoinClick: (library: Library) => void;
  language?: 'en' | 'hi';
}

const FACILITY_ICONS: Record<string, typeof Snowflake> = {
  ac: Snowflake,
  wifi: Wifi,
  desk: MonitorSmartphone,
  charging: BatteryCharging,
  cctv: Cctv,
  water: Coffee,
};

const FACILITY_LABELS: Record<string, { en: string; hi: string }> = {
  ac: { en: 'AC', hi: 'AC' },
  wifi: { en: 'WiFi', hi: 'WiFi' },
  desk: { en: 'Personal Desk', hi: 'पर्सनल डेस्क' },
  charging: { en: 'Power', hi: 'चार्जिंग' },
  cctv: { en: 'CCTV', hi: 'CCTV' },
  water: { en: 'Water/Tea', hi: 'पानी/चाय' },
};

const LibraryCard = ({ library, onJoinClick, language = 'en' }: LibraryCardProps) => {
  return (
    <Card className="overflow-hidden card-hover animate-fade-in">
      <div className="bg-gradient-primary p-4 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">{library.name}</h3>
            <div className="flex items-center gap-1 mt-1 text-white/90">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{library.city}, {library.state}</span>
            </div>
          </div>
          <Badge className="bg-white/20 text-white hover:bg-white/30">
            <Users className="h-3 w-3 mr-1" />
            {library.seats} {language === 'hi' ? 'सीटें' : 'Seats'}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-5 space-y-4">
        {/* Address */}
        <div className="text-sm text-muted-foreground">
          <p>{library.address}</p>
          {library.pin_code && <p>Pin: {library.pin_code}</p>}
        </div>

        {/* Timings */}
        <div className="flex items-center gap-2 text-sm">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium">{library.timings}</p>
            <p className="text-xs text-muted-foreground">
              {language === 'hi' ? 'खुलने का समय' : 'Opening Hours'}
            </p>
          </div>
        </div>

        {/* Facilities */}
        <div className="flex flex-wrap gap-2">
          {library.facilities.map((facilityId) => {
            const Icon = FACILITY_ICONS[facilityId];
            const label = FACILITY_LABELS[facilityId];
            if (!Icon || !label) return null;
            return (
              <div
                key={facilityId}
                className="flex items-center gap-1.5 bg-muted px-2.5 py-1.5 rounded-full text-xs"
              >
                <Icon className="h-3 w-3" />
                <span>{language === 'hi' ? label.hi : label.en}</span>
              </div>
            );
          })}
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <p className="text-xs text-muted-foreground">
              {language === 'hi' ? 'मासिक शुल्क' : 'Monthly Fee'}
            </p>
            <div className="flex items-center text-2xl font-bold text-primary">
              <IndianRupee className="h-5 w-5" />
              {library.price_per_month}
              <span className="text-sm text-muted-foreground font-normal ml-1">/month</span>
            </div>
          </div>
          <Button onClick={() => onJoinClick(library)} className="rounded-xl">
            {language === 'hi' ? 'Join करें' : 'Join Now'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Phone */}
        {library.phone && (
          <a 
            href={`tel:${library.phone}`}
            className="flex items-center justify-center gap-2 text-sm text-primary hover:underline"
          >
            <Phone className="h-4 w-4" />
            {library.phone}
          </a>
        )}
      </CardContent>
    </Card>
  );
};

export default LibraryCard;
