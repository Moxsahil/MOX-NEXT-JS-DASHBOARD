import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableControls from "@/components/TableControls";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Class, Exam, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";

type ExamList = Exam & {
  lesson: {
    subject: Subject;
    class: Class;
    teacher: Teacher;
  };
};

const ExamListPage = async ({
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
      header: "Class",
      accessor: "class",
      className: "hidden md:table-cell",
    },
    {
      header: "Teacher",
      accessor: "teacher",
      className: "hidden md:table-cell",
    },
    {
      header: "Date & Time",
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

  const renderRow = (item: ExamList) => (
    <>
      <td className="px-6 py-4 text-sm text-dark-text-primary">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center shadow-glow">
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold text-dark-text-primary hover:text-brand-primary transition-colors duration-200">
              {item.lesson.subject.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-status-error-bg text-status-error-text border border-status-error-border">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Exam
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-status-warning-bg text-status-warning-text border border-status-warning-border">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {new Intl.DateTimeFormat("en-US", {
                  month: "short",
                  day: "numeric",
                }).format(item.startTime)}
              </span>
            </div>
          </div>
        </div>
      </td>
      <td className="hidden md:table-cell px-6 py-4 text-sm text-dark-text-primary">
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
      <td className="hidden md:table-cell px-6 py-4 text-sm text-dark-text-primary">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center shadow-glow">
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-dark-text-primary text-sm">
              {item.lesson.teacher.name} {item.lesson.teacher.surname}
            </span>
            <span className="text-xs text-dark-text-tertiary">Examiner</span>
          </div>
        </div>
      </td>
      <td className="hidden lg:table-cell px-6 py-4 text-sm text-dark-text-primary">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm font-medium text-dark-text-primary">
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
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              }).format(item.startTime)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-dark-text-tertiary">
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              {new Intl.DateTimeFormat("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }).format(item.startTime)}
            </span>
          </div>
        </div>
      </td>
      {(role === "admin" || role === "teacher") && (
        <td className="px-6 py-4 text-sm text-dark-text-primary">
          <div className="flex items-center gap-2">
            <FormContainer table="exam" type="update" id={item.id} />
            <FormContainer table="exam" type="delete" id={item.id} />
          </div>
        </td>
      )}
    </>
  );

  const { page, sortBy, sortOrder, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.ExamWhereInput = {};

  query.lesson = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "classId":
            query.lesson.classId = parseInt(value);
            break;
          case "teacherId":
            query.lesson.teacherId = value;
            break;
          case "search":
            query.OR = [
              { lesson: { subject: { name: { contains: value, mode: "insensitive" } } } },
              { lesson: { teacher: { name: { contains: value, mode: "insensitive" } } } },
              { lesson: { teacher: { surname: { contains: value, mode: "insensitive" } } } },
              { lesson: { class: { name: { contains: value, mode: "insensitive" } } } }
            ];
            break;
          case "subject":
            if (value !== "all") {
              query.lesson.subjectId = parseInt(value);
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
      query.lesson.teacherId = currentUserId!;
      break;
    case "student":
      query.lesson.class = {
        students: {
          some: {
            id: currentUserId!,
          },
        },
      };
      break;
    case "parent":
      query.lesson.class = {
        students: {
          some: {
            parentId: currentUserId!,
          },
        },
      };
      break;

    default:
      break;
  }

  // Sorting logic
  let orderBy: Prisma.ExamOrderByWithRelationInput = { startTime: 'asc' };
  
  if (sortBy) {
    switch (sortBy) {
      case 'subject':
        orderBy = { lesson: { subject: { name: sortOrder as 'asc' | 'desc' } } };
        break;
      case 'startTime':
        orderBy = { startTime: sortOrder as 'asc' | 'desc' };
        break;
      case 'teacher':
        orderBy = { lesson: { teacher: { name: sortOrder as 'asc' | 'desc' } } };
        break;
      case 'id':
        orderBy = { id: sortOrder as 'asc' | 'desc' };
        break;
      default:
        break;
    }
  }

  // Get subjects for filter options
  const subjects = await prisma.subject.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  });

  const [data, count] = await prisma.$transaction([
    prisma.exam.findMany({
      where: query,
      include: {
        lesson: {
          select: {
            subject: { select: { name: true } },
            teacher: { select: { name: true, surname: true } },
            class: { select: { name: true } },
          },
        },
      },
      orderBy,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.exam.count({ where: query }),
  ]);

  return (
    <div className="content-area">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center shadow-glow">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gradient">Exams</h1>
            <p className="text-dark-text-secondary">
              Schedule and manage student assessments
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-dark-secondary/80 backdrop-blur-xl rounded-xl p-1 border border-dark-border-secondary">
            {(role === "admin" || role === "teacher") && (
              <FormContainer table="exam" type="create" />
            )}
          </div>
        </div>
      </div>

      {/* Search/Filter/Sort Section */}
      <TableControls
        searchPlaceholder="Search exams by subject, teacher, or class..."
        totalCount={count}
        filters={[
          {
            key: 'subject',
            label: 'Subject',
            type: 'single',
            options: [
              { label: 'All Subjects', value: 'all' },
              ...subjects.map(s => ({
                label: s.name,
                value: s.id.toString()
              }))
            ]
          }
        ]}
        sortOptions={[
          { label: 'Subject A-Z', value: 'subject', direction: 'asc' },
          { label: 'Subject Z-A', value: 'subject', direction: 'desc' },
          { label: 'Date Earliest', value: 'startTime', direction: 'asc' },
          { label: 'Date Latest', value: 'startTime', direction: 'desc' },
          { label: 'Teacher A-Z', value: 'teacher', direction: 'asc' },
          { label: 'Teacher Z-A', value: 'teacher', direction: 'desc' },
          { label: 'ID (High-Low)', value: 'id', direction: 'desc' },
          { label: 'ID (Low-High)', value: 'id', direction: 'asc' }
        ]}
      />

      {/* Exams Table */}
      <Table columns={columns} renderRow={renderRow} data={data} />

      {/* Pagination */}
      <div className="flex justify-center">
        <Pagination page={p} count={count} />
      </div>
    </div>
  );
};

export default ExamListPage;
