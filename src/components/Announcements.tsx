import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const Announcements = async () => {
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const roleConditions = {
    teacher: { lessons: { some: { teacherId: userId! } } },
    student: { students: { some: { id: userId! } } },
    parent: { students: { some: { parentId: userId! } } },
  };

  const data = await prisma.announcement.findMany({
    take: 3,
    orderBy: { date: "desc" },
    where: {
      ...(role !== "admin" && {
        OR: [
          { classId: null },
          { class: roleConditions[role as keyof typeof roleConditions] || {} },
        ],
      }),
    },
  });

  const cardStyles = [
    "bg-dark-elevated/30 border-dark-border-secondary/30",
    "bg-dark-elevated/30 border-dark-border-secondary/30", 
    "bg-dark-elevated/30 border-dark-border-secondary/30"
  ];

  const gradientColors = [
    "from-brand-primary to-brand-secondary",
    "from-accent-emerald to-accent-teal",
    "from-accent-amber to-accent-orange"
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-accent-amber to-accent-orange rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-dark-text-primary">Announcements</h2>
            <p className="text-sm text-dark-text-secondary">Latest updates and news</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {data.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-accent-amber to-accent-orange rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="font-semibold text-dark-text-primary mb-1">No announcements yet</p>
            <p className="text-sm text-dark-text-secondary">Check back later for updates</p>
          </div>
        ) : (
          data.map((announcement, index) => (
            <div
              key={announcement.id}
              className={`group p-4 ${cardStyles[index]} hover:bg-dark-elevated/50 rounded-xl transition-all duration-200 border cursor-pointer`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 bg-gradient-to-r ${gradientColors[index]} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-dark-text-primary group-hover:text-brand-primary transition-colors duration-200 line-clamp-1">
                    {announcement.title}
                  </h3>
                  <p className="text-sm text-dark-text-secondary mt-1 line-clamp-2">
                    {announcement.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-dark-text-tertiary">
                      {new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric"
                      }).format(announcement.date)}
                    </span>
                    <div className="opacity-60 group-hover:opacity-100 transition-opacity duration-200">
                      <svg className="w-4 h-4 text-dark-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Announcements;
