import prisma from "./prisma";

// Common sort options for different entity types
export const commonSortOptions = {
  people: [
    { label: 'Name A-Z', value: 'name', direction: 'asc' as const },
    { label: 'Name Z-A', value: 'name', direction: 'desc' as const },
    { label: 'Email A-Z', value: 'email', direction: 'asc' as const },
    { label: 'Email Z-A', value: 'email', direction: 'desc' as const },
    { label: 'Newest First', value: 'createdAt', direction: 'desc' as const },
    { label: 'Oldest First', value: 'createdAt', direction: 'asc' as const }
  ],
  
  academic: [
    { label: 'Title A-Z', value: 'title', direction: 'asc' as const },
    { label: 'Title Z-A', value: 'title', direction: 'desc' as const },
    { label: 'Date (Newest)', value: 'createdAt', direction: 'desc' as const },
    { label: 'Date (Oldest)', value: 'createdAt', direction: 'asc' as const },
    { label: 'Start Time', value: 'startTime', direction: 'asc' as const },
    { label: 'End Time', value: 'endTime', direction: 'desc' as const }
  ],

  basic: [
    { label: 'Name A-Z', value: 'name', direction: 'asc' as const },
    { label: 'Name Z-A', value: 'name', direction: 'desc' as const },
    { label: 'Newest First', value: 'createdAt', direction: 'desc' as const },
    { label: 'Oldest First', value: 'createdAt', direction: 'asc' as const }
  ]
};

// Get class filter options
export const getClassFilters = async () => {
  const classes = await prisma.class.findMany({
    select: { id: true, name: true, _count: { select: { students: true } } },
    orderBy: { name: 'asc' }
  });

  return [
    { label: 'All Classes', value: 'all' },
    ...classes.map(c => ({
      label: c.name,
      value: c.id.toString(),
      count: c._count.students
    }))
  ];
};

// Get grade filter options
export const getGradeFilters = async () => {
  const grades = await prisma.grade.findMany({
    select: { id: true, level: true, _count: { select: { students: true } } },
    orderBy: { level: 'asc' }
  });

  return [
    { label: 'All Grades', value: 'all' },
    ...grades.map(g => ({
      label: `Grade ${g.level}`,
      value: g.id.toString(),
      count: g._count.students
    }))
  ];
};

// Get subject filter options
export const getSubjectFilters = async () => {
  const subjects = await prisma.subject.findMany({
    select: { id: true, name: true, _count: { select: { teachers: true } } },
    orderBy: { name: 'asc' }
  });

  return [
    { label: 'All Subjects', value: 'all' },
    ...subjects.map(s => ({
      label: s.name,
      value: s.id.toString(),
      count: s._count.teachers
    }))
  ];
};

// Common query builders
export const buildSearchQuery = (searchTerm: string, fields: string[]) => {
  return {
    OR: fields.map(field => {
      if (field.includes('.')) {
        // Handle nested field search (e.g., 'class.name')
        const [relation, subField] = field.split('.');
        return {
          [relation]: {
            [subField]: { contains: searchTerm, mode: "insensitive" as const }
          }
        };
      }
      return { [field]: { contains: searchTerm, mode: "insensitive" as const } };
    })
  };
};

// Build order by clause from sort parameters
export const buildOrderBy = (sortBy: string, sortOrder: string, entityType: 'student' | 'teacher' | 'class' | 'subject' | 'event' | 'announcement') => {
  const order = sortOrder as 'asc' | 'desc';
  
  const orderByMaps = {
    student: {
      name: { name: order },
      email: { email: order },
      class: { class: { name: order } },
      grade: { grade: { level: order } },
      createdAt: { createdAt: order }
    },
    teacher: {
      name: { name: order },
      email: { email: order },
      createdAt: { createdAt: order }
    },
    class: {
      name: { name: order },
      capacity: { capacity: order },
      grade: { grade: { level: order } },
      createdAt: { createdAt: order }
    },
    subject: {
      name: { name: order },
      createdAt: { createdAt: order }
    },
    event: {
      title: { title: order },
      startTime: { startTime: order },
      endTime: { endTime: order },
      createdAt: { createdAt: order }
    },
    announcement: {
      title: { title: order },
      date: { date: order },
      createdAt: { createdAt: order }
    }
  };

  return orderByMaps[entityType][sortBy as keyof typeof orderByMaps[typeof entityType]] || { createdAt: 'desc' as const };
};