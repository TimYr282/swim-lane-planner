
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { UserRound, Mail, Phone, Plus, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CoachDialog, CoachFormValues } from './CoachDialog';
import DeleteCoachDialog from './DeleteCoachDialog';
import { toast } from "@/hooks/use-toast";

// Initial mock coaches data
const INITIAL_COACHES = [
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
  onEdit: (coach: Coach) => void;
  onDelete: (coach: Coach) => void;
}

const CoachesList = () => {
  const [coaches, setCoaches] = useState<Coach[]>(INITIAL_COACHES);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentCoach, setCurrentCoach] = useState<Coach | null>(null);

  // Generate a new ID for a coach
  const getNewId = () => {
    return Math.max(0, ...coaches.map(coach => coach.id)) + 1;
  };

  // Handle creating a new coach
  const handleCreateCoach = (values: CoachFormValues) => {
    const newCoach: Coach = {
      id: getNewId(),
      name: values.name,
      position: values.position,
      specialties: values.specialties.split(',').map(s => s.trim()),
      email: values.email,
      phone: values.phone,
      image: "/placeholder.svg" // Default image
    };
    
    setCoaches([...coaches, newCoach]);
    toast({
      title: "Coach Added",
      description: `${newCoach.name} has been added to the coaching staff.`
    });
  };

  // Handle editing a coach
  const handleEditCoach = (values: CoachFormValues) => {
    if (!currentCoach) return;
    
    setCoaches(coaches.map(coach => 
      coach.id === currentCoach.id 
        ? {
            ...coach,
            name: values.name,
            position: values.position,
            specialties: values.specialties.split(',').map(s => s.trim()),
            email: values.email,
            phone: values.phone
          }
        : coach
    ));
    
    toast({
      title: "Coach Updated",
      description: `${values.name}'s information has been updated.`
    });
  };

  // Handle deleting a coach
  const handleDeleteCoach = () => {
    if (!currentCoach) return;
    
    setCoaches(coaches.filter(coach => coach.id !== currentCoach.id));
    setDeleteDialogOpen(false);
    
    toast({
      title: "Coach Removed",
      description: `${currentCoach.name} has been removed from the coaching staff.`,
      variant: "destructive"
    });
  };

  // Start the edit process for a coach
  const startEdit = (coach: Coach) => {
    setCurrentCoach(coach);
    setEditDialogOpen(true);
  };

  // Start the delete process for a coach
  const startDelete = (coach: Coach) => {
    setCurrentCoach(coach);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-swimming-800">Coaches</h1>
        <Button 
          className="bg-swimming-600 hover:bg-swimming-700"
          onClick={() => setCreateDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Coach
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coaches.map((coach) => (
          <CoachCard 
            key={coach.id} 
            coach={coach} 
            onEdit={startEdit} 
            onDelete={startDelete}
          />
        ))}
      </div>
      
      {/* Create Coach Dialog */}
      <CoachDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateCoach}
        title="Add New Coach"
      />
      
      {/* Edit Coach Dialog */}
      {currentCoach && (
        <CoachDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSubmit={handleEditCoach}
          defaultValues={{
            name: currentCoach.name,
            position: currentCoach.position,
            specialties: currentCoach.specialties.join(', '),
            email: currentCoach.email,
            phone: currentCoach.phone
          }}
          title="Edit Coach"
        />
      )}
      
      {/* Delete Confirmation Dialog */}
      {currentCoach && (
        <DeleteCoachDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteCoach}
          coachName={currentCoach.name}
        />
      )}
    </div>
  );
};

const CoachCard = ({ coach, onEdit, onDelete }: CoachCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex justify-between p-4">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-swimming-100">
          <img 
            src={coach.image} 
            alt={coach.name} 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="flex flex-col space-y-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={() => onEdit(coach)}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive" 
            onClick={() => onDelete(coach)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
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
