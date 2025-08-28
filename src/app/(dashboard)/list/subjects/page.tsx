import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableControls from "@/components/TableControls";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";

type SubjectList = Subject & { teachers: Teacher[] };

const SubjectListPage = async ({
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
      header: "Teachers",
      accessor: "teachers",
      className: "hidden md:table-cell",
    },
    {
      header: "Lessons",
      accessor: "lessons",
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

  const renderRow = (item: SubjectList) => (
    <>
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center border-2 border-white shadow-soft">
              <span className="text-white text-lg font-bold">📚</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold text-neutral-400 hover:text-primary-600 transition-colors duration-200">
              {item.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                📖 Subject
              </span>
            </div>
          </div>
        </div>
      </td>
      <td className="hidden md:table-cell px-6 py-4">
        <div className="flex flex-wrap gap-1">
          {item.teachers.length > 0 ? (
            item.teachers.slice(0, 2).map((teacher, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
              >
                👩‍🏫 {teacher.name}
              </span>
            ))
          ) : (
            <span className="text-neutral-400 text-sm">
              No teachers assigned
            </span>
          )}
          {item.teachers.length > 2 && (
            <span className="inline-flex items-center px-2 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs font-medium">
              +{item.teachers.length - 2} more
            </span>
          )}
        </div>
      </td>
      <td className="hidden lg:table-cell px-6 py-4">
        <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-medium">
          📝 Lessons Available
        </div>
      </td>
      {role === "admin" && (
        <td className="px-6 py-4 text-sm text-dark-text-primary">
          <div className="flex items-center gap-2">
            <FormContainer table="subject" type="update" id={item.id} />
            <FormContainer table="subject" type="delete" id={item.id} />
          </div>
        </td>
      )}
    </>
  );

  const { page, sortBy, sortOrder, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.SubjectWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { name: { contains: value, mode: "insensitive" } },
              { teachers: { some: { name: { contains: value, mode: "insensitive" } } } },
              { teachers: { some: { surname: { contains: value, mode: "insensitive" } } } }
            ];
            break;
          default:
            break;
        }
      }
    }
  }

  // Sorting logic
  let orderBy: Prisma.SubjectOrderByWithRelationInput = { name: 'asc' };
  
  if (sortBy) {
    switch (sortBy) {
      case 'name':
        orderBy = { name: sortOrder as 'asc' | 'desc' };
        break;
      case 'id':
        orderBy = { id: sortOrder as 'asc' | 'desc' };
        break;
      default:
        break;
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.subject.findMany({
      where: query,
      include: {
        teachers: true,
      },
      orderBy,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.subject.count({ where: query }),
  ]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl">
            <span className="text-white text-2xl">📚</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gradient">Subjects</h1>
            <p className="text-neutral-600 mt-1">
              Manage academic subjects and curriculum
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/60 backdrop-blur-lg px-4 py-2 rounded-xl border border-white/20 shadow-soft">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-full"></div>
              <span className="text-sm font-medium text-neutral-600">
                {count} Subjects
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search/Filter/Sort Section */}
      <TableControls
        searchPlaceholder="Search subjects by name or teacher..."
        totalCount={count}
        sortOptions={[
          { label: 'Name A-Z', value: 'name', direction: 'asc' },
          { label: 'Name Z-A', value: 'name', direction: 'desc' },
          { label: 'ID (Low-High)', value: 'id', direction: 'asc' },
          { label: 'ID (High-Low)', value: 'id', direction: 'desc' }
        ]}
      />

      {/* Subjects Table */}
      <Table columns={columns} renderRow={renderRow} data={data} />

      {/* Pagination */}
      <div className="flex justify-center">
        <Pagination page={p} count={count} />
      </div>
    </div>
  );
};

export default SubjectListPage;
