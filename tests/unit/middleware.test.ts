import { describe, it, expect, vi, beforeEach } from "vitest";
import { middleware } from "@/middleware";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

vi.mock("next-auth/jwt", () => ({
  getToken: vi.fn(),
}));

describe("Middleware (TC-011)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Mengarahkan pengguna ke login jika mengakses /generate saat belum login", async () => {
    // Mock user is NOT logged in
    (getToken as any).mockResolvedValue(null);

    const req = new NextRequest(new URL("http://localhost:3000/generate"));
    
    // Simulate process.env.NODE_ENV for the test if needed, but it checks header for E2E
    const response = await middleware(req);

    // Expecting a redirect
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost:3000/login");
  });

  it("Meneruskan pengguna ke /generate jika sudah login", async () => {
    // Mock user IS logged in
    (getToken as any).mockResolvedValue({ name: "Test User" });

    const req = new NextRequest(new URL("http://localhost:3000/generate"));
    
    const response = await middleware(req);

    // NextResponse.next() doesn't have a status 307
    expect(response.status).toBe(200);
  });
});
