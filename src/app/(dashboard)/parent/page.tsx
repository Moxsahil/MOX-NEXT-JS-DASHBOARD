import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const ParentPage = async () => {
  const { userId } = auth();
  const currentUserId = userId;
  
  const students = await prisma.student.findMany({
    where: {
      parentId: currentUserId!,
    },
  });

  return (
    <div className="content-area">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark-text-primary">Parent Dashboard</h1>
          <p className="text-dark-text-secondary mt-1">Monitor your children's academic progress and schedules</p>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <div className="bg-dark-elevated/60 backdrop-blur-lg px-4 py-2 rounded-xl border border-dark-border-secondary/50 shadow-glow">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-accent-amber to-accent-orange rounded-full"></div>
              <span className="text-sm font-medium text-dark-text-secondary">{students.length} Child{students.length !== 1 ? 'ren' : ''}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SECTION - Children's Schedules */}
        <div className="lg:col-span-2 space-y-8">
          {students.length === 0 ? (
            <div className="card-modern p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-accent-amber to-accent-orange rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-dark-text-primary mb-2">No Children Found</h3>
              <p className="text-dark-text-secondary">No student records are linked to your account yet.</p>
            </div>
          ) : (
            students.map((student, index) => (
              <div className="card-modern p-6" key={student.id}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${index % 2 === 0 ? 'bg-gradient-to-r from-accent-amber to-accent-orange' : 'bg-gradient-to-r from-brand-secondary to-brand-primary'}`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8a1 1 0 011-1h3zM9 5h6v2H9V5z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-dark-text-primary">
                      {student.name} {student.surname}'s Schedule
                    </h2>
                    <p className="text-sm text-dark-text-secondary">Weekly class schedule and activities</p>
                  </div>
                </div>
                <BigCalendarContainer type="classId" id={student.classId} />
              </div>
            ))
          )}
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

export default ParentPage;
