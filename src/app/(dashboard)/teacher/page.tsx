import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import { auth } from "@clerk/nextjs/server";

const TeacherPage = () => {
  const { userId } = auth();
  return (
    <div className="content-area">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark-text-primary">Teacher Dashboard</h1>
          <p className="text-dark-text-secondary mt-1">Manage your classes and view your schedule</p>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <div className="bg-dark-elevated/60 backdrop-blur-lg px-4 py-2 rounded-xl border border-dark-border-secondary/50 shadow-glow">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-accent-emerald to-accent-teal rounded-full"></div>
              <span className="text-sm font-medium text-dark-text-secondary">Teacher Portal</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SECTION - Schedule */}
        <div className="lg:col-span-2">
          <div className="card-modern p-6 h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-accent-emerald to-accent-teal rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8a1 1 0 011-1h3zM9 5h6v2H9V5z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-dark-text-primary">My Schedule</h2>
                <p className="text-sm text-dark-text-secondary">View and manage your teaching schedule</p>
              </div>
            </div>
            <BigCalendarContainer type="teacherId" id={userId!} />
          </div>
        </div>
        
        {/* RIGHT SIDEBAR */}
        <div className="space-y-8">
          <div className="card-modern p-6">
            <Announcements />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherPage;
