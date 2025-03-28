// src/app/api/login/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { password } = await req.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (password === adminPassword) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ success: false, message: "Incorrect password!" }, { status: 401 });
  }
}
