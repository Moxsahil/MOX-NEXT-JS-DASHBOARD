import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Mark this route as dynamic since it uses auth() which accesses headers
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { userId, sessionClaims } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (sessionClaims?.metadata as { role?: string })?.role;
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const searchResults: any[] = [];
    const searchTerm = query.toLowerCase();

    // Role-based access control for students
    const studentAccessCondition = role === "admin" ? {} : 
      role === "teacher" ? {
        class: { lessons: { some: { teacherId: userId } } }
      } : 
      role === "parent" ? {
        parentId: userId
      } : {};

    // Search Students
    const students = await prisma.student.findMany({
      where: {
        AND: [
          studentAccessCondition,
          {
            OR: [
              { name: { contains: searchTerm, mode: "insensitive" } },
              { surname: { contains: searchTerm, mode: "insensitive" } },
              { email: { contains: searchTerm, mode: "insensitive" } },
              { username: { contains: searchTerm, mode: "insensitive" } },
            ],
          }
        ]
      },
      include: { class: true, grade: true },
      take: 8,
    });

    students.forEach((student) => {
      searchResults.push({
        id: student.id,
        title: `${student.name} ${student.surname}`,
        subtitle: `Student • ${student.class?.name || "No Class"} • Grade ${student.grade?.level || "N/A"}`,
        type: "student",
        url: `/list/students`,
        avatar: student.img,
      });
    });

    // Search Teachers (only for admins and teachers can see other teachers)
    const teachers = role === "parent" ? [] : await prisma.teacher.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { surname: { contains: searchTerm, mode: "insensitive" } },
          { email: { contains: searchTerm, mode: "insensitive" } },
          { username: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      include: { subjects: true },
      take: 8,
    });

    teachers.forEach((teacher) => {
      searchResults.push({
        id: teacher.id,
        title: `${teacher.name} ${teacher.surname}`,
        subtitle: `Teacher • ${teacher.subjects.map(s => s.name).join(", ") || "No Subjects"}`,
        type: "teacher",
        url: `/list/teachers`,
        avatar: teacher.img,
      });
    });

    // Search Classes
    const classes = await prisma.class.findMany({
      where: {
        name: { contains: searchTerm, mode: "insensitive" },
      },
      include: { grade: true, supervisor: true, _count: { select: { students: true } } },
      take: 8,
    });

    classes.forEach((classItem) => {
      searchResults.push({
        id: classItem.id,
        title: classItem.name,
        subtitle: `Class • Grade ${classItem.grade?.level || "N/A"} • ${classItem._count.students} students`,
        type: "class",
        url: `/list/classes`,
      });
    });

    // Search Subjects
    const subjects = await prisma.subject.findMany({
      where: {
        name: { contains: searchTerm, mode: "insensitive" },
      },
      include: { _count: { select: { teachers: true, lessons: true } } },
      take: 8,
    });

    subjects.forEach((subject) => {
      searchResults.push({
        id: subject.id,
        title: subject.name,
        subtitle: `Subject • ${subject._count.teachers} teachers • ${subject._count.lessons} lessons`,
        type: "subject",
        url: `/list/subjects`,
      });
    });

    // Search Events
    const events = await prisma.event.findMany({
      where: {
        OR: [
          { title: { contains: searchTerm, mode: "insensitive" } },
          { description: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      include: { class: true },
      take: 8,
    });

    events.forEach((event) => {
      searchResults.push({
        id: event.id,
        title: event.title,
        subtitle: `Event • ${event.class?.name || "All Classes"} • ${event.startTime.toLocaleDateString()}`,
        type: "event",
        url: `/list/events`,
      });
    });

    // Search Announcements
    const announcements = await prisma.announcement.findMany({
      where: {
        OR: [
          { title: { contains: searchTerm, mode: "insensitive" } },
          { description: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      include: { class: true },
      take: 8,
    });

    announcements.forEach((announcement) => {
      searchResults.push({
        id: announcement.id,
        title: announcement.title,
        subtitle: `Announcement • ${announcement.class?.name || "All Classes"} • ${announcement.date.toLocaleDateString()}`,
        type: "announcement",
        url: `/list/announcements`,
      });
    });

    // Search Parents (only for admins)
    if (role === "admin") {
      const parents = await prisma.parent.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { surname: { contains: searchTerm, mode: "insensitive" } },
            { email: { contains: searchTerm, mode: "insensitive" } },
            { username: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        include: { _count: { select: { students: true } } },
        take: 8,
      });

      parents.forEach((parent) => {
        searchResults.push({
          id: parent.id,
          title: `${parent.name} ${parent.surname}`,
          subtitle: `Parent • ${parent._count.students} student${parent._count.students !== 1 ? 's' : ''}`,
          type: "parent",
          url: `/list/parents`,
        });
      });
    }

    // Search Lessons (role-based access)
    const lessonAccessCondition = role === "admin" ? {} :
      role === "teacher" ? { teacherId: userId } :
      role === "student" ? { class: { students: { some: { id: userId } } } } :
      role === "parent" ? { class: { students: { some: { parentId: userId } } } } : {};

    if (role !== "parent" || role === "parent") {
      const lessons = await prisma.lesson.findMany({
        where: {
          AND: [
            lessonAccessCondition,
            {
              OR: [
                { name: { contains: searchTerm, mode: "insensitive" } },
                { subject: { name: { contains: searchTerm, mode: "insensitive" } } },
              ],
            }
          ]
        },
        include: { subject: true, class: true, teacher: true },
        take: 8,
      });

      lessons.forEach((lesson) => {
        searchResults.push({
          id: lesson.id,
          title: lesson.name,
          subtitle: `Lesson • ${lesson.subject.name} • ${lesson.class.name} • ${lesson.day}`,
          type: "lesson",
          url: `/list/lessons`,
        });
      });
    }

    // Search Exams (role-based access)
    if (role !== "parent") {
      const exams = await prisma.exam.findMany({
        where: {
          OR: [
            { title: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        include: { lesson: { include: { subject: true, class: true } } },
        take: 8,
      });

      exams.forEach((exam) => {
        searchResults.push({
          id: exam.id,
          title: exam.title,
          subtitle: `Exam • ${exam.lesson.subject.name} • ${exam.lesson.class.name} • ${exam.startTime.toLocaleDateString()}`,
          type: "exam",
          url: `/list/exams`,
        });
      });
    }

    // Sort results by relevance (exact matches first, then partial matches)
    const sortedResults = searchResults.sort((a, b) => {
      const aExact = a.title.toLowerCase().startsWith(searchTerm);
      const bExact = b.title.toLowerCase().startsWith(searchTerm);
      
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      return a.title.localeCompare(b.title);
    });

    return NextResponse.json({ 
      results: sortedResults.slice(0, 30), // Limit to 30 results total
      query: query 
    });

  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}