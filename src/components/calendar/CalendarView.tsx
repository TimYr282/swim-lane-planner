
import React, { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, PlusCircle, Edit, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import CompetitionDialog, { Competition } from './CompetitionDialog';
import ParticipationFormDialog, { ParticipationForm } from './ParticipationFormDialog';

// Define event types
interface BaseEvent {
  id: number;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  type: string;
  groups: string[];
}

interface TrainingEvent extends BaseEvent {
  type: "training";
}

interface MeetingEvent extends BaseEvent {
  type: "meeting";
}

interface CompetitionEvent extends BaseEvent {
  type: "competition";
  notes?: string;
}

type Event = TrainingEvent | MeetingEvent | CompetitionEvent;

// Mock events data
const INITIAL_EVENTS: Event[] = [
  { 
    id: 1, 
    title: "Regional Championship",
    date: new Date(2025, 5, 15), // June 15, 2025
    startTime: "09:00",
    endTime: "17:00",
    location: "City Aquatic Center",
    type: "competition",
    notes: "Important competition for qualifying",
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

// Storage keys
const EVENTS_STORAGE_KEY = 'swimming-app-events';
const PARTICIPATION_STORAGE_KEY = 'swimming-app-participation-forms';

const CalendarView = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(today);
  const [events, setEvents] = useState<Event[]>([]);
  const [participationForms, setParticipationForms] = useState<ParticipationForm[]>([]);
  const [competitionDialogOpen, setCompetitionDialogOpen] = useState(false);
  const [participationDialogOpen, setParticipationDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Competition | undefined>(undefined);
  const [currentCompetitionId, setCurrentCompetitionId] = useState<number>(0);
  const [currentCompetitionTitle, setCurrentCompetitionTitle] = useState<string>('');
  const [activeTab, setActiveTab] = useState("all");

  // Load events from localStorage on initial render
  useEffect(() => {
    const savedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (savedEvents) {
      // Convert date strings back to Date objects
      const parsedEvents = JSON.parse(savedEvents).map((event: any) => ({
        ...event,
        date: new Date(event.date)
      }));
      setEvents(parsedEvents);
    } else {
      setEvents(INITIAL_EVENTS);
    }
    
    const savedForms = localStorage.getItem(PARTICIPATION_STORAGE_KEY);
    if (savedForms) {
      setParticipationForms(JSON.parse(savedForms));
    }
  }, []);
  
  // Save events to localStorage whenever they change
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
    }
  }, [events]);
  
  // Save participation forms to localStorage whenever they change
  useEffect(() => {
    if (participationForms.length > 0) {
      localStorage.setItem(PARTICIPATION_STORAGE_KEY, JSON.stringify(participationForms));
    }
  }, [participationForms]);
  
  // Get events for selected date
  const eventsForSelectedDate = selectedDate 
    ? events.filter(event => 
        event.date.getDate() === selectedDate.getDate() &&
        event.date.getMonth() === selectedDate.getMonth() &&
        event.date.getFullYear() === selectedDate.getFullYear()
      )
    : [];

  // Get dates that have events
  const eventDates = events.map(event => {
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
  
  const handleAddCompetition = () => {
    setCurrentEvent(undefined);
    setCompetitionDialogOpen(true);
  };
  
  const handleEditCompetition = (competition: Competition) => {
    setCurrentEvent(competition);
    setCompetitionDialogOpen(true);
  };
  
  const handleSaveCompetition = (competition: Competition) => {
    const isEditing = events.some(e => e.id === competition.id);
    
    if (isEditing) {
      setEvents(events.map(event => 
        event.id === competition.id ? competition : event
      ));
      toast({
        title: "Competition Updated",
        description: `"${competition.title}" has been updated.`,
      });
    } else {
      setEvents([...events, competition]);
      toast({
        title: "Competition Added",
        description: `"${competition.title}" has been added to the calendar.`,
      });
    }
  };
  
  const openParticipationForm = (competition: Competition) => {
    setCurrentCompetitionId(competition.id);
    setCurrentCompetitionTitle(competition.title);
    setParticipationDialogOpen(true);
  };
  
  const handleSubmitParticipationForm = (form: ParticipationForm) => {
    setParticipationForms([...participationForms, form]);
  };

  const getSubmittedFormCount = (competitionId: number) => {
    return participationForms.filter(form => form.competitionId === competitionId).length;
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-swimming-800">Calendar</h1>
        <Button 
          onClick={handleAddCompetition}
          className="bg-swimming-600 hover:bg-swimming-700"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Competition
        </Button>
      </div>
      
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
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="competition">Competition</TabsTrigger>
                <TabsTrigger value="training">Training</TabsTrigger>
                <TabsTrigger value="meeting">Meetings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                {eventsForSelectedDate.length > 0 ? (
                  eventsForSelectedDate.map(event => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      getEventTypeColor={getEventTypeColor} 
                      onEdit={event.type === "competition" ? () => handleEditCompetition(event as Competition) : undefined}
                      onParticipate={event.type === "competition" ? () => openParticipationForm(event as Competition) : undefined}
                      submittedForms={event.type === "competition" ? getSubmittedFormCount(event.id) : 0}
                    />
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
                        <EventCard 
                          key={event.id} 
                          event={event} 
                          getEventTypeColor={getEventTypeColor} 
                          onEdit={event.type === "competition" ? () => handleEditCompetition(event as Competition) : undefined}
                          onParticipate={event.type === "competition" ? () => openParticipationForm(event as Competition) : undefined}
                          submittedForms={event.type === "competition" ? getSubmittedFormCount(event.id) : 0}
                        />
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
      
      <CompetitionDialog
        open={competitionDialogOpen}
        onOpenChange={setCompetitionDialogOpen}
        onSave={handleSaveCompetition}
        competition={currentEvent}
      />
      
      <ParticipationFormDialog
        open={participationDialogOpen}
        onOpenChange={setParticipationDialogOpen}
        onSubmit={handleSubmitParticipationForm}
        competitionId={currentCompetitionId}
        competitionTitle={currentCompetitionTitle}
      />
    </div>
  );
};

interface EventCardProps {
  event: Event;
  getEventTypeColor: (type: string) => string;
  onEdit?: () => void;
  onParticipate?: () => void;
  submittedForms?: number;
}

const EventCard = ({ event, getEventTypeColor, onEdit, onParticipate, submittedForms = 0 }: EventCardProps) => {
  const isCompetition = event.type === "competition";
  
  return (
    <div className="border rounded-lg p-4 hover:border-swimming-300 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-swimming-800">{event.title}</h3>
        <Badge className={getEventTypeColor(event.type)}>
          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
        </Badge>
      </div>
      
      <div className="space-y-2 text-sm mb-4">
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
        
        {isCompetition && (event as CompetitionEvent).notes && (
          <div className="mt-2 text-sm text-muted-foreground">
            <p><strong>Notes:</strong> {(event as CompetitionEvent).notes}</p>
          </div>
        )}
      </div>
      
      {isCompetition && (
        <div className="flex justify-between items-center mt-4 pt-3 border-t">
          <div className="flex space-x-2">
            {onEdit && (
              <Button size="sm" variant="outline" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
            )}
          </div>
          
          {onParticipate && (
            <div className="flex items-center">
              {submittedForms > 0 && (
                <span className="text-xs text-muted-foreground mr-2">
                  {submittedForms} responses
                </span>
              )}
              <Button size="sm" onClick={onParticipate}>
                <FileText className="h-4 w-4 mr-1" /> Participate
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarView;
