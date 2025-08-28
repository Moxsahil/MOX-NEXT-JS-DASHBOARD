import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableControls from "@/components/TableControls";

import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Class, Prisma, Student } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

import { auth } from "@clerk/nextjs/server";

type StudentList = Student & { class: Class };

const StudentListPage = async ({
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
      header: "Student ID",
      accessor: "studentId",
      className: "hidden md:table-cell",
    },
    {
      header: "Class",
      accessor: "class",
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

  const renderRow = (item: StudentList) => (
    <>
      <td className="px-6 py-4 text-sm text-dark-text-primary">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Image
              src={item.img || "/noAvatar.png"}
              alt=""
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover border-2 border-dark-border-secondary shadow-glow"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full border-2 border-dark-background"></div>
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
                Student
              </span>
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
                {item.class.name}
              </span>
            </div>
          </div>
        </div>
      </td>
      <td className="hidden md:table-cell px-6 py-4 text-sm text-dark-text-primary">
        <div className="font-medium">{item.username}</div>
      </td>
      <td className="hidden md:table-cell px-6 py-4 text-sm text-dark-text-primary">
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
              d="M12 14l9-5-9-5-9 5 9 5z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
            />
          </svg>
          Grade {item.class.name[0]}
        </span>
      </td>
      <td className="hidden lg:table-cell px-6 py-4 text-sm text-dark-text-secondary">
        <div className="flex items-center gap-2">
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
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          <span>{item.phone || "Not provided"}</span>
        </div>
      </td>
      <td className="hidden lg:table-cell px-6 py-4 text-sm text-dark-text-secondary">
        <div className="flex items-center gap-2 max-w-xs">
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
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="truncate" title={item.address}>
            {item.address || "Not provided"}
          </span>
        </div>
      </td>
      {role === "admin" && (
        <td className="px-6 py-4 text-sm text-dark-text-primary">
          <div className="flex items-center gap-2">
            <Link href={`/list/students/${item.id}`}>
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
            <FormContainer table="student" type="update" id={item.id} />
            <FormContainer table="student" type="delete" id={item.id} />
          </div>
        </td>
      )}
    </>
  );

  const { page, sortBy, sortOrder, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.StudentWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "teacherId":
            query.class = {
              lessons: {
                some: {
                  teacherId: value,
                },
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
          case "class":
            if (value !== "all") {
              query.classId = parseInt(value);
            }
            break;
          case "grade":
            if (value !== "all") {
              query.gradeId = parseInt(value);
            }
            break;
          case "status":
            // Add status filtering logic if needed
            break;
          default:
            break;
        }
      }
    }
  }

  // Sorting logic
  let orderBy: Prisma.StudentOrderByWithRelationInput = { createdAt: 'desc' };
  
  if (sortBy) {
    switch (sortBy) {
      case 'name':
        orderBy = { name: sortOrder as 'asc' | 'desc' };
        break;
      case 'email':
        orderBy = { email: sortOrder as 'asc' | 'desc' };
        break;
      case 'class':
        orderBy = { class: { name: sortOrder as 'asc' | 'desc' } };
        break;
      case 'createdAt':
        orderBy = { createdAt: sortOrder as 'asc' | 'desc' };
        break;
      default:
        break;
    }
  }

  // Get classes and grades for filter options
  const [classes, grades] = await Promise.all([
    prisma.class.findMany({
      select: { id: true, name: true, _count: { select: { students: true } } },
      orderBy: { name: 'asc' }
    }),
    prisma.grade.findMany({
      select: { id: true, level: true, _count: { select: { students: true } } },
      orderBy: { level: 'asc' }
    })
  ]);

  const [data, count] = await prisma.$transaction([
    prisma.student.findMany({
      where: query,
      include: {
        class: true,
        grade: true,
      },
      orderBy,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.student.count({ where: query }),
  ]);

  return (
    <div className="content-area">
      {/* Modern Header */}
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gradient">Students</h1>
            <p className="text-dark-text-secondary">
              Manage student enrollment and academic records
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-dark-secondary/80 backdrop-blur-xl rounded-xl p-1 border border-dark-border-secondary">
            {role === "admin" && (
              <FormContainer table="student" type="create" />
            )}
          </div>
        </div>
      </div>

      {/* Search/Filter/Sort Section */}
      <TableControls
        searchPlaceholder="Search students by name, email, or ID..."
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
                count: c._count.students
              }))
            ]
          },
          {
            key: 'grade',
            label: 'Grade Level',
            type: 'single',
            options: [
              { label: 'All Grades', value: 'all' },
              ...grades.map(g => ({
                label: `Grade ${g.level}`,
                value: g.id.toString(),
                count: g._count.students
              }))
            ]
          }
        ]}
        sortOptions={[
          { label: 'Name A-Z', value: 'name', direction: 'asc' },
          { label: 'Name Z-A', value: 'name', direction: 'desc' },
          { label: 'Email A-Z', value: 'email', direction: 'asc' },
          { label: 'Email Z-A', value: 'email', direction: 'desc' },
          { label: 'Class A-Z', value: 'class', direction: 'asc' },
          { label: 'Class Z-A', value: 'class', direction: 'desc' },
          { label: 'Newest First', value: 'createdAt', direction: 'desc' },
          { label: 'Oldest First', value: 'createdAt', direction: 'asc' }
        ]}
      />

      {/* Students Table */}
      <Table columns={columns} renderRow={renderRow} data={data} />

      {/* Pagination */}
      <div className="flex justify-center">
        <Pagination page={p} count={count} />
      </div>
    </div>
  );
};

export default StudentListPage;
