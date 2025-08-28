import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableControls from "@/components/TableControls";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Attendance, Lesson, Prisma, Student } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

type AttendanceList = Attendance & {
  student: Student;
  lesson: {
    name: string;
    subject: { name: string };
    class: { name: string };
  };
};

const AttendanceListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  const columns = [
    {
      header: "Student",
      accessor: "student",
    },
    {
      header: "Lesson",
      accessor: "lesson",
      className: "hidden md:table-cell",
    },
    {
      header: "Class",
      accessor: "class",
      className: "hidden md:table-cell",
    },
    {
      header: "Date",
      accessor: "date",
      className: "hidden lg:table-cell",
    },
    {
      header: "Status",
      accessor: "status",
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

  const renderRow = (item: AttendanceList) => (
    <>
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-secondary-400 to-secondary-500 rounded-full flex items-center justify-center shadow-glow">
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${item.present ? 'bg-green-500' : 'bg-red-500'} rounded-full border-2 border-dark-primary`}></div>
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold text-dark-text-primary hover:text-brand-primary transition-colors duration-200">
              {item.student.name} {item.student.surname}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                item.present 
                  ? 'bg-status-success-bg text-status-success-text border border-status-success-border'
                  : 'bg-status-error-bg text-status-error-text border border-status-error-border'
              }`}>
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={item.present ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}
                  />
                </svg>
                {item.present ? 'Present' : 'Absent'}
              </span>
            </div>
          </div>
        </div>
      </td>
      <td className="hidden md:table-cell px-6 py-4">
        <div className="flex flex-col gap-1">
          <span className="font-medium text-dark-text-primary text-sm">
            {item.lesson.name}
          </span>
          <span className="text-xs text-dark-text-secondary">
            {item.lesson.subject.name}
          </span>
        </div>
      </td>
      <td className="hidden md:table-cell px-6 py-4">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-status-info-bg text-status-info-text border border-status-info-border">
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          {item.lesson.class.name}
        </span>
      </td>
      <td className="hidden lg:table-cell px-6 py-4">
        <div className="flex items-center gap-2 text-dark-text-secondary">
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>
            {new Intl.DateTimeFormat("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }).format(item.date)}
          </span>
        </div>
      </td>
      <td className="hidden lg:table-cell px-6 py-4">
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
          item.present 
            ? 'bg-status-success-bg text-status-success-text border border-status-success-border'
            : 'bg-status-error-bg text-status-error-text border border-status-error-border'
        }`}>
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            {item.present ? (
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            ) : (
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            )}
          </svg>
          {item.present ? 'Present' : 'Absent'}
        </span>
      </td>
      {(role === "admin" || role === "teacher") && (
        <td className="px-6 py-4 text-sm text-dark-text-primary">
          <div className="flex items-center gap-2">
            <FormContainer table="attendance" type="update" id={item.id} />
            <FormContainer table="attendance" type="delete" id={item.id} />
          </div>
        </td>
      )}
    </>
  );

  const { page, sortBy, sortOrder, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION
  const query: Prisma.AttendanceWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { student: { name: { contains: value, mode: "insensitive" } } },
              { student: { surname: { contains: value, mode: "insensitive" } } },
              { lesson: { subject: { name: { contains: value, mode: "insensitive" } } } },
              { lesson: { class: { name: { contains: value, mode: "insensitive" } } } }
            ];
            break;
          case "classId":
            query.lesson = {
              classId: parseInt(value),
            };
            break;
          case "status":
            if (value !== "all") {
              query.present = value === "present";
            }
            break;
          default:
            break;
        }
      }
    }
  }

  // ROLE CONDITIONS
  const roleConditions = {
    teacher: { lesson: { teacherId: currentUserId! } },
    student: { studentId: currentUserId! },
    parent: { student: { parentId: currentUserId! } },
  };

  if (role !== "admin") {
    Object.assign(query, roleConditions[role as keyof typeof roleConditions] || {});
  }

  // Sorting logic
  let orderBy: Prisma.AttendanceOrderByWithRelationInput = { date: 'desc' };
  
  if (sortBy) {
    switch (sortBy) {
      case 'student':
        orderBy = { student: { name: sortOrder as 'asc' | 'desc' } };
        break;
      case 'date':
        orderBy = { date: sortOrder as 'asc' | 'desc' };
        break;
      case 'lesson':
        orderBy = { lesson: { name: sortOrder as 'asc' | 'desc' } };
        break;
      case 'status':
        orderBy = { present: sortOrder === 'asc' ? 'asc' : 'desc' };
        break;
      default:
        break;
    }
  }

  // Get classes for filter options
  const classes = await prisma.class.findMany({
    select: { id: true, name: true, _count: { select: { lessons: true } } },
    orderBy: { name: 'asc' }
  });

  const [data, count] = await prisma.$transaction([
    prisma.attendance.findMany({
      where: query,
      include: {
        student: {
          select: { name: true, surname: true },
        },
        lesson: {
          select: {
            name: true,
            subject: { select: { name: true } },
            class: { select: { name: true } },
          },
        },
      },
      orderBy,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.attendance.count({ where: query }),
  ]);

  return (
    <div className="content-area">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-accent-teal to-accent-cyan rounded-2xl flex items-center justify-center shadow-glow">
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
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gradient">Attendance</h1>
            <p className="text-dark-text-secondary">
              Track student attendance and participation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-dark-secondary/80 backdrop-blur-xl rounded-xl p-1 border border-dark-border-secondary">
            {(role === "admin" || role === "teacher") && (
              <FormContainer table="attendance" type="create" />
            )}
          </div>
        </div>
      </div>

      {/* Search/Filter/Sort Section */}
      <TableControls
        searchPlaceholder="Search attendance by student, lesson, or class..."
        totalCount={count}
        filters={[
          {
            key: 'class',
            label: 'Class',
            type: 'single',
            options: [
              { label: 'All Classes', value: 'all' },
              ...classes.map(c => ({
                label: c.name,
                value: c.id.toString(),
                count: c._count.lessons
              }))
            ]
          },
          {
            key: 'status',
            label: 'Attendance Status',
            type: 'single',
            options: [
              { label: 'All Status', value: 'all' },
              { label: 'Present', value: 'present' },
              { label: 'Absent', value: 'absent' }
            ]
          }
        ]}
        sortOptions={[
          { label: 'Student A-Z', value: 'student', direction: 'asc' },
          { label: 'Student Z-A', value: 'student', direction: 'desc' },
          { label: 'Date Newest', value: 'date', direction: 'desc' },
          { label: 'Date Oldest', value: 'date', direction: 'asc' },
          { label: 'Lesson A-Z', value: 'lesson', direction: 'asc' },
          { label: 'Lesson Z-A', value: 'lesson', direction: 'desc' },
          { label: 'Present First', value: 'status', direction: 'desc' },
          { label: 'Absent First', value: 'status', direction: 'asc' }
        ]}
      />

      {/* Attendance Table */}
      <Table columns={columns} renderRow={renderRow} data={data} />

      {/* Pagination */}
      <div className="flex justify-center">
        <Pagination page={p} count={count} />
      </div>
    </div>
  );
};

export default AttendanceListPage;