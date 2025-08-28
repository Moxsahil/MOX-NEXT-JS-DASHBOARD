import Announcements from "@/components/Announcements";
import AttendanceChartContainer from "@/components/AttendanceChartContainer";
import CountChartContainer from "@/components/CountChartContainer";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import FinanceChart from "@/components/FinanceChart";
import UserCard from "@/components/UserCard";

const AdminPage = ({
  searchParams,
}: {
  searchParams: { [keys: string]: string | undefined };
}) => {
  return (
    <div className="content-area">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark-text-primary">Admin Dashboard</h1>
          <p className="text-dark-text-secondary mt-1">Welcome back! Here's what's happening at your school today.</p>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <div className="bg-dark-elevated/60 backdrop-blur-lg px-4 py-2 rounded-xl border border-dark-border-secondary/50 shadow-glow">
            <span className="text-sm font-medium text-dark-text-secondary">Academic Year</span>
            <div className="text-lg font-bold text-brand-primary">2024/25</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
        {/* USER CARDS */}
        <UserCard type="admin" />
        <UserCard type="teacher" />
        <UserCard type="student" />
        <UserCard type="parent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SECTION */}
        <div className="lg:col-span-2 space-y-8">
          {/* ANALYTICS SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* COUNT CHART */}
            <div className="card-modern p-6 lg:col-span-1">
              <CountChartContainer />
            </div>
            
            {/* ATTENDANCE CHART */}
            <div className="card-modern p-6 lg:col-span-2">
              <AttendanceChartContainer />
            </div>
          </div>

          {/* FINANCE SECTION */}
          <div className="card-modern p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-brand-success to-accent-emerald rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-dark-text-primary">Financial Overview</h2>
                  <p className="text-sm text-dark-text-secondary">Revenue and expense tracking</p>
                </div>
              </div>
            </div>
            <FinanceChart />
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-8">
          <div className="card-modern p-0 overflow-hidden">
            <EventCalendarContainer searchParams={searchParams} />
          </div>
          <div className="card-modern p-6">
            <Announcements />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
