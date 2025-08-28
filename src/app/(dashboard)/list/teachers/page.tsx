import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableControls from "@/components/TableControls";
import prisma from "@/lib/prisma";
import { Class, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";

type TeacherList = Teacher & { subjects: Subject[] } & { classes: Class[] };

const TeacherListPage = async ({
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
      header: "Teacher ID",
      accessor: "teacherId",
      className: "hidden md:table-cell",
    },
    {
      header: "Subjects",
      accessor: "subjects",
      className: "hidden md:table-cell",
    },
    {
      header: "Classes",
      accessor: "classes",
      className: "hidden md:table-cell",
    },
    {
      header: "Phone",
      accessor: "phone",
      className: "hidden lg:table-cell",
    },
    {
      header: "Address",
      accessor: "address",
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

  const renderRow = (item: TeacherList) => (
    <>
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Image
              src={item.img || "/noAvatar.png"}
              alt=""
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover border-2 border-dark-border-secondary shadow-glow"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-brand-success to-accent-emerald rounded-full border-2 border-dark-primary"></div>
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold text-dark-text-primary hover:text-brand-primary transition-colors duration-200">
              {item.name} {item.surname}
            </h3>
            <p className="text-sm text-dark-text-secondary font-medium">
              {item?.email}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-status-success-bg text-status-success-text border border-status-success-border">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Teacher
              </span>
            </div>
          </div>
        </div>
      </td>
      <td className="hidden md:table-cell px-6 py-4">
        <div className="font-medium text-neutral-300">{item.username}</div>
      </td>
      <td className="hidden md:table-cell px-6 py-4">
        <div className="flex flex-wrap gap-1">
          {item.subjects.length > 0 ? (
            item.subjects.slice(0, 2).map((subject, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium"
              >
                📚 {subject.name}
              </span>
            ))
          ) : (
            <span className="text-neutral-400 text-sm">No subjects</span>
          )}
          {item.subjects.length > 2 && (
            <span className="inline-flex items-center px-2 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs font-medium">
              +{item.subjects.length - 2} more
            </span>
          )}
        </div>
      </td>
      <td className="hidden md:table-cell px-6 py-4">
        <div className="flex flex-wrap gap-1">
          {item.classes.length > 0 ? (
            item.classes.slice(0, 2).map((classItem, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 bg-secondary-100 text-secondary-700 rounded-full text-xs font-medium"
              >
                🏭 {classItem.name}
              </span>
            ))
          ) : (
            <span className="text-neutral-400 text-sm">No classes</span>
          )}
          {item.classes.length > 2 && (
            <span className="inline-flex items-center px-2 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs font-medium">
              +{item.classes.length - 2} more
            </span>
          )}
        </div>
      </td>
      <td className="hidden lg:table-cell px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <span>📞</span>
          <span>{item.phone || "Not provided"}</span>
        </div>
      </td>
      <td className="hidden lg:table-cell px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-neutral-600 max-w-xs">
          <span>📍</span>
          <span className="truncate" title={item.address}>
            {item.address || "Not provided"}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-dark-text-primary">
        <div className="flex items-center gap-2">
          <Link href={`/list/teachers/${item.id}`}>
            <button className="p-1 hover:bg-dark-elevated/60 rounded-lg transition-colors duration-200">
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
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </button>
          </Link>
          {role === "admin" && (
            <FormContainer table="teacher" type="update" id={item.id} />
          )}
          {role === "admin" && (
            <FormContainer table="teacher" type="delete" id={item.id} />
          )}
        </div>
      </td>
    </>
  );
  const { page, sortBy, sortOrder, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.TeacherWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "classId":
            query.lessons = {
              some: {
                classId: parseInt(value),
              },
            };
            break;
          case "search":
            query.OR = [
              { name: { contains: value, mode: "insensitive" } },
              { surname: { contains: value, mode: "insensitive" } },
              { email: { contains: value, mode: "insensitive" } },
            ];
            break;
          case "subject":
            if (value !== "all") {
              query.subjects = {
                some: {
                  id: parseInt(value),
                },
              };
            }
            break;
          default:
            break;
        }
      }
    }
  }

  // Sorting logic
  let orderBy: Prisma.TeacherOrderByWithRelationInput = { createdAt: 'desc' };
  
  if (sortBy) {
    switch (sortBy) {
      case 'name':
        orderBy = { name: sortOrder as 'asc' | 'desc' };
        break;
      case 'email':
        orderBy = { email: sortOrder as 'asc' | 'desc' };
        break;
      case 'createdAt':
        orderBy = { createdAt: sortOrder as 'asc' | 'desc' };
        break;
      default:
        break;
    }
  }

  // Get subjects for filter options
  const subjects = await prisma.subject.findMany({
    select: { id: true, name: true, _count: { select: { teachers: true } } },
    orderBy: { name: 'asc' }
  });

  const [data, count] = await prisma.$transaction([
    prisma.teacher.findMany({
      where: query,
      include: {
        subjects: true,
        classes: true,
      },
      orderBy,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.teacher.count({ where: query }),
  ]);

  return (
    <div className="content-area">
      {/* Modern Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-brand-success to-accent-emerald rounded-2xl flex items-center justify-center shadow-glow">
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
          <div>
            <h1 className="text-3xl font-bold text-gradient">Teachers</h1>
            <p className="text-dark-text-secondary">
              Manage your teaching staff and their assignments
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-dark-secondary/80 backdrop-blur-xl rounded-xl p-1 border border-dark-border-secondary">
            {role === "admin" && (
              <FormContainer table="teacher" type="create" />
            )}
          </div>
        </div>
      </div>

      {/* Search/Filter/Sort Section */}
      <TableControls
        searchPlaceholder="Search teachers by name, email, or subject..."
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
                value: s.id.toString(),
                count: s._count.teachers
              }))
            ]
          }
        ]}
        sortOptions={[
          { label: 'Name A-Z', value: 'name', direction: 'asc' },
          { label: 'Name Z-A', value: 'name', direction: 'desc' },
          { label: 'Email A-Z', value: 'email', direction: 'asc' },
          { label: 'Email Z-A', value: 'email', direction: 'desc' },
          { label: 'Newest First', value: 'createdAt', direction: 'desc' },
          { label: 'Oldest First', value: 'createdAt', direction: 'asc' }
        ]}
      />

      {/* Teachers Table */}
      <Table columns={columns} renderRow={renderRow} data={data} />

      {/* Pagination */}
      <div className="flex justify-center">
        <Pagination page={p} count={count} />
      </div>
    </div>
  );
};

export default TeacherListPage;
