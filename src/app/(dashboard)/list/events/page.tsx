import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableControls from "@/components/TableControls";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Class, Event, Prisma } from "@prisma/client";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";

type EventList = Event & { class: Class };

const EventListPage = async ({
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
      header: "Date",
      accessor: "date",
      className: "hidden md:table-cell",
    },
    {
      header: "Time",
      accessor: "time",
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

  const renderRow = (item: EventList) => (
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold text-dark-text-primary hover:text-brand-primary transition-colors duration-200">
              {item.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
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
                Event
              </span>
              {item.description && (
                <span className="text-xs text-dark-text-tertiary truncate max-w-xs">
                  {item.description.substring(0, 40)}...
                </span>
              )}
            </div>
          </div>
        </div>
      </td>
      <td className="hidden md:table-cell px-6 py-4 text-sm text-dark-text-primary">
        {item.class ? (
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
        ) : (
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
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            All Classes
          </span>
        )}
      </td>
      <td className="hidden md:table-cell px-6 py-4 text-sm text-dark-text-primary">
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
            }).format(item.startTime)}
          </span>
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              {item.startTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
              {" - "}
              {item.endTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
          </div>
          <div className="text-xs text-dark-text-tertiary">
            Duration:{" "}
            {Math.round(
              (item.endTime.getTime() - item.startTime.getTime()) / (1000 * 60)
            )}{" "}
            min
          </div>
        </div>
      </td>
      {role === "admin" && (
        <td className="px-6 py-4 text-sm text-dark-text-primary">
          <div className="flex items-center gap-2">
            <FormContainer table="event" type="update" id={item.id} />
            <FormContainer table="event" type="delete" id={item.id} />
          </div>
        </td>
      )}
    </>
  );

  const { page, sortBy, sortOrder, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.EventWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { title: { contains: value, mode: "insensitive" } },
              { description: { contains: value, mode: "insensitive" } },
            ];
            break;
          case "classId":
            if (value !== "all") {
              query.classId = parseInt(value);
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
    teacher: { lessons: { some: { teacherId: currentUserId! } } },
    student: { students: { some: { id: currentUserId! } } },
    parent: { students: { some: { parentId: currentUserId! } } },
  };

  if (role !== "admin") {
    query.OR = [
      { classId: null },
      {
        class: roleConditions[role as keyof typeof roleConditions] || {},
      },
    ];
  }

  // Sorting logic
  let orderBy: Prisma.EventOrderByWithRelationInput = { startTime: 'asc' };
  
  if (sortBy) {
    switch (sortBy) {
      case 'title':
        orderBy = { title: sortOrder as 'asc' | 'desc' };
        break;
      case 'date':
        orderBy = { startTime: sortOrder as 'asc' | 'desc' };
        break;
      case 'startTime':
        orderBy = { startTime: sortOrder as 'asc' | 'desc' };
        break;
      case 'endTime':
        orderBy = { endTime: sortOrder as 'asc' | 'desc' };
        break;
      case 'id':
        orderBy = { id: sortOrder as 'asc' | 'desc' };
        break;
      default:
        break;
    }
  }

  // Get classes for filter options
  const classes = await prisma.class.findMany({
    select: { id: true, name: true, _count: { select: { events: true } } },
    orderBy: { name: 'asc' }
  });

  const [data, count] = await prisma.$transaction([
    prisma.event.findMany({
      where: query,
      include: {
        class: true,
      },
      orderBy,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.event.count({ where: query }),
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gradient">Events</h1>
            <p className="text-dark-text-secondary">
              Manage school events and special occasions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-dark-secondary/80 backdrop-blur-xl rounded-xl p-1 border border-dark-border-secondary">
            {role === "admin" && <FormContainer table="event" type="create" />}
          </div>
        </div>
      </div>

      {/* Search/Filter/Sort Section */}
      <TableControls
        searchPlaceholder="Search events by title or description..."
        totalCount={count}
        filters={[
          {
            key: 'classId',
            label: 'Class',
            type: 'single',
            options: [
              { label: 'All Classes', value: 'all' },
              ...classes.map(c => ({
                label: c.name,
                value: c.id.toString(),
                count: c._count.events
              }))
            ]
          }
        ]}
        sortOptions={[
          { label: 'Title A-Z', value: 'title', direction: 'asc' },
          { label: 'Title Z-A', value: 'title', direction: 'desc' },
          { label: 'Date Earliest', value: 'date', direction: 'asc' },
          { label: 'Date Latest', value: 'date', direction: 'desc' },
          { label: 'Start Time Earliest', value: 'startTime', direction: 'asc' },
          { label: 'Start Time Latest', value: 'startTime', direction: 'desc' },
          { label: 'End Time Earliest', value: 'endTime', direction: 'asc' },
          { label: 'End Time Latest', value: 'endTime', direction: 'desc' },
          { label: 'ID (High-Low)', value: 'id', direction: 'desc' },
          { label: 'ID (Low-High)', value: 'id', direction: 'asc' }
        ]}
      />

      {/* Events Table */}
      <Table columns={columns} renderRow={renderRow} data={data} />

      {/* Pagination */}
      <div className="flex justify-center">
        <Pagination page={p} count={count} />
      </div>
    </div>
  );
};

export default EventListPage;
