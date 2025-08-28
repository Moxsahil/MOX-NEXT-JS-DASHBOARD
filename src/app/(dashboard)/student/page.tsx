import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import BigCalendar from "@/components/BigCalender";
import EventCalendar from "@/components/EventCalendar";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const StudentPage = async () => {
  const { userId } = auth();

  const classItem = await prisma.class.findMany({
    where: {
      students: { some: { id: userId! } },
    },
  });

  const className = classItem[0]?.name || "4A";

  return (
    <div className="content-area">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark-text-primary">Student Dashboard</h1>
          <p className="text-dark-text-secondary mt-1">View your schedule, assignments, and announcements</p>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <div className="bg-dark-elevated/60 backdrop-blur-lg px-4 py-2 rounded-xl border border-dark-border-secondary/50 shadow-glow">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-brand-secondary to-brand-primary rounded-full"></div>
              <span className="text-sm font-medium text-dark-text-secondary">Class {className}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SECTION - Schedule */}
        <div className="lg:col-span-2">
          <div className="card-modern p-6 h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-brand-secondary to-brand-primary rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8a1 1 0 011-1h3zM9 5h6v2H9V5z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-dark-text-primary">Class Schedule</h2>
                <p className="text-sm text-dark-text-secondary">Your weekly class timetable - Class {className}</p>
              </div>
            </div>
            {classItem[0] && <BigCalendarContainer type="classId" id={classItem[0].id} />}
          </div>
        </div>
        
        {/* RIGHT SIDEBAR */}
        <div className="space-y-8">
          <div className="card-modern p-0 overflow-hidden">
            <div className="p-6">
              <EventCalendar />
            </div>
          </div>
          <div className="card-modern p-6">
            <Announcements />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
