import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Email/phone and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Determine if identifier is email or phone
    const rawIdentifier = String(identifier ?? "").trim();
    const isEmail = rawIdentifier.includes("@");
    const emailValue = isEmail ? rawIdentifier.toLowerCase() : null;
    const phoneValue = isEmail ? null : rawIdentifier.replace(/[^0-9+]/g, "");

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          ...(emailValue ? [{ email: { equals: emailValue, mode: "insensitive" as any } }] : []),
          ...(phoneValue ? [{ phoneNumber: phoneValue }] : []),
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email or phone already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: name || "HomeFit User",
        email: emailValue,
        phoneNumber: phoneValue,
        passwordHash,
      },
    });

    return NextResponse.json(
      { id: user.id, name: user.name, email: user.email },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
