import { NextResponse } from "next/server";

export function middleware(req) {
  const language = req.cookies.get("language")?.value || "EN"; // Get language cookie
  const url = req.nextUrl.clone();

  if (language === "GR" && url.pathname === "/about") {
    url.pathname = "/sxetika"; // Redirect "/about" → "/sxetika" for Greek users
    return NextResponse.redirect(url);
  }

  if (language === "EN" && url.pathname === "/sxetika") {
    url.pathname = "/about"; // Redirect "/sxetika" → "/about" for English users
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/about", "/sxetika"], // Apply middleware to these routes
};
