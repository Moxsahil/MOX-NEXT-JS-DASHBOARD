import prisma from "@/lib/prisma";

const EventList = async ({ dateParam }: { dateParam: string | undefined }) => {
  const date = dateParam ? new Date(dateParam) : new Date();

  const data = await prisma.event.findMany({
    where: {
      startTime: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lte: new Date(date.setHours(23, 59, 59, 999)),
      },
    },
    orderBy: {
      startTime: 'asc'
    }
  });

  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8a1 1 0 011-1h3zM9 5h6v2H9V5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-dark-text-primary mb-2">No Events Scheduled</h3>
        <p className="text-sm text-dark-text-secondary">
          {dateParam ? 'No events found for the selected date.' : 'No events scheduled for today.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((event, index) => {
        // Alternate color schemes
        const isEven = index % 2 === 0;
        const colorConfig = isEven 
          ? {
              gradient: 'from-brand-primary to-brand-secondary',
              icon: <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
            }
          : {
              gradient: 'from-accent-emerald to-accent-teal',
              icon: <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
            };

        return (
          <div
            key={event.id}
            className="group p-4 bg-dark-elevated/30 hover:bg-dark-elevated/50 rounded-xl transition-all duration-200 border border-dark-border-secondary/50"
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 bg-gradient-to-r ${colorConfig.gradient} rounded-lg flex items-center justify-center flex-shrink-0`}>
                {colorConfig.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-dark-text-primary group-hover:text-brand-primary transition-colors duration-200">
                  {event.title}
                </h3>
                {event.description && (
                  <p className="text-sm text-dark-text-secondary mt-1">
                    {event.description}
                  </p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-dark-text-tertiary">
                    {event.startTime.toLocaleDateString("en-UK", { 
                      day: "2-digit", 
                      month: "short" 
                    })}
                  </span>
                  <span className="text-xs font-medium text-dark-text-secondary">
                    {event.startTime.toLocaleTimeString("en-UK", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EventList;
