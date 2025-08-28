import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

const menuItems = [
  {
    title: "NAVIGATION",
    items: [
      {
        icon: "/home.png",
        label: "Dashboard",
        href: "/",
        visible: ["admin", "teacher", "student", "parent"],
        gradient: "from-primary-500 to-primary-400",
      },
      {
        icon: "/teacher.png",
        label: "Teachers",
        href: "/list/teachers",
        visible: ["admin", "teacher"],
        gradient: "from-accent-emerald to-accent-teal",
      },
      {
        icon: "/student.png",
        label: "Students",
        href: "/list/students",
        visible: ["admin", "teacher"],
        gradient: "from-secondary-500 to-secondary-400",
      },
      {
        icon: "/parent.png",
        label: "Parents",
        href: "/list/parents",
        visible: ["admin", "teacher"],
        gradient: "from-accent-amber to-accent-orange",
      },
      {
        icon: "/subject.png",
        label: "Subjects",
        href: "/list/subjects",
        visible: ["admin"],
        gradient: "from-accent-rose to-accent-pink",
      },
      {
        icon: "/class.png",
        label: "Classes",
        href: "/list/classes",
        visible: ["admin", "teacher"],
        gradient: "from-accent-cyan to-primary-400",
      },
      {
        icon: "/class.png",
        label: "Grades",
        href: "/list/grades",
        visible: ["admin"],
        gradient: "from-accent-purple to-primary-500",
      },
    ],
  },
  {
    title: "ACADEMIC",
    items: [
      {
        icon: "/lesson.png",
        label: "Lessons",
        href: "/list/lessons",
        visible: ["admin", "teacher"],
        gradient: "from-primary-600 to-secondary-500",
      },
      {
        icon: "/exam.png",
        label: "Exams",
        href: "/list/exams",
        visible: ["admin", "teacher", "student", "parent"],
        gradient: "from-accent-rose to-accent-pink",
      },
      {
        icon: "/assignment.png",
        label: "Assignments",
        href: "/list/assignments",
        visible: ["admin", "teacher", "student", "parent"],
        gradient: "from-accent-lime to-accent-emerald",
      },
      {
        icon: "/result.png",
        label: "Results",
        href: "/list/results",
        visible: ["admin", "teacher", "student", "parent"],
        gradient: "from-accent-amber to-accent-orange",
      },
      {
        icon: "/attendance.png",
        label: "Attendance",
        href: "/list/attendance",
        visible: ["admin", "teacher", "student", "parent"],
        gradient: "from-accent-teal to-accent-cyan",
      },
    ],
  },
  {
    title: "COMMUNICATION",
    items: [
      {
        icon: "/calendar.png",
        label: "Events",
        href: "/list/events",
        visible: ["admin", "teacher", "student", "parent"],
        gradient: "from-primary-500 to-secondary-500",
      },
      {
        icon: "/announcement.png",
        label: "Announcements",
        href: "/list/announcements",
        visible: ["admin", "teacher", "student", "parent"],
        gradient: "from-secondary-500 to-accent-pink",
      },
    ],
  },
];

const Menu = async () => {
  const user = await currentUser();
  const role = user?.publicMetadata.role as string;

  return (
    <div className="p-4 space-y-8">
      {menuItems.map((section) => (
        <div key={section.title} className="space-y-1">
          <h3 className="hidden lg:block text-[10px] font-bold text-dark-text-tertiary uppercase tracking-[0.15em] px-3 py-2 select-none">
            {section.title}
          </h3>
          <nav className="space-y-1">
            {section.items.map((item) => {
              if (item.visible.includes(role)) {
                return (
                  <Link
                    href={item.href}
                    key={item.label}
                    className="group flex items-center justify-center lg:justify-start gap-3 px-3 py-3 rounded-xl text-dark-text-secondary hover:text-white font-medium transition-all duration-300 hover:scale-[1.01] hover:shadow-glow relative overflow-hidden"
                  >
                    {/* Background gradient on hover */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-90 transition-all duration-300 rounded-xl`}
                    ></div>

                    {/* Subtle hover background */}
                    <div className="absolute inset-0 bg-dark-elevated/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

                    {/* Icon container */}
                    <div className="relative z-10 flex items-center justify-center w-9 h-9">
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-lg opacity-20 group-hover:opacity-30 transition-all duration-300`}
                      ></div>
                      <Image
                        src={item.icon}
                        alt={item.label}
                        width={20}
                        height={20}
                        className="relative z-10 opacity-70 group-hover:opacity-100 group-hover:brightness-0 group-hover:invert transition-all duration-300"
                      />
                    </div>

                    {/* Label */}
                    <span className="hidden lg:block relative z-10 text-sm font-semibold tracking-wide">
                      {item.label}
                    </span>

                    {/* Modern chevron indicator */}
                    <div className="hidden lg:block ml-auto relative z-10">
                      <svg
                        className="w-4 h-4 opacity-0 group-hover:opacity-60 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </Link>
                );
              }
            })}
          </nav>
        </div>
      ))}
    </div>
  );
};

export default Menu;
