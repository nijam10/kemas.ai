import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import AdminDashboardPage from "@/app/(admin)/admin/page";
import AdminUsersPage from "@/app/(admin)/admin/users/page";
import AdminModerationPage from "@/app/(admin)/admin/moderation/page";

// Mock AdminShell (since it might include navigation/layout things we don't want to test here)
vi.mock("@/components/admin/admin-shell", () => ({
  default: ({ children, title }: { children: React.ReactNode, title: string }) => (
    <div data-testid="admin-shell">
      <h1>{title}</h1>
      {children}
    </div>
  )
}));

// Mock window.alert
const mockAlert = vi.spyOn(window, "alert").mockImplementation(() => {});

describe("Admin Dashboard & Metrics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it("TC-014: Menampilkan angka dari mock database metrics dengan sinkron dan sempurna", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => ({
        success: true,
        data: {
          totalUsers: 152,
          activeUsers: 45,
          queueCount: 12,
          suspendedUsers: 3,
          creditsDistributed: 5000,
          serverStatus: "Operational",
          recentGenerations: [],
          recentAlerts: []
        }
      })
    });

    render(<AdminDashboardPage />);

    // Initial loading state (value is "—")
    expect(screen.getAllByText("—").length).toBeGreaterThan(0);

    // Wait for stats to load
    await waitFor(() => {
      expect(screen.getByText("152")).toBeInTheDocument(); // totalUsers
      expect(screen.getByText("45")).toBeInTheDocument(); // activeUsers
      expect(screen.getByText("12")).toBeInTheDocument(); // queueCount
      expect(screen.getByText("3")).toBeInTheDocument(); // suspendedUsers
      expect(screen.getByText("5000")).toBeInTheDocument(); // creditsDistributed
      expect(screen.getByText("Operational")).toBeInTheDocument(); // serverStatus
    });
  });

  it("TC-015: Menguji tombol aksi Suspend Akun merubah status User menjadi di-suspend", async () => {
    // AdminUsersPage fetches /api/admin/users
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => ({
        success: true,
        data: {
          users: [
            {
              id: "user-1",
              name: "Budi Santoso",
              email: "budi@example.com",
              businessName: "Kopi Budi",
              credits: 100,
              status: "ACTIVE",
              joinedAt: new Date().toISOString()
            }
          ]
        }
      })
    });

    render(<AdminUsersPage />);

    // Wait for user to load
    await waitFor(() => {
      expect(screen.getByText("Budi Santoso")).toBeInTheDocument();
    });

    const suspendBtn = screen.getByRole("button", { name: /Suspend Akun/i });
    fireEvent.click(suspendBtn);

    // Verify alert is called
    expect(mockAlert).toHaveBeenCalledWith("Suspend user-1 — API not yet implemented");

    // After suspend, the status badge should say Suspended (or Suspend Akun button should disappear if it conditionally renders, but here it just changes status in state)
    // Wait for state update (it should remove the user from the ACTIVE filter or change the badge)
    await waitFor(() => {
      // In AdminUsersPage, handleSuspend changes the status to "SUSPENDED" in state.
      // The button disappears because it only shows for user.status === 'ACTIVE' or 'PENDING'.
      expect(screen.queryByRole("button", { name: /Suspend Akun/i })).not.toBeInTheDocument();
    });
  });

  it("TC-016: Menguji moderasi penghapusan visual publik permanen", async () => {
    // AdminModerationPage fetches /api/admin/moderation
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => ({
        success: true,
        data: {
          logs: [
            {
              id: "gen-1",
              type: "IMAGE",
              userName: "Siti",
              status: "PENDING",
              reason: "A nice packaging",
              designImageUrl: "https://example.com/1.png",
              createdAt: new Date().toISOString()
            }
          ]
        }
      })
    });

    render(<AdminModerationPage />);

    // Default tab is prompts, switch to images
    await waitFor(() => {
      expect(screen.getByText(/Generated Images/i)).toBeInTheDocument();
    });
    
    const imagesTabBtn = screen.getByText(/Generated Images/i);
    fireEvent.click(imagesTabBtn);

    // Wait for the generated image to appear
    await waitFor(() => {
      expect(screen.getByText("Siti")).toBeInTheDocument();
      expect(screen.getByText("A nice packaging")).toBeInTheDocument();
    });

    const hapusBtn = screen.getByRole("button", { name: /Hapus Permanen/i });
    fireEvent.click(hapusBtn);

    // Verify the item is removed from the DOM
    await waitFor(() => {
      expect(screen.queryByText("Siti")).not.toBeInTheDocument();
      expect(screen.queryByText("A nice packaging")).not.toBeInTheDocument();
      expect(screen.getByText("No images to review")).toBeInTheDocument();
    });
  });
});
