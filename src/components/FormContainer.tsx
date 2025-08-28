import prisma from "@/lib/prisma";
import FormModal from "./FormModal";
import { auth } from "@clerk/nextjs/server";

export type FormContainerProps = {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement"
    | "grade";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  let relatedData = {};
  let fetchedData = data;

  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  // Fetch existing data for update operations
  if (type === "update" && id && !data) {
    switch (table) {
      case "event":
        const event = await prisma.event.findUnique({
          where: { id: Number(id) },
          include: { class: true },
        });
        if (event) {
          fetchedData = {
            ...event,
            classId: event.classId,
          };
        }
        break;
      case "announcement":
        const announcement = await prisma.announcement.findUnique({
          where: { id: Number(id) },
          include: { class: true },
        });
        if (announcement) {
          fetchedData = {
            ...announcement,
            classId: announcement.classId,
          };
        }
        break;
      case "subject":
        const subject = await prisma.subject.findUnique({
          where: { id: Number(id) },
          include: { teachers: { select: { id: true } } },
        });
        if (subject) {
          fetchedData = {
            ...subject,
            teachers: subject.teachers.map(teacher => teacher.id),
          };
        }
        break;
      case "class":
        const classData = await prisma.class.findUnique({
          where: { id: Number(id) },
          include: { supervisor: true, grade: true },
        });
        if (classData) {
          fetchedData = {
            ...classData,
            gradeId: classData.gradeId,
            supervisorId: classData.supervisorId,
          };
        }
        break;
      case "teacher":
        const teacher = await prisma.teacher.findUnique({
          where: { id: String(id) },
          include: { subjects: { select: { id: true } } },
        });
        if (teacher) {
          fetchedData = {
            ...teacher,
            subjects: teacher.subjects.map(subject => subject.id),
          };
        }
        break;
      case "student":
        const student = await prisma.student.findUnique({
          where: { id: String(id) },
          include: { class: true, grade: true, parent: true },
        });
        if (student) {
          fetchedData = {
            ...student,
            gradeId: student.gradeId,
            classId: student.classId,
            parentId: student.parentId,
          };
        }
        break;
      case "parent":
        const parent = await prisma.parent.findUnique({
          where: { id: String(id) },
          include: { students: { select: { id: true } } },
        });
        if (parent) {
          fetchedData = {
            ...parent,
            students: parent.students.map(student => student.id),
          };
        }
        break;
      case "lesson":
        const lesson = await prisma.lesson.findUnique({
          where: { id: Number(id) },
          include: { subject: true, class: true, teacher: true },
        });
        if (lesson) {
          fetchedData = {
            ...lesson,
            subjectId: lesson.subjectId,
            classId: lesson.classId,
            teacherId: lesson.teacherId,
          };
        }
        break;
      case "exam":
        const exam = await prisma.exam.findUnique({
          where: { id: Number(id) },
          include: { lesson: true },
        });
        if (exam) {
          fetchedData = {
            ...exam,
            lessonId: exam.lessonId,
          };
        }
        break;
      case "assignment":
        const assignment = await prisma.assignment.findUnique({
          where: { id: Number(id) },
          include: { lesson: true },
        });
        if (assignment) {
          fetchedData = {
            ...assignment,
            lessonId: assignment.lessonId,
          };
        }
        break;
      case "result":
        const result = await prisma.result.findUnique({
          where: { id: Number(id) },
          include: { student: true, exam: true, assignment: true },
        });
        if (result) {
          fetchedData = {
            ...result,
            studentId: result.studentId,
            examId: result.examId,
            assignmentId: result.assignmentId,
          };
        }
        break;
      case "attendance":
        const attendance = await prisma.attendance.findUnique({
          where: { id: Number(id) },
          include: { student: true, lesson: true },
        });
        if (attendance) {
          fetchedData = {
            ...attendance,
            studentId: attendance.studentId,
            lessonId: attendance.lessonId,
          };
        }
        break;
      case "grade":
        fetchedData = await prisma.grade.findUnique({
          where: { id: Number(id) },
        });
        break;
      default:
        break;
    }
  }

  if (type !== "delete") {
    switch (table) {
      
      case "subject":
        const subjectTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { teachers: subjectTeachers };
        break;

      case "class":
        const classGrades = await prisma.grade.findMany({
          select: { id: true, level: true },
        });
        const classTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { teachers: classTeachers, grades: classGrades };
        break;

      case "teacher":
        const teacherSubjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        });
        relatedData = { subjects: teacherSubjects };
        break;

      case "student":
        const studentGrades = await prisma.grade.findMany({
          select: { id: true, level: true },
        });
        const studentClasses = await prisma.class.findMany({
          include: { _count: { select: { students: true } } },
        });
        const studentParents = await prisma.parent.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { classes: studentClasses, grades: studentGrades, parents: studentParents };
        break;

      case "parent":
        const parentStudents = await prisma.student.findMany({
          select: { id: true, name: true },
        });
        relatedData = { students: parentStudents };
      break;

      case "exam":
        const examLessons = await prisma.lesson.findMany({
          where: {
            ...(role === "teacher" ? { teacherId: currentUserId! } : {}),
          },
          select: { id: true, name: true },
        });
        relatedData = { lessons: examLessons };
        break;

        case "lesson":
        const lessonTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        const lessonSubjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        });
        const lessonClasses = await prisma.class.findMany({
          select: { id: true, name: true },
             });
        relatedData = { teachers: lessonTeachers, subjects: lessonSubjects, classes: lessonClasses };
        break;

        case "event":
         const eventCreators = await prisma.teacher.findMany({
         select: { id: true, name: true, email: true },
          });

         const eventSubjects = await prisma.subject.findMany({
        select: { id: true, name: true },
        });

         const eventClasses = await prisma.class.findMany({
        select: { id: true, name: true },
           });

        relatedData = { creators: eventCreators, subjects: eventSubjects, classes: eventClasses };
        break;

        case "announcement":
        const announcementClasses = await prisma.class.findMany({
          select: { id: true, name: true },
        });
        relatedData = { classes: announcementClasses };
        break;

        case "assignment":
        const assignmentLessons = await prisma.lesson.findMany({
          where: {
            ...(role === "teacher" ? { teacherId: currentUserId! } : {}),
          },
          select: { id: true, name: true },
        });
        relatedData = { lessons: assignmentLessons };
        break;

        case "attendance":
        const attendanceLessons = await prisma.lesson.findMany({
          where: {
            ...(role === "teacher" ? { teacherId: currentUserId! } : {}),
          },
          select: { id: true, name: true },
        });
        const attendanceStudents = await prisma.student.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { lessons: attendanceLessons, students: attendanceStudents };
        break;

        case "result":
        const resultExams = await prisma.exam.findMany({
          select: { id: true, title: true },
        });
        const resultAssignments = await prisma.assignment.findMany({
          select: { id: true, title: true },
        });
        const resultStudents = await prisma.student.findMany({
          select: { id: true, name: true },
        });
        relatedData = {
          exams: resultExams,
          assignments: resultAssignments,
          students: resultStudents,
        };
        break;


      default:
        break;
    }
  }

  return (
    <div className="">
      <FormModal
        table={table}
        type={type}
        data={fetchedData}
        id={id}
        relatedData={relatedData}
      />
    </div>
  );
};

export default FormContainer;
