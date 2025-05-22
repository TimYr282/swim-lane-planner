
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from '@/components/ui/button';
import { Users, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock groups data
const GROUPS = [
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

const GroupsList = () => {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-swimming-800">Training Groups</h1>
        <Button className="bg-swimming-600 hover:bg-swimming-700">
          <Users className="mr-2 h-4 w-4" /> Create Group
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {GROUPS.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
};

interface Group {
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
}

const GroupCard = ({ group }: GroupCardProps) => {
  const capacity = 25; // Assumed max capacity
  const fillPercentage = (group.memberCount / capacity) * 100;
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow border-l-4" style={{ borderLeftColor: `var(--${group.color})` }}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{group.name}</CardTitle>
          <Badge variant="outline" className="text-swimming-700 border-swimming-300">
            {group.ageRange} yrs
          </Badge>
        </div>
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
