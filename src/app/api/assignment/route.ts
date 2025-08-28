import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { sessionClaims } = auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    if (role !== "admin" && role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, startDate, dueDate, lessonId } = body;

    const assignment = await prisma.assignment.create({
      data: {
        title,
        startDate: new Date(startDate),
        dueDate: new Date(dueDate),
        lessonId: parseInt(lessonId),
      },
    });

    return NextResponse.json(assignment);
  } catch (error) {
    console.error("Error creating assignment:", error);
    return NextResponse.json(
      { error: "Failed to create assignment" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { sessionClaims } = auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    if (role !== "admin" && role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, startDate, dueDate, lessonId } = body;

    const assignment = await prisma.assignment.update({
      where: { id: parseInt(id) },
      data: {
        title,
        startDate: new Date(startDate),
        dueDate: new Date(dueDate),
        lessonId: parseInt(lessonId),
      },
    });

    return NextResponse.json(assignment);
  } catch (error) {
    console.error("Error updating assignment:", error);
    return NextResponse.json(
      { error: "Failed to update assignment" },
      { status: 500 }
    );
  }
}