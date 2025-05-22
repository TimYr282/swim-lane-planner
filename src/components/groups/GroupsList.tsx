import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from '@/components/ui/button';
import { Users, ChevronRight, Plus, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { GroupDialog, GroupFormValues } from './GroupDialog';
import DeleteGroupDialog from './DeleteGroupDialog';
import { toast } from "@/hooks/use-toast";

// Initial mock groups data
const INITIAL_GROUPS = [
  { 
    id: 1, 
    name: "Senior A", 
    description: "Elite swimmers training for national competitions",
    memberCount: 8,
    ageRange: "16-18",
    coachName: "Michael Wilson",
    sessions: ["Mon-Fri 6-8 AM", "Mon/Wed/Fri 4-6 PM"],
    color: "swimming-700"
  },
  { 
    id: 2, 
    name: "Junior A", 
    description: "Advanced junior swimmers preparing for regional competitions",
    memberCount: 12,
    ageRange: "13-15",
    coachName: "Sarah Johnson",
    sessions: ["Mon/Wed/Fri 4-6 PM", "Sat 9-11 AM"],
    color: "swimming-600"
  },
  { 
    id: 3, 
    name: "Junior B", 
    description: "Developing junior swimmers focusing on technique",
    memberCount: 15,
    ageRange: "11-13",
    coachName: "David Chen",
    sessions: ["Tue/Thu 4-6 PM", "Sat 11 AM-1 PM"],
    color: "swimming-500"
  },
  { 
    id: 4, 
    name: "Beginners", 
    description: "New swimmers learning fundamentals",
    memberCount: 20,
    ageRange: "8-12",
    coachName: "David Chen",
    sessions: ["Mon/Wed 4-5 PM", "Sat 8-9 AM"],
    color: "swimming-400"
  },
];

const STORAGE_KEY = 'swimming-app-groups';

export interface Group {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  ageRange: string;
  coachName: string;
  sessions: string[];
  color: string;
}

interface GroupCardProps {
  group: Group;
  onEdit: (group: Group) => void;
  onDelete: (group: Group) => void;
}

const GroupsList = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);

  // Load groups from localStorage on initial render
  useEffect(() => {
    const savedGroups = localStorage.getItem(STORAGE_KEY);
    if (savedGroups) {
      setGroups(JSON.parse(savedGroups));
    } else {
      setGroups(INITIAL_GROUPS);
    }
  }, []);
  
  // Save groups to localStorage whenever they change
  useEffect(() => {
    if (groups.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
    }
  }, [groups]);

  // Generate a new ID for a group
  const getNewId = () => {
    return Math.max(0, ...groups.map(group => group.id)) + 1;
  };

  // Color scheme based on group position
  const getGroupColor = (index: number) => {
    const colors = ["swimming-700", "swimming-600", "swimming-500", "swimming-400"];
    return colors[index % colors.length];
  };

  // Handle creating a new group
  const handleCreateGroup = (values: GroupFormValues) => {
    const newGroup: Group = {
      id: getNewId(),
      name: values.name,
      description: values.description,
      memberCount: 0, // New groups start with 0 members
      ageRange: values.ageRange,
      coachName: values.coachName,
      sessions: values.sessions.split('\n').filter(s => s.trim() !== ''),
      color: getGroupColor(groups.length)
    };
    
    setGroups([...groups, newGroup]);
    toast({
      title: "Group Created",
      description: `${newGroup.name} has been successfully created.`
    });
  };

  // Handle editing a group
  const handleEditGroup = (values: GroupFormValues) => {
    if (!currentGroup) return;
    
    setGroups(groups.map(group => 
      group.id === currentGroup.id 
        ? {
            ...group,
            name: values.name,
            description: values.description,
            ageRange: values.ageRange,
            coachName: values.coachName,
            sessions: values.sessions.split('\n').filter(s => s.trim() !== '')
          }
        : group
    ));
    
    toast({
      title: "Group Updated",
      description: `${values.name} has been successfully updated.`
    });
  };

  // Handle deleting a group
  const handleDeleteGroup = () => {
    if (!currentGroup) return;
    
    setGroups(groups.filter(group => group.id !== currentGroup.id));
    setDeleteDialogOpen(false);
    
    toast({
      title: "Group Deleted",
      description: `${currentGroup.name} has been removed.`,
      variant: "destructive"
    });
  };

  // Start the edit process for a group
  const startEdit = (group: Group) => {
    setCurrentGroup(group);
    setEditDialogOpen(true);
  };

  // Start the delete process for a group
  const startDelete = (group: Group) => {
    setCurrentGroup(group);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-swimming-800">Training Groups</h1>
        <Button 
          className="bg-swimming-600 hover:bg-swimming-700"
          onClick={() => setCreateDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Create Group
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {groups.map((group) => (
          <GroupCard 
            key={group.id} 
            group={group} 
            onEdit={startEdit} 
            onDelete={startDelete}
          />
        ))}
      </div>
      
      {/* Create Group Dialog */}
      <GroupDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateGroup}
        title="Create New Group"
      />
      
      {/* Edit Group Dialog */}
      {currentGroup && (
        <GroupDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSubmit={handleEditGroup}
          defaultValues={{
            name: currentGroup.name,
            description: currentGroup.description,
            ageRange: currentGroup.ageRange,
            coachName: currentGroup.coachName,
            sessions: currentGroup.sessions.join('\n')
          }}
          title="Edit Group"
        />
      )}
      
      {/* Delete Confirmation Dialog */}
      {currentGroup && (
        <DeleteGroupDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteGroup}
          groupName={currentGroup.name}
        />
      )}
    </div>
  );
};

const GroupCard = ({ group, onEdit, onDelete }: GroupCardProps) => {
  const capacity = 25; // Assumed max capacity
  const fillPercentage = (group.memberCount / capacity) * 100;
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow border-l-4" style={{ borderLeftColor: `var(--${group.color})` }}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{group.name}</CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0" 
              onClick={() => onEdit(group)}
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive" 
              onClick={() => onDelete(group)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
        <Badge variant="outline" className="text-swimming-700 border-swimming-300 w-fit">
          {group.ageRange} yrs
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{group.description}</p>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Members</span>
          <span className="text-sm text-muted-foreground">{group.memberCount}/{capacity}</span>
        </div>
        <Progress 
          value={fillPercentage} 
          className={`h-2 mb-4 bg-gray-200 [&>div]:bg-${group.color}`} 
        />
        
        <div className="mb-4">
          <p className="text-sm font-medium">Coach</p>
          <p className="text-swimming-700">{group.coachName}</p>
        </div>
        
        <div className="mb-4">
          <p className="text-sm font-medium">Sessions</p>
          <ul className="list-disc list-inside text-sm text-muted-foreground">
            {group.sessions.map((session, index) => (
              <li key={index}>{session}</li>
            ))}
          </ul>
        </div>
        
        <Button variant="outline" size="sm" className="w-full mt-2 flex justify-between items-center">
          <span>View Group Details</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default GroupsList;
