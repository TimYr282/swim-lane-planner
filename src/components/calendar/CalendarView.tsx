
import React from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users } from 'lucide-react';

// Mock events data
const EVENTS = [
  { 
    id: 1, 
    title: "Regional Championship",
    date: new Date(2025, 5, 15), // June 15, 2025
    startTime: "09:00",
    endTime: "17:00",
    location: "City Aquatic Center",
    type: "competition",
    groups: ["Senior A", "Junior A"]
  },
  { 
    id: 2, 
    title: "Team Time Trials",
    date: new Date(2025, 4, 30), // May 30, 2025
    startTime: "15:00",
    endTime: "19:00",
    location: "Home Pool",
    type: "competition",
    groups: ["All Groups"]
  },
  { 
    id: 3, 
    title: "Training Camp",
    date: new Date(2025, 6, 10), // July 10, 2025
    startTime: "08:00",
    endTime: "16:00",
    location: "State University Pool",
    type: "training",
    groups: ["Senior A"]
  },
  { 
    id: 4, 
    title: "Team Meeting",
    date: new Date(2025, 4, 25), // May 25, 2025
    startTime: "18:00",
    endTime: "19:30",
    location: "Clubhouse",
    type: "meeting",
    groups: ["Coaches", "Parents"]
  },
];

const CalendarView = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(today);
  
  // Get events for selected date
  const eventsForSelectedDate = selectedDate 
    ? EVENTS.filter(event => 
        event.date.getDate() === selectedDate.getDate() &&
        event.date.getMonth() === selectedDate.getMonth() &&
        event.date.getFullYear() === selectedDate.getFullYear()
      )
    : [];

  // Get date that have events
  const eventDates = EVENTS.map(event => {
    const date = new Date(event.date);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  });

  const getEventTypeColor = (type: string) => {
    switch(type) {
      case "competition": return "bg-red-100 text-red-800";
      case "training": return "bg-green-100 text-green-800";
      case "meeting": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6 text-swimming-800">Calendar</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-swimming-800">Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                event: (date) => 
                  eventDates.some(eventDate => 
                    eventDate.getDate() === date.getDate() &&
                    eventDate.getMonth() === date.getMonth() &&
                    eventDate.getFullYear() === date.getFullYear()
                  )
              }}
              modifiersClassNames={{
                event: "bg-swimming-100 text-swimming-800 font-medium"
              }}
            />
            <div className="mt-4 flex justify-center">
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-swimming-100 rounded-full mr-2"></div>
                  <span>Events</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-swimming-800">
              {selectedDate ? (
                <>Events for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</>
              ) : (
                <>Select a date to view events</>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="competition">Competition</TabsTrigger>
                <TabsTrigger value="training">Training</TabsTrigger>
                <TabsTrigger value="meeting">Meetings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                {eventsForSelectedDate.length > 0 ? (
                  eventsForSelectedDate.map(event => (
                    <EventCard key={event.id} event={event} getEventTypeColor={getEventTypeColor} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No events scheduled for this date</p>
                  </div>
                )}
              </TabsContent>
              
              {["competition", "training", "meeting"].map(eventType => (
                <TabsContent key={eventType} value={eventType} className="space-y-4">
                  {eventsForSelectedDate.filter(e => e.type === eventType).length > 0 ? (
                    eventsForSelectedDate
                      .filter(e => e.type === eventType)
                      .map(event => (
                        <EventCard key={event.id} event={event} getEventTypeColor={getEventTypeColor} />
                      ))
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No {eventType}s scheduled for this date</p>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface Event {
  id: number;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  type: string;
  groups: string[];
}

interface EventCardProps {
  event: Event;
  getEventTypeColor: (type: string) => string;
}

const EventCard = ({ event, getEventTypeColor }: EventCardProps) => {
  return (
    <div className="border rounded-lg p-4 hover:border-swimming-300 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-swimming-800">{event.title}</h3>
        <Badge className={getEventTypeColor(event.type)}>
          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
        </Badge>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center text-muted-foreground">
          <Clock className="h-4 w-4 mr-2" />
          <span>{event.startTime} - {event.endTime}</span>
        </div>
        
        <div className="flex items-center text-muted-foreground">
          <MapPin className="h-4 w-4 mr-2" />
          <span>{event.location}</span>
        </div>
        
        <div className="flex items-center text-muted-foreground">
          <Users className="h-4 w-4 mr-2" />
          <span>{event.groups.join(", ")}</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
