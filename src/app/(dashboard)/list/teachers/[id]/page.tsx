import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import BigCalendar from "@/components/BigCalender";
import FormContainer from "@/components/FormContainer";
import Performance from "@/components/Performance";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Teacher } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const SingleTeacherPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const { sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const teacher:
    | (Teacher & {
        _count: { subjects: number; lessons: number; classes: number };
      })
    | null = await prisma.teacher.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          subjects: true,
          lessons: true,
          classes: true,
        },
      },
    },
  });

  if (!teacher) {
    return notFound();
  }
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/list/teachers"
            className="flex items-center gap-2 text-dark-text-secondary hover:text-brand-primary transition-colors duration-200 font-medium"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>Back to Teachers</span>
          </Link>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        {/* LEFT SECTION */}
        <div className="w-full xl:w-2/3 space-y-8">
          {/* TEACHER PROFILE SECTION */}
          <div className="card-modern p-8">
            <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <Image
                    src={teacher.img || "/noAvatar.png"}
                    alt={`${teacher.name} ${teacher.surname}`}
                    width={144}
                    height={144}
                    className="w-36 h-36 rounded-2xl object-cover shadow-2xl border-4 border-dark-border-secondary"
                  />
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-accent-emerald to-accent-teal rounded-full flex items-center justify-center shadow-2xl">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-6 text-center lg:text-left">
                <div>
                  <div className="flex items-center justify-center lg:justify-start gap-4 mb-2">
                    <h1 className="text-3xl font-bold text-gradient">
                      {teacher.name} {teacher.surname}
                    </h1>
                    {role === "admin" && (
                      <FormContainer
                        table="teacher"
                        type="update"
                        data={teacher}
                      />
                    )}
                  </div>
                  <p className="text-sm text-dark-text-secondary font-medium">
                    Teacher ID:{" "}
                    <span className="text-dark-text-primary">{teacher.id}</span>
                  </p>
                </div>

                {/* Contact Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center justify-center lg:justify-start gap-3 p-3 bg-dark-elevated/50 rounded-xl">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-red-500 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-dark-text-secondary font-medium">
                        Blood Type
                      </p>
                      <p className="text-sm font-semibold text-dark-text-primary">
                        {teacher.bloodType}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center lg:justify-start gap-3 p-3 bg-dark-elevated/50 rounded-xl">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-dark-text-secondary font-medium">
                        Birthday
                      </p>
                      <p className="text-sm font-semibold text-dark-text-primary">
                        {new Intl.DateTimeFormat("en-GB").format(
                          teacher.birthday
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center lg:justify-start gap-3 p-3 bg-dark-elevated/50 rounded-xl">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-dark-text-secondary font-medium">
                        Email
                      </p>
                      <p className="text-sm font-semibold text-dark-text-primary">
                        {teacher.email || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center lg:justify-start gap-3 p-3 bg-dark-elevated/50 rounded-xl">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-dark-text-secondary font-medium">
                        Phone
                      </p>
                      <p className="text-sm font-semibold text-dark-text-primary">
                        {teacher.phone || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Attendance Card */}
            <div className="card-modern p-6 bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 hover:shadow-glow transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-soft">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-green-800">90%</h3>
                  <p className="text-sm font-medium text-green-600">
                    Attendance
                  </p>
                </div>
              </div>
            </div>

            {/* Subjects Card */}
            <div className="card-modern p-6 bg-gradient-to-br from-blue-50 to-primary-100 border-blue-200 hover:shadow-glow transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-primary-600 rounded-xl flex items-center justify-center shadow-soft">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-blue-800">
                    {teacher._count.subjects}
                  </h3>
                  <p className="text-sm font-medium text-blue-600">Subjects</p>
                </div>
              </div>
            </div>

            {/* Lessons Card */}
            <div className="card-modern p-6 bg-gradient-to-br from-purple-50 to-secondary-100 border-purple-200 hover:shadow-glow transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-secondary-600 rounded-xl flex items-center justify-center shadow-soft">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-purple-800">
                    {teacher._count.lessons}
                  </h3>
                  <p className="text-sm font-medium text-purple-600">Lessons</p>
                </div>
              </div>
            </div>

            {/* Classes Card */}
            <div className="card-modern p-6 bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200 hover:shadow-glow transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-soft">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-orange-800">
                    {teacher._count.classes}
                  </h3>
                  <p className="text-sm font-medium text-orange-600">Classes</p>
                </div>
              </div>
            </div>
          </div>

          {/* SCHEDULE SECTION */}
          <div className="card-modern p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-400 rounded-xl flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-dark-text-primary">
                  Teaching Schedule
                </h2>
                <p className="text-sm text-dark-text-secondary">
                  Weekly class and lesson timetable
                </p>
              </div>
            </div>
            <div className="h-[600px]">
              <BigCalendarContainer type="teacherId" id={teacher.id} />
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="w-full xl:w-1/3 space-y-6">
          {/* Quick Actions */}
          <div className="card-modern p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-accent-rose to-secondary-500 rounded-lg flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-dark-text-primary">
                Quick Actions
              </h2>
            </div>
            <div className="space-y-3">
              <Link
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-accent-cyan/10 to-accent-teal/10 border border-cyan-200 rounded-xl hover:shadow-soft transition-all duration-200 group"
                href={`/list/classes?supervisorId=${teacher.id}`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6"
                  />
                </svg>
                <div>
                  <p className="font-medium text-dark-text-primary group-hover:text-cyan-400">
                    Teacher's Classes
                  </p>
                  <p className="text-xs text-dark-text-secondary">
                    View assigned classes
                  </p>
                </div>
              </Link>

              <Link
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-secondary-50 to-purple-100 border border-purple-200 rounded-xl hover:shadow-soft transition-all duration-200 group"
                href={`/list/students?teacherId=${teacher.id}`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <div>
                  <p className="font-medium text-neutral-900 group-hover:text-purple-400">
                    Teacher's Students
                  </p>
                  <p className="text-xs text-dark-text-secondary">
                    View all students
                  </p>
                </div>
              </Link>

              <Link
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-yellow-100 border border-amber-200 rounded-xl hover:shadow-soft transition-all duration-200 group"
                href={`/list/lessons?teacherId=${teacher.id}`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <div>
                  <p className="font-medium text-dark-text-primary group-hover:text-amber-400">
                    Teacher's Lessons
                  </p>
                  <p className="text-xs text-dark-text-secondary">
                    Manage lessons
                  </p>
                </div>
              </Link>

              <Link
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-rose-50 to-pink-100 border border-rose-200 rounded-xl hover:shadow-soft transition-all duration-200 group"
                href={`/list/exams?teacherId=${teacher.id}`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <div>
                  <p className="font-medium text-dark-text-primary group-hover:text-rose-400">
                    Teacher's Exams
                  </p>
                  <p className="text-xs text-dark-text-secondary">
                    View exam schedule
                  </p>
                </div>
              </Link>

              <Link
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-green-100 border border-emerald-200 rounded-xl hover:shadow-soft transition-all duration-200 group"
                href={`/list/assignments?teacherId=${teacher.id}`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <div>
                  <p className="font-medium text-dark-text-primary group-hover:text-emerald-400">
                    Teacher's Assignments
                  </p>
                  <p className="text-xs text-dark-text-secondary">
                    Manage assignments
                  </p>
                </div>
              </Link>
            </div>
          </div>

          <Performance />
          <Announcements />
        </div>
      </div>
    </div>
  );
};

export default SingleTeacherPage;
