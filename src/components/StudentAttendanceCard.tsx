import prisma from "@/lib/prisma";

const StudentAttendanceCard = async ({ id }: { id: string }) => {
  const attendance = await prisma.attendance.findMany({
    where: {
      studentId: id,
      date: {
        gte: new Date(new Date().getFullYear(), 0, 1),
      },
    },
  });

  const totalDays = attendance.length;
  const presentDays = attendance.filter((day) => day.present).length;
  const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
  
  // Determine performance level and colors
  const getPerformanceConfig = (percentage: number) => {
    if (percentage >= 95) return {
      level: 'Excellent',
      gradient: 'from-brand-success to-accent-emerald',
      icon: <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>,
      color: 'text-brand-success'
    };
    if (percentage >= 85) return {
      level: 'Good',
      gradient: 'from-accent-teal to-brand-primary',
      icon: <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>,
      color: 'text-accent-teal'
    };
    if (percentage >= 75) return {
      level: 'Fair',
      gradient: 'from-accent-amber to-accent-orange',
      icon: <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>,
      color: 'text-accent-amber'
    };
    return {
      level: 'Needs Attention',
      gradient: 'from-accent-red to-accent-rose',
      icon: <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>,
      color: 'text-accent-red'
    };
  };

  const config = getPerformanceConfig(percentage);

  return (
    <div className="card-modern p-6 hover:shadow-glow transition-all duration-300 overflow-hidden">
      {/* Background decoration */}
      <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${config.gradient} opacity-5 rounded-full -mr-8 -mt-8`}></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-8 h-8 bg-gradient-to-r ${config.gradient} rounded-lg flex items-center justify-center`}>
            {config.icon}
          </div>
          <h3 className="text-sm font-semibold text-dark-text-secondary">Attendance Rate</h3>
        </div>
        
        {/* Main Stats */}
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <h1 className="text-4xl font-bold text-dark-text-primary tabular-nums">
              {percentage}
            </h1>
            <span className="text-xl font-semibold text-dark-text-secondary">%</span>
          </div>
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 bg-dark-elevated/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <div className={`w-2 h-2 ${config.gradient} bg-gradient-to-r rounded-full`}></div>
            <span className={`text-xs font-semibold ${config.color}`}>
              {config.level}
            </span>
          </div>
          
          {/* Additional Stats */}
          <div className="pt-2 space-y-1">
            <div className="flex justify-between text-xs text-dark-text-secondary">
              <span>Present Days</span>
              <span className="font-semibold tabular-nums">{presentDays}</span>
            </div>
            <div className="flex justify-between text-xs text-dark-text-secondary">
              <span>Total Days</span>
              <span className="font-semibold tabular-nums">{totalDays}</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="h-2 bg-dark-elevated/30 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${config.gradient} rounded-full transition-all duration-500 ease-out`}
              style={{width: `${percentage}%`}}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendanceCard;
