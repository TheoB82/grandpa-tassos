import { NextResponse } from "next/server";

export function middleware(req) {
    const url = req.nextUrl;
    const language = req.cookies.get("language")?.value || "EN"; // Get language from cookies

    if (language === "GR" && url.pathname === "/about") {
        return NextResponse.redirect(new URL("/sxetika", req.url));
    }

    if (language === "EN" && url.pathname === "/sxetika") {
        return NextResponse.redirect(new URL("/about", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/about", "/sxetika"], // Apply middleware only for these paths
};
