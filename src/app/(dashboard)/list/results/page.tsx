import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableControls from "@/components/TableControls";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";

type ResultList = {
  id: number;
  title: string;
  studentName: string;
  studentSurname: string;
  teacherName: string;
  teacherSurname: string;
  score: number;
  className: string;
  startTime: Date;
};

const ResultListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  const columns = [
    {
      header: "Info",
      accessor: "info",
    },
    {
      header: "Student",
      accessor: "student",
      className: "hidden md:table-cell",
    },
    {
      header: "Score",
      accessor: "score",
      className: "hidden md:table-cell",
    },
    {
      header: "Teacher",
      accessor: "teacher",
      className: "hidden lg:table-cell",
    },
    {
      header: "Date",
      accessor: "date",
      className: "hidden lg:table-cell",
    },
    ...(role === "admin" || role === "teacher"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (item: ResultList) => (
    <>
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center border-2 border-white shadow-soft">
              <span className="text-white text-lg font-bold">🏆</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-500 to-teal-600 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold text-white hover:text-primary-600 transition-colors duration-200">
              {item.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                📈 Result
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                🏢 {item.className}
              </span>
            </div>
          </div>
        </div>
      </td>
      <td className="hidden md:table-cell px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">👨‍🎓</span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-neutral-white text-sm">
              {item.studentName} {item.studentSurname}
            </span>
            <span className="text-xs text-neutral-500">Student</span>
          </div>
        </div>
      </td>
      <td className="hidden md:table-cell px-6 py-4">
        <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 rounded-full text-sm font-medium">
          🎆 {item.score} pts
        </div>
      </td>
      <td className="hidden lg:table-cell px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">👩‍🏫</span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-white text-sm">
              {item.teacherName} {item.teacherSurname}
            </span>
            <span className="text-xs text-neutral-500">Teacher</span>
          </div>
        </div>
      </td>
      <td className="hidden lg:table-cell px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <span>📅</span>
          <span>
            {new Intl.DateTimeFormat("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }).format(item.startTime)}
          </span>
        </div>
      </td>
      {(role === "admin" || role === "teacher") && (
        <td className="px-6 py-4 text-sm text-dark-text-primary">
          <div className="flex items-center gap-2">
            <FormContainer table="result" type="update" id={item.id} />
            <FormContainer table="result" type="delete" id={item.id} />
          </div>
        </td>
      )}
    </>
  );

  const { page, sortBy, sortOrder, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.ResultWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "studentId":
            query.studentId = value;
            break;
          case "search":
            query.OR = [
              { exam: { title: { contains: value, mode: "insensitive" } } },
              { assignment: { title: { contains: value, mode: "insensitive" } } },
              { student: { name: { contains: value, mode: "insensitive" } } },
              { student: { surname: { contains: value, mode: "insensitive" } } }
            ];
            break;
          case "type":
            if (value === "exam") {
              query.examId = { not: null };
            } else if (value === "assignment") {
              query.assignmentId = { not: null };
            }
            break;
          default:
            break;
        }
      }
    }
  }

  // ROLE CONDITIONS

  switch (role) {
    case "admin":
      break;
    case "teacher":
      query.OR = [
        { exam: { lesson: { teacherId: currentUserId! } } },
        { assignment: { lesson: { teacherId: currentUserId! } } },
      ];
      break;

    case "student":
      query.studentId = currentUserId!;
      break;

    case "parent":
      query.student = {
        parentId: currentUserId!,
      };
      break;
    default:
      break;
  }

  // Sorting logic
  let orderBy: Prisma.ResultOrderByWithRelationInput = { score: 'desc' };
  
  if (sortBy) {
    switch (sortBy) {
      case 'score':
        orderBy = { score: sortOrder as 'asc' | 'desc' };
        break;
      case 'student':
        orderBy = { student: { name: sortOrder as 'asc' | 'desc' } };
        break;
      case 'id':
        orderBy = { id: sortOrder as 'asc' | 'desc' };
        break;
      default:
        break;
    }
  }

  const [dataRes, count] = await prisma.$transaction([
    prisma.result.findMany({
      where: query,
      include: {
        student: { select: { name: true, surname: true } },
        exam: {
          include: {
            lesson: {
              select: {
                class: { select: { name: true } },
                teacher: { select: { name: true, surname: true } },
              },
            },
          },
        },
        assignment: {
          include: {
            lesson: {
              select: {
                class: { select: { name: true } },
                teacher: { select: { name: true, surname: true } },
              },
            },
          },
        },
      },
      orderBy,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.result.count({ where: query }),
  ]);

  const data = dataRes.map((item) => {
    const assessment = item.exam || item.assignment;

    if (!assessment) return null;

    const isExam = "startTime" in assessment;

    return {
      id: item.id,
      title: assessment.title,
      studentName: item.student.name,
      studentSurname: item.student.surname,
      teacherName: assessment.lesson.teacher.name,
      teacherSurname: assessment.lesson.teacher.surname,
      score: item.score,
      className: assessment.lesson.class.name,
      startTime: isExam ? assessment.startTime : assessment.startDate,
    };
  });

  return (
    <div className="content-area">
      {/* Modern Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-accent-orange to-accent-yellow rounded-2xl flex items-center justify-center shadow-glow">
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gradient">Results</h1>
            <p className="text-dark-text-secondary">
              Track student performance and assessment scores
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-dark-secondary/80 backdrop-blur-xl rounded-xl p-1 border border-dark-border-secondary">
            {(role === "admin" || role === "teacher") && (
              <FormContainer table="result" type="create" />
            )}
          </div>
        </div>
      </div>

      {/* Search/Filter/Sort Section */}
      <TableControls
        searchPlaceholder="Search results by student, exam title, or teacher..."
        totalCount={count}
        filters={[
          {
            key: 'type',
            label: 'Assessment Type',
            type: 'single',
            options: [
              { label: 'All Types', value: 'all' },
              { label: 'Exams', value: 'exam' },
              { label: 'Assignments', value: 'assignment' }
            ]
          }
        ]}
        sortOptions={[
          { label: 'Score High to Low', value: 'score', direction: 'desc' },
          { label: 'Score Low to High', value: 'score', direction: 'asc' },
          { label: 'Student A-Z', value: 'student', direction: 'asc' },
          { label: 'Student Z-A', value: 'student', direction: 'desc' },
          { label: 'ID (High-Low)', value: 'id', direction: 'desc' },
          { label: 'ID (Low-High)', value: 'id', direction: 'asc' }
        ]}
      />

      {/* Results Table */}
      <Table columns={columns} renderRow={renderRow} data={data} />

      {/* Pagination */}
      <div className="flex justify-center">
        <Pagination page={p} count={count} />
      </div>
    </div>
  );
};

export default ResultListPage;
