
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Users, Trophy, Clock } from 'lucide-react';

const Dashboard = () => {
  // Mock data
  const upcomingEvents = [
    { id: 1, title: "Regional Championship", date: "2025-06-15", location: "City Aquatic Center" },
    { id: 2, title: "Team Time Trials", date: "2025-05-30", location: "Home Pool" },
    { id: 3, title: "Training Camp", date: "2025-07-10", location: "State University Pool" },
  ];

  const athleteHighlights = [
    { id: 1, name: "Alex Johnson", achievement: "New personal best in 100m freestyle", date: "2025-05-10" },
    { id: 2, name: "Sam Williams", achievement: "Qualified for nationals in butterfly", date: "2025-05-08" },
    { id: 3, name: "Jamie Parker", achievement: "Improved backstroke technique", date: "2025-05-05" },
  ];

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6 text-swimming-800">Coach Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Athletes" 
          value="24" 
          description="Active swimmers" 
          icon={<UserRound className="h-6 w-6 text-swimming-600" />} 
        />
        <StatCard 
          title="Groups" 
          value="4" 
          description="Training groups" 
          icon={<Users className="h-6 w-6 text-swimming-600" />} 
        />
        <StatCard 
          title="Events" 
          value="3" 
          description="Upcoming competitions" 
          icon={<Trophy className="h-6 w-6 text-swimming-600" />} 
        />
        <StatCard 
          title="Training Hours" 
          value="42" 
          description="This month" 
          icon={<Clock className="h-6 w-6 text-swimming-600" />} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="bg-swimming-50 border-b border-swimming-100">
            <CardTitle className="flex items-center text-swimming-800">
              <CalendarDays className="mr-2 h-5 w-5 text-swimming-600" />
              Upcoming Events
            </CardTitle>
            <CardDescription>Competitions and team activities</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="mb-4 last:mb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-swimming-800">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">{event.location}</p>
                  </div>
                  <span className="text-sm text-swimming-600 bg-swimming-50 px-2 py-1 rounded">
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="mt-2 border-b border-swimming-100 pb-2"></div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-swimming-50 border-b border-swimming-100">
            <CardTitle className="flex items-center text-swimming-800">
              <Trophy className="mr-2 h-5 w-5 text-swimming-600" />
              Athlete Highlights
            </CardTitle>
            <CardDescription>Recent achievements</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {athleteHighlights.map((highlight) => (
              <div key={highlight.id} className="mb-4 last:mb-0">
                <div className="flex flex-col">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-swimming-800">{highlight.name}</h3>
                    <span className="text-xs text-swimming-600">
                      {new Date(highlight.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{highlight.achievement}</p>
                </div>
                <div className="mt-2 border-b border-swimming-100 pb-2"></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

import { UserRound } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}

const StatCard = ({ title, value, description, icon }: StatCardProps) => (
  <Card className="border-swimming-100">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-swimming-700">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="bg-swimming-50 p-3 rounded-full">
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default Dashboard;
