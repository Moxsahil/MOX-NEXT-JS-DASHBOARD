import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import FormContainer from "@/components/FormContainer";
import Performance from "@/components/Performance";
import StudentAttendanceCard from "@/components/StudentAttendanceCard";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Class, Student } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

const SingleStudentPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const { sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const student:
    | (Student & {
        class: Class & { _count: { lessons: number } };
      })
    | null = await prisma.student.findUnique({
    where: { id },
    include: {
      class: { include: { _count: { select: { lessons: true } } } },
    },
  });

  if (!student) {
    return notFound();
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/list/students"
            className="text-neutral-500 hover:text-primary-600 transition-colors duration-200"
          >
            ← Back to Students
          </Link>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        {/* LEFT SECTION */}
        <div className="w-full xl:w-2/3 space-y-8">
          {/* STUDENT PROFILE SECTION */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Profile Card */}
            <div className="card-modern p-8 flex-1 bg-gradient-to-br from-secondary-50 to-secondary-100/50 border-secondary-200">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-modern overflow-hidden bg-gradient-to-br from-secondary-100 to-secondary-200">
                    <Image
                      src={student.img || "/noAvatar.png"}
                      alt={`${student.name} ${student.surname}`}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-secondary-500 to-secondary-400 rounded-full border-4 border-white flex items-center justify-center">
                    <span className="text-white text-sm">👨‍🎓</span>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gradient">
                        {student.name} {student.surname}
                      </h1>
                      <p className="text-lg text-neutral-600 font-medium">
                        Student • Class {student.class.name}
                      </p>
                    </div>
                    {role === "admin" && (
                      <FormContainer
                        table="student"
                        type="update"
                        data={student}
                      />
                    )}
                  </div>

                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-100 text-secondary-700 rounded-full">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
                    </svg>
                    <span className="font-semibold text-sm">
                      Active Student
                    </span>
                  </div>
                </div>
              </div>
              {/* Student Details Grid */}
              <div className="mt-6 pt-6 border-t border-secondary-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                    <span className="text-red-500">🩸</span>
                    <div>
                      <p className="text-xs text-neutral-500 font-medium">
                        Blood Type
                      </p>
                      <p className="font-semibold text-neutral-800">
                        {student.bloodType}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                    <span className="text-primary-500">📅</span>
                    <div>
                      <p className="text-xs text-neutral-500 font-medium">
                        Birthday
                      </p>
                      <p className="font-semibold text-neutral-800 text-sm">
                        {new Intl.DateTimeFormat("en-GB").format(
                          student.birthday
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                    <span className="text-accent-emerald">📧</span>
                    <div>
                      <p className="text-xs text-neutral-500 font-medium">
                        Email
                      </p>
                      <p className="font-semibold text-neutral-800 text-sm truncate">
                        {student.email || "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                    <span className="text-accent-amber">📞</span>
                    <div>
                      <p className="text-xs text-neutral-500 font-medium">
                        Phone
                      </p>
                      <p className="font-semibold text-neutral-800 text-sm">
                        {student.phone || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card-modern p-4 hover:shadow-glow transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-success-500 to-success-400 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <Suspense
                    fallback={
                      <div className="w-8 h-6 bg-neutral-200 rounded animate-pulse"></div>
                    }
                  >
                    <StudentAttendanceCard id={student.id} />
                  </Suspense>
                  <p className="text-sm text-neutral-500 font-medium">
                    Attendance
                  </p>
                </div>
              </div>
            </div>

            <div className="card-modern p-4 hover:shadow-glow transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-400 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-dark-text-primary">
                    {student.class.name.charAt(0)}
                  </h3>
                  <p className="text-sm text-dark-text-secondary font-medium">
                    Grade Level
                  </p>
                </div>
              </div>
            </div>

            <div className="card-modern p-4 hover:shadow-glow transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-accent-amber to-accent-orange rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-dark-text-primary">
                    {student.class._count.lessons}
                  </h3>
                  <p className="text-sm text-dark-text-secondary font-medium">
                    Total Lessons
                  </p>
                </div>
              </div>
            </div>

            <div className="card-modern p-4 hover:shadow-glow transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-secondary-500 to-secondary-400 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark-text-primary">
                    {student.class.name}
                  </h3>
                  <p className="text-sm text-dark-text-secondary font-medium">
                    Current Class
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Schedule Section */}
        <div className="card-modern p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-dark-text-primary">
                Class Schedule
              </h2>
              <p className="text-sm text-dark-text-secondary">
                Weekly schedule for {student.class.name}
              </p>
            </div>
          </div>
          <div className="h-[600px]">
            <BigCalendarContainer type="classId" id={student.class.id} />
          </div>
        </div>
      </div>
      {/* RIGHT SIDEBAR */}
      <div className="w-full xl:w-1/3 space-y-6">
        {/* Quick Actions */}
        <div className="card-modern p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-accent-emerald to-accent-teal rounded-lg flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-dark-text-primary">
              Quick Actions
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <Link
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary-50 to-primary-100 hover:from-primary-100 hover:to-primary-200 rounded-xl transition-all duration-300 hover:scale-[1.02] text-primary-700 hover:text-primary-800"
              href={`/list/lessons?classId=${student.class.id}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="font-semibold">View Lessons</span>
            </Link>
            <Link
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-secondary-50 to-secondary-100 hover:from-secondary-100 hover:to-secondary-200 rounded-xl transition-all duration-300 hover:scale-[1.02] text-secondary-700 hover:text-secondary-800"
              href={`/list/teachers?classId=${student.class.id}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-semibold">View Teachers</span>
            </Link>
            <Link
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-accent-rose/10 to-accent-pink/10 hover:from-accent-rose/20 hover:to-accent-pink/20 rounded-xl transition-all duration-300 hover:scale-[1.02] text-accent-rose hover:text-rose-600"
              href={`/list/exams?classId=${student.class.id}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="font-semibold">View Exams</span>
            </Link>
            <Link
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-accent-amber/10 to-accent-orange/10 hover:from-accent-amber/20 hover:to-accent-orange/20 rounded-xl transition-all duration-300 hover:scale-[1.02] text-accent-amber hover:text-amber-600"
              href={`/list/assignments?classId=${student.class.id}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="font-semibold">View Assignments</span>
            </Link>
            <Link
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-success-50 to-success-100 hover:from-success-100 hover:to-success-200 rounded-xl transition-all duration-300 hover:scale-[1.02] text-success-700 hover:text-success-800"
              href={`/list/results?studentId=${student.id}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <span className="font-semibold">View Results</span>
            </Link>
          </div>
        </div>

        {/* Performance Widget */}
        <div className="card-modern p-0 overflow-hidden">
          <Performance />
        </div>

        {/* Announcements */}
        <div className="card-modern p-6">
          <Announcements />
        </div>
      </div>
    </div>
  );
};

export default SingleStudentPage;
