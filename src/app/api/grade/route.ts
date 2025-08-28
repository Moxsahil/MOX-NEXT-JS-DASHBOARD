import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { sessionClaims } = auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    if (role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { level } = body;

    // Check if grade level already exists
    const existingGrade = await prisma.grade.findUnique({
      where: { level: parseInt(level) },
    });

    if (existingGrade) {
      return NextResponse.json(
        { error: "Grade level already exists" },
        { status: 400 }
      );
    }

    const grade = await prisma.grade.create({
      data: {
        level: parseInt(level),
      },
    });

    return NextResponse.json(grade);
  } catch (error) {
    console.error("Error creating grade:", error);
    return NextResponse.json(
      { error: "Failed to create grade" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { sessionClaims } = auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    if (role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, level } = body;

    // Check if another grade with this level exists
    const existingGrade = await prisma.grade.findFirst({
      where: {
        level: parseInt(level),
        NOT: { id: parseInt(id) },
      },
    });

    if (existingGrade) {
      return NextResponse.json(
        { error: "Grade level already exists" },
        { status: 400 }
      );
    }

    const grade = await prisma.grade.update({
      where: { id: parseInt(id) },
      data: {
        level: parseInt(level),
      },
    });

    return NextResponse.json(grade);
  } catch (error) {
    console.error("Error updating grade:", error);
    return NextResponse.json(
      { error: "Failed to update grade" },
      { status: 500 }
    );
  }
}