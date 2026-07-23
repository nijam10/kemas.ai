import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LoginPage from "@/app/(auth)/login/page";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

// Mock next-auth
vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

// Mock window.alert
const mockAlert = vi.spyOn(window, "alert").mockImplementation(() => {});

describe("LoginPage (Auth Module)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useSearchParams as any).mockReturnValue({
      get: vi.fn().mockReturnValue(null),
    });
  });

  it("TC-001: Menerima aksi klik tombol login Google dan memanggil signIn", async () => {
    render(<LoginPage />);

    const loginButton = screen.getByRole("button", { name: /Continue with Google/i });
    expect(loginButton).toBeInTheDocument();

    fireEvent.click(loginButton);

    // Verify loading state changes text
    expect(screen.getByText("Signing in…")).toBeInTheDocument();

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("google", { callbackUrl: "/dashboard" });
    });
  });

  it("TC-010: Memunculkan alert jika login dibatalkan (error=OAuthSignin)", () => {
    (useSearchParams as any).mockReturnValue({
      get: vi.fn().mockReturnValue("OAuthSignin"),
    });

    render(<LoginPage />);

    expect(mockAlert).toHaveBeenCalledWith("Login dibatalkan");
  });
});
