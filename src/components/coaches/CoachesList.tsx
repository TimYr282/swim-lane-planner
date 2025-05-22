
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { UserRound, Mail, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock coaches data
const COACHES = [
  { 
    id: 1, 
    name: "Michael Wilson", 
    position: "Head Coach", 
    specialties: ["Sprint", "Technique"], 
    email: "michael@swimcoach.com",
    phone: "555-123-4567",
    image: "/placeholder.svg" 
  },
  { 
    id: 2, 
    name: "Sarah Johnson", 
    position: "Assistant Coach", 
    specialties: ["Distance", "Strength"], 
    email: "sarah@swimcoach.com",
    phone: "555-234-5678",
    image: "/placeholder.svg" 
  },
  { 
    id: 3, 
    name: "David Chen", 
    position: "Junior Coach", 
    specialties: ["Technique", "Junior Development"], 
    email: "david@swimcoach.com",
    phone: "555-345-6789",
    image: "/placeholder.svg" 
  },
];

const CoachesList = () => {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-swimming-800">Coaches</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COACHES.map((coach) => (
          <CoachCard key={coach.id} coach={coach} />
        ))}
      </div>
    </div>
  );
};

interface Coach {
  id: number;
  name: string;
  position: string;
  specialties: string[];
  email: string;
  phone: string;
  image: string;
}

interface CoachCardProps {
  coach: Coach;
}

const CoachCard = ({ coach }: CoachCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex justify-center pt-6">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-swimming-100">
          <img 
            src={coach.image} 
            alt={coach.name} 
            className="w-full h-full object-cover" 
          />
        </div>
      </div>
      <CardHeader className="text-center">
        <CardTitle>{coach.name}</CardTitle>
        <p className="text-swimming-600 font-medium">{coach.position}</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-3 mb-4">
          <a href={`mailto:${coach.email}`} className="flex items-center text-sm hover:text-swimming-700 transition-colors">
            <Mail className="h-4 w-4 mr-2 text-swimming-500" />
            {coach.email}
          </a>
          <a href={`tel:${coach.phone}`} className="flex items-center text-sm hover:text-swimming-700 transition-colors">
            <Phone className="h-4 w-4 mr-2 text-swimming-500" />
            {coach.phone}
          </a>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {coach.specialties.map((specialty, index) => (
            <Badge key={index} className="bg-swimming-100 hover:bg-swimming-200 text-swimming-800">
              {specialty}
            </Badge>
          ))}
        </div>
        
        <Button variant="outline" size="sm" className="w-full mt-2">
          <UserRound className="mr-1 h-4 w-4" /> View Profile
        </Button>
      </CardContent>
    </Card>
  );
};

export default CoachesList;
