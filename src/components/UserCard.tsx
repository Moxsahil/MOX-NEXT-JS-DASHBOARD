import prisma from "@/lib/prisma";

const UserCard = async ({
  type,
}: {
  type: "admin" | "teacher" | "student" | "parent";
}) => {
  const modelMap: Record<typeof type, any> = {
    admin: prisma.admin,
    teacher: prisma.teacher,
    student: prisma.student,
    parent: prisma.parent,
  };

  const data = await modelMap[type].count();

  const cardConfig = {
    admin: {
      gradient: "from-brand-primary to-brand-secondary",
      icon: <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>,
      bgGradient: "from-brand-primary/10 to-brand-secondary/10",
      color: "text-brand-primary"
    },
    teacher: {
      gradient: "from-accent-emerald to-accent-teal",
      icon: <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>,
      bgGradient: "from-accent-emerald/10 to-accent-teal/10",
      color: "text-accent-emerald"
    },
    student: {
      gradient: "from-brand-secondary to-brand-primary",
      icon: <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>,
      bgGradient: "from-brand-secondary/10 to-brand-primary/10",
      color: "text-brand-secondary"
    },
    parent: {
      gradient: "from-accent-amber to-accent-orange",
      icon: <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>,
      bgGradient: "from-accent-amber/10 to-accent-orange/10",
      color: "text-accent-amber"
    }
  };

  const config = cardConfig[type];

  return (
    <div className="card-modern p-6 hover:shadow-glow transition-all duration-300 group overflow-hidden">
      {/* Background decoration */}
      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${config.gradient} opacity-5 rounded-full -mr-10 -mt-10`}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 bg-gradient-to-r ${config.gradient} rounded-2xl flex items-center justify-center shadow-glow`}>
            {config.icon}
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-dark-elevated/30 text-dark-text-secondary">
              <div className={`w-2 h-2 ${config.gradient} bg-gradient-to-r rounded-full`}></div>
              2024/25
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div>
            <h3 className="text-sm font-medium text-dark-text-secondary capitalize">{type}s</h3>
            <p className="text-2xl font-bold text-dark-text-primary tabular-nums">
              {data.toLocaleString()}
            </p>
          </div>
          
          {/* Progress indicator */}
          <div className="h-1 bg-dark-elevated/30 rounded-full overflow-hidden">
            <div className={`h-full bg-gradient-to-r ${config.gradient} rounded-full transition-all duration-1000`} style={{width: '75%'}}></div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <span className={`text-xs font-medium ${config.color}`}>Active</span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-status-success-bg text-status-success-text">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 14l3-3 3 3m0-8l-3 3-3-3" />
              </svg>
              +5%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
