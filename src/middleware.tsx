import { NextResponse, type NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import { availableRoles } from "./types/role";

type DecodeJWT = {
  Email: string;
  Role: string;
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  let decodeJWT;
  if (token) {
    decodeJWT = jwtDecode(token) as DecodeJWT;
  }
  const role = decodeJWT ? decodeJWT.Role : "";

  if (
    (request.nextUrl.pathname.startsWith("/profile") ||
      request.nextUrl.pathname.startsWith("/cart") ||
      request.nextUrl.pathname.startsWith("/chat")) &&
    !token &&
    !availableRoles.includes(role)
  ) {
    return NextResponse.redirect(request.nextUrl.origin + "/");
  }

  if (
    (request.nextUrl.pathname.startsWith("/profile") ||
      request.nextUrl.pathname.startsWith("/cart") ||
      request.nextUrl.pathname.startsWith("/chat")) &&
    token &&
    !["User", "Doctor"].includes(role)
  ) {
    return NextResponse.redirect(request.nextUrl.origin + "/");
  }

  if (
    request.nextUrl.pathname.startsWith("/cart") &&
    token &&
    role === "Doctor"
  ) {
    return NextResponse.redirect(request.nextUrl.origin + "/");
  }

  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    !role.toLowerCase().includes("admin")
  ) {
    return NextResponse.redirect(request.nextUrl.origin + "/");
  }

  if (
    request.nextUrl.pathname.startsWith("/admin/profile") &&
    !role.toLowerCase().includes("pharmacy")
  ) {
    return NextResponse.redirect(request.nextUrl.origin + "/admin");
  }

  if (
    [
      "/admin/manage-doctors",
      "/admin/manage-users",
      "/admin/manage-products-categories",
    ].includes(request.nextUrl.pathname) &&
    role !== "Admin"
  ) {
    return NextResponse.redirect(request.nextUrl.origin + "/");
  }

  if (
    ["/auth/login", "/auth/register"].includes(request.nextUrl.pathname) &&
    token
  ) {
    return NextResponse.redirect(request.nextUrl.origin + "/");
  }

  return NextResponse.next();
}
