import Image from "next/image";
import EventCalendar from "./EventCalendar";
import EventList from "./EventList";

const EventCalendarContainer = async ({
  searchParams,
}: {
  searchParams: { [keys: string]: string | undefined };
}) => {
  const { date } = searchParams;
  return (
    <div className="space-y-6">
      {/* CALENDAR SECTION */}
      <div className="bg-dark-elevated/30 backdrop-blur-sm border border-dark-border-secondary/30 rounded-xl p-4">
        <EventCalendar />
      </div>
      
      {/* EVENTS HEADER */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center shadow-lg">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8a1 1 0 011-1h3zM9 5h6v2H9V5z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-dark-text-primary">Upcoming Events</h2>
          <p className="text-sm text-dark-text-secondary">
            {date ? `Events for ${new Date(date).toLocaleDateString()}` : 'Today\'s events'}
          </p>
        </div>
      </div>
      
      {/* EVENTS LIST */}
      <div className="space-y-3">
        <EventList dateParam={date} />
      </div>
    </div>
  );
};

export default EventCalendarContainer;
