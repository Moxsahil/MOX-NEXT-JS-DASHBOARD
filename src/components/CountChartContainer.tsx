import CountChart from "./CountChart";
import prisma from "@/lib/prisma";

const CountChartContainer = async () => {
  const data = await prisma.student.groupBy({
    by: ["sex"],
    _count: true,
  });

  const boys = data.find((d) => d.sex === "MALE")?._count || 0;
  const girls = data.find((d) => d.sex === "FEMALE")?._count || 0;
  const total = boys + girls;

  return (
    <div className="h-full flex flex-col">
      {/* CHART AREA */}
      <div className="flex-1">
        <CountChart boys={boys} girls={girls} />
      </div>
      
      {/* STATISTICS */}
      <div className="mt-4 pt-4 border-t border-dark-border-secondary/30">
        <div className="flex justify-center gap-8">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full" />
              <span className="text-sm font-medium text-dark-text-secondary">Boys</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-dark-text-primary tabular-nums">{boys.toLocaleString()}</h3>
              <div className="flex items-center gap-1 justify-center">
                <span className="text-xs text-dark-text-tertiary font-medium">
                  {total > 0 ? Math.round((boys / total) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="w-px bg-gradient-to-b from-transparent via-dark-border-secondary to-transparent"></div>
          
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-accent-pink to-accent-rose rounded-full" />
              <span className="text-sm font-medium text-dark-text-secondary">Girls</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-dark-text-primary tabular-nums">{girls.toLocaleString()}</h3>
              <div className="flex items-center gap-1 justify-center">
                <span className="text-xs text-dark-text-tertiary font-medium">
                  {total > 0 ? Math.round((girls / total) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountChartContainer;
