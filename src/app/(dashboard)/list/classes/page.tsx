import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableControls from "@/components/TableControls";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Class, Prisma, Teacher } from "@prisma/client";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";

type ClassList = Class & { supervisor: Teacher };

const ClassListPage = async ({
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
      header: "Capacity",
      accessor: "capacity",
      className: "hidden md:table-cell",
    },
    {
      header: "Grade",
      accessor: "grade",
      className: "hidden md:table-cell",
    },
    {
      header: "Supervisor",
      accessor: "supervisor",
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

  const renderRow = (item: ClassList) => (
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold text-dark-text-primary hover:text-brand-primary transition-colors duration-200">
              {item.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
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
                Class
              </span>
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
                    d="M12 14l9-5-9-5-9 5 9 5z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                  />
                </svg>
                Grade {item.name[0]}
              </span>
            </div>
          </div>
        </div>
      </td>
      <td className="hidden md:table-cell px-6 py-4 text-sm text-dark-text-primary">
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          {item.capacity} Students
        </span>
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
          Grade {item.name[0]}
        </span>
      </td>
      <td className="hidden lg:table-cell px-6 py-4 text-sm text-dark-text-primary">
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
              {item.supervisor.name} {item.supervisor.surname}
            </span>
            <span className="text-xs text-dark-text-tertiary">Supervisor</span>
          </div>
        </div>
      </td>
      {role === "admin" && (
        <td className="px-6 py-4 text-sm text-dark-text-primary">
          <div className="flex items-center gap-2">
            <FormContainer table="class" type="update" data={item} />
            <FormContainer table="class" type="delete" id={item.id} />
          </div>
        </td>
      )}
    </>
  );

  const { page, sortBy, sortOrder, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.ClassWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "supervisorId":
            query.supervisorId = value;
            break;
          case "search":
            query.OR = [
              { name: { contains: value, mode: "insensitive" } },
              { supervisor: { name: { contains: value, mode: "insensitive" } } },
              { supervisor: { surname: { contains: value, mode: "insensitive" } } }
            ];
            break;
          default:
            break;
        }
      }
    }
  }

  // Sorting logic
  let orderBy: Prisma.ClassOrderByWithRelationInput = { name: 'asc' };
  
  if (sortBy) {
    switch (sortBy) {
      case 'name':
        orderBy = { name: sortOrder as 'asc' | 'desc' };
        break;
      case 'capacity':
        orderBy = { capacity: sortOrder as 'asc' | 'desc' };
        break;
      case 'supervisor':
        orderBy = { supervisor: { name: sortOrder as 'asc' | 'desc' } };
        break;
      case 'id':
        orderBy = { id: sortOrder as 'asc' | 'desc' };
        break;
      default:
        break;
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.class.findMany({
      where: query,
      include: {
        supervisor: true,
      },
      orderBy,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.class.count({ where: query }),
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gradient">Classes</h1>
            <p className="text-dark-text-secondary">
              Manage class organization and student groups
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-dark-secondary/80 backdrop-blur-xl rounded-xl p-1 border border-dark-border-secondary">
            {role === "admin" && <FormContainer table="class" type="create" />}
          </div>
        </div>
      </div>

      {/* Search/Filter/Sort Section */}
      <TableControls
        searchPlaceholder="Search classes by name or supervisor..."
        totalCount={count}
        sortOptions={[
          { label: 'Name A-Z', value: 'name', direction: 'asc' },
          { label: 'Name Z-A', value: 'name', direction: 'desc' },
          { label: 'Capacity (Low-High)', value: 'capacity', direction: 'asc' },
          { label: 'Capacity (High-Low)', value: 'capacity', direction: 'desc' },
          { label: 'Supervisor A-Z', value: 'supervisor', direction: 'asc' },
          { label: 'Supervisor Z-A', value: 'supervisor', direction: 'desc' },
          { label: 'ID (High-Low)', value: 'id', direction: 'desc' },
          { label: 'ID (Low-High)', value: 'id', direction: 'asc' }
        ]}
      />

      {/* Classes Table */}
      <Table columns={columns} renderRow={renderRow} data={data} />

      {/* Pagination */}
      <div className="flex justify-center">
        <Pagination page={p} count={count} />
      </div>
    </div>
  );
};

export default ClassListPage;
