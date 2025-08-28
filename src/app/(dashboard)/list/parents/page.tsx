import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableControls from "@/components/TableControls";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Parent, Prisma, Student } from "@prisma/client";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";

type ParentList = Parent & { students: Student[] };

const ParentListPage = async ({
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
      header: "Student Names",
      accessor: "students",
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

  const renderRow = (item: ParentList) => (
    <>
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center border-2 border-white shadow-soft">
              <span className="text-white text-lg font-bold">👨‍👩‍👧‍👦</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold text-neutral-800 hover:text-primary-600 transition-colors duration-200">
              {item.name} {item.surname}
            </h3>
            <p className="text-sm text-neutral-500 font-medium">
              {item?.email}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                👨‍👩‍👧‍👦 Parent
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                {item.students.length} Child
                {item.students.length !== 1 ? "ren" : ""}
              </span>
            </div>
          </div>
        </div>
      </td>
      <td className="hidden md:table-cell px-6 py-4">
        <div className="flex flex-wrap gap-1">
          {item.students.length > 0 ? (
            item.students.slice(0, 2).map((student, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
              >
                👨‍🎓 {student.name}
              </span>
            ))
          ) : (
            <span className="text-neutral-400 text-sm">No students</span>
          )}
          {item.students.length > 2 && (
            <span className="inline-flex items-center px-2 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs font-medium">
              +{item.students.length - 2} more
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
          <span>🏠</span>
          <span className="truncate" title={item.address}>
            {item.address || "Not provided"}
          </span>
        </div>
      </td>
      {role === "admin" && (
        <td className="px-6 py-4 text-sm text-dark-text-primary">
          <div className="flex items-center gap-2">
            <FormContainer table="parent" type="update" data={item} />
            <FormContainer table="parent" type="delete" id={item.id} />
          </div>
        </td>
      )}
    </>
  );

  const { page, sortBy, sortOrder, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.ParentWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { name: { contains: value, mode: "insensitive" } },
              { surname: { contains: value, mode: "insensitive" } },
              { email: { contains: value, mode: "insensitive" } },
              { students: { some: { name: { contains: value, mode: "insensitive" } } } }
            ];
            break;
          default:
            break;
        }
      }
    }
  }

  // Sorting logic
  let orderBy: Prisma.ParentOrderByWithRelationInput = { createdAt: 'desc' };
  
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

  const [data, count] = await prisma.$transaction([
    prisma.parent.findMany({
      where: query,
      include: {
        students: true,
      },
      orderBy,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.parent.count({ where: query }),
  ]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
            <span className="text-white text-2xl">👨‍👩‍👧‍👦</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gradient">Parents</h1>
            <p className="text-neutral-600 mt-1">
              Manage parent contacts and student relationships
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/60 backdrop-blur-lg px-4 py-2 rounded-xl border border-white/20 shadow-soft">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"></div>
              <span className="text-sm font-medium text-neutral-600">
                {count} Parents
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search/Filter/Sort Section */}
      <TableControls
        searchPlaceholder="Search parents by name, email, or student name..."
        totalCount={count}
        sortOptions={[
          { label: 'Name A-Z', value: 'name', direction: 'asc' },
          { label: 'Name Z-A', value: 'name', direction: 'desc' },
          { label: 'Email A-Z', value: 'email', direction: 'asc' },
          { label: 'Email Z-A', value: 'email', direction: 'desc' },
          { label: 'Newest First', value: 'createdAt', direction: 'desc' },
          { label: 'Oldest First', value: 'createdAt', direction: 'asc' }
        ]}
      />

      {/* Parents Table */}
      <Table columns={columns} renderRow={renderRow} data={data} />

      {/* Pagination */}
      <div className="flex justify-center">
        <Pagination page={p} count={count} />
      </div>
    </div>
  );
};

export default ParentListPage;
