import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { User, Search, Plus, Filter, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import AthleteDialog, { Athlete } from './AthleteDialog';
import DeleteAthleteDialog from './DeleteAthleteDialog';

// Mock data
const INITIAL_ATHLETES = [
  { id: 1, name: "Alex Johnson", age: 16, group: "Senior A", specialties: ["Freestyle", "Butterfly"], image: "/placeholder.svg" },
  { id: 2, name: "Sam Williams", age: 14, group: "Junior A", specialties: ["Butterfly", "IM"], image: "/placeholder.svg" },
  { id: 3, name: "Jamie Parker", age: 17, group: "Senior A", specialties: ["Backstroke", "Freestyle"], image: "/placeholder.svg" },
  { id: 4, name: "Taylor Smith", age: 13, group: "Junior B", specialties: ["Breaststroke"], image: "/placeholder.svg" },
  { id: 5, name: "Casey Brown", age: 15, group: "Junior A", specialties: ["Freestyle", "Distance"], image: "/placeholder.svg" },
  { id: 6, name: "Jordan Lee", age: 18, group: "Senior A", specialties: ["Sprint", "Backstroke"], image: "/placeholder.svg" },
];

const STORAGE_KEY = 'swimming-app-athletes';

const AthletesList = () => {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentAthlete, setCurrentAthlete] = useState<Athlete | undefined>(undefined);
  
  // Load athletes from localStorage on initial render
  useEffect(() => {
    const savedAthletes = localStorage.getItem(STORAGE_KEY);
    if (savedAthletes) {
      setAthletes(JSON.parse(savedAthletes));
    } else {
      setAthletes(INITIAL_ATHLETES);
    }
  }, []);
  
  // Save athletes to localStorage whenever they change
  useEffect(() => {
    if (athletes.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(athletes));
    }
  }, [athletes]);
  
  const filteredAthletes = athletes.filter(athlete => 
    athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    athlete.group.toLowerCase().includes(searchTerm.toLowerCase()) ||
    athlete.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddClick = () => {
    setCurrentAthlete(undefined);
    setDialogOpen(true);
  };

  const handleEditClick = (athlete: Athlete) => {
    setCurrentAthlete(athlete);
    setDialogOpen(true);
  };

  const handleDeleteClick = (athlete: Athlete) => {
    setCurrentAthlete(athlete);
    setDeleteDialogOpen(true);
  };

  const handleSaveAthlete = (data: Partial<Athlete>) => {
    if (data.id) {
      // Update existing athlete
      setAthletes(prevAthletes => 
        prevAthletes.map(a => a.id === data.id ? { ...a, ...data } as Athlete : a)
      );
      toast({
        title: "Athlete Updated",
        description: `${data.name} was successfully updated.`
      });
    } else {
      // Add new athlete
      const newAthlete = {
        ...data,
        id: Math.max(0, ...athletes.map(a => a.id)) + 1,
      } as Athlete;
      
      setAthletes(prevAthletes => [...prevAthletes, newAthlete]);
      toast({
        title: "Athlete Added",
        description: `${data.name} was added successfully.`
      });
    }
  };

  const handleDeleteAthlete = () => {
    if (currentAthlete) {
      setAthletes(prevAthletes => 
        prevAthletes.filter(a => a.id !== currentAthlete.id)
      );
      toast({
        title: "Athlete Deleted",
        description: `${currentAthlete.name} was removed successfully.`,
        variant: "destructive"
      });
    }
    setDeleteDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold text-swimming-800">Athletes</h1>
        <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search athletes..."
              className="pl-8 w-full md:w-[240px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="bg-swimming-600 hover:bg-swimming-700" onClick={handleAddClick}>
            <Plus className="mr-2 h-4 w-4" /> Add Athlete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAthletes.map((athlete) => (
          <AthleteCard 
            key={athlete.id} 
            athlete={athlete} 
            onEdit={() => handleEditClick(athlete)}
            onDelete={() => handleDeleteClick(athlete)}
          />
        ))}
      </div>

      {filteredAthletes.length === 0 && (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No athletes found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}
      
      <AthleteDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        athlete={currentAthlete} 
        onSave={handleSaveAthlete} 
      />
      
      <DeleteAthleteDialog 
        open={deleteDialogOpen} 
        onOpenChange={setDeleteDialogOpen} 
        onConfirm={handleDeleteAthlete} 
        athleteName={currentAthlete?.name || ''} 
      />
    </div>
  );
};

interface AthleteCardProps {
  athlete: Athlete;
  onEdit: () => void;
  onDelete: () => void;
}

const AthleteCard = ({ athlete, onEdit, onDelete }: AthleteCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-40 bg-swimming-100 flex items-center justify-center overflow-hidden">
        <img 
          src={athlete.image} 
          alt={athlete.name} 
          className="w-full h-full object-cover" 
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle>{athlete.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground">Age: {athlete.age}</p>
            <p className="text-sm text-muted-foreground">Group: {athlete.group}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onDelete} className="text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {athlete.specialties.map((specialty, index) => (
            <Badge key={index} className="bg-swimming-100 hover:bg-swimming-200 text-swimming-800">{specialty}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AthletesList;
