import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableControls from "@/components/TableControls";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Class, Lesson, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";

type LessonList = Lesson & { subject: Subject } & { class: Class } & {
  teacher: Teacher;
};

const LessonListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

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
      header: "Schedule",
      accessor: "schedule",
      className: "hidden lg:table-cell",
    },
    ...(role === "admin"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (item: LessonList) => (
    <>
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center border-2 border-white shadow-soft">
              <span className="text-white text-lg font-bold">📚</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold text-white hover:text-primary-600 transition-colors duration-200">
              {item.subject.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                📝 Lesson
              </span>
            </div>
          </div>
        </div>
      </td>
      <td className="hidden md:table-cell px-6 py-4">
        <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-medium">
          🏢 {item.class.name}
        </div>
      </td>
      <td className="hidden md:table-cell px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">👩‍🏫</span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-neutral-300 text-sm">
              {item.teacher.name} {item.teacher.surname}
            </span>
            <span className="text-xs text-neutral-500">Instructor</span>
          </div>
        </div>
      </td>
      <td className="hidden lg:table-cell px-6 py-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm font-medium text-neutral-300">
            <span>🕰️</span>
            <span>Available</span>
          </div>
          <div className="text-xs text-neutral-500">
            Check schedule for times
          </div>
        </div>
      </td>
      {role === "admin" && (
        <td className="px-6 py-4 text-sm text-dark-text-primary">
          <div className="flex items-center gap-2">
            <FormContainer table="lesson" type="update" id={item.id} />
            <FormContainer table="lesson" type="delete" id={item.id} />
          </div>
        </td>
      )}
    </>
  );

  const { page, sortBy, sortOrder, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.LessonWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "classId":
            query.classId = parseInt(value);
            break;
          case "teacherId":
            query.teacherId = value;
            break;
          case "search":
            query.OR = [
              { subject: { name: { contains: value, mode: "insensitive" } } },
              { teacher: { name: { contains: value, mode: "insensitive" } } },
            ];
            break;
          default:
            break;
        }
      }
    }
  }

  // Sorting logic
  let orderBy: Prisma.LessonOrderByWithRelationInput = { startTime: 'asc' };
  
  if (sortBy) {
    switch (sortBy) {
      case 'subject':
        orderBy = { subject: { name: sortOrder as 'asc' | 'desc' } };
        break;
      case 'teacher':
        orderBy = { teacher: { name: sortOrder as 'asc' | 'desc' } };
        break;
      case 'class':
        orderBy = { class: { name: sortOrder as 'asc' | 'desc' } };
        break;
      case 'startTime':
        orderBy = { startTime: sortOrder as 'asc' | 'desc' };
        break;
      case 'id':
        orderBy = { id: sortOrder as 'asc' | 'desc' };
        break;
      default:
        break;
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.lesson.findMany({
      where: query,
      include: {
        subject: { select: { name: true } },
        class: { select: { name: true } },
        teacher: { select: { name: true, surname: true } },
      },
      orderBy,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.lesson.count({ where: query }),
  ]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
            <span className="text-white text-2xl">📚</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gradient">Lessons</h1>
            <p className="text-neutral-600 mt-1">
              Manage class schedules and teaching assignments
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/60 backdrop-blur-lg px-4 py-2 rounded-xl border border-white/20 shadow-soft">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></div>
              <span className="text-sm font-medium text-neutral-600">
                {count} Lessons
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search/Filter/Sort Section */}
      <TableControls
        searchPlaceholder="Search lessons by subject, teacher, or class..."
        totalCount={count}
        sortOptions={[
          { label: 'Subject A-Z', value: 'subject', direction: 'asc' },
          { label: 'Subject Z-A', value: 'subject', direction: 'desc' },
          { label: 'Teacher A-Z', value: 'teacher', direction: 'asc' },
          { label: 'Teacher Z-A', value: 'teacher', direction: 'desc' },
          { label: 'Class A-Z', value: 'class', direction: 'asc' },
          { label: 'Class Z-A', value: 'class', direction: 'desc' },
          { label: 'Start Time (Early)', value: 'startTime', direction: 'asc' },
          { label: 'Start Time (Late)', value: 'startTime', direction: 'desc' },
          { label: 'ID (High-Low)', value: 'id', direction: 'desc' },
          { label: 'ID (Low-High)', value: 'id', direction: 'asc' }
        ]}
      />

      {/* Lessons Table */}
      <Table columns={columns} renderRow={renderRow} data={data} />

      {/* Pagination */}
      <div className="flex justify-center">
        <Pagination page={p} count={count} />
      </div>
    </div>
  );
};

export default LessonListPage;
