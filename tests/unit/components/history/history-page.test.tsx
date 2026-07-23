import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import HistoryPage from "@/app/(user)/history/page";

// Mock AuthNavbar
vi.mock("@/components/layout/auth-navbar", () => ({
  default: () => <div data-testid="auth-navbar" />
}));

// Mock hooks
vi.mock("@/hooks/use-designs", () => ({
  useDesigns: vi.fn()
}));

vi.mock("@/lib/use-favorites", () => ({
  useFavorites: vi.fn().mockReturnValue({ count: 0 })
}));

// Mock useRouter
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush })
}));

import { useDesigns } from "@/hooks/use-designs";

// Mock globals
const mockAlert = vi.spyOn(window, "alert").mockImplementation(() => {});
const mockConfirm = vi.spyOn(window, "confirm").mockImplementation(() => true);
const mockReload = vi.fn();
Object.defineProperty(window, "location", {
  value: { reload: mockReload },
  writable: true
});

describe("HistoryPage (Manajemen Desain)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  const mockDesignData = {
    total: 1,
    designs: [
      {
        id: "design-123",
        title: "Kopi Tubruk",
        packagingType: "standing_pouch",
        createdAt: new Date().toISOString(),
        prompt: "A nice coffee pouch",
        creditsUsed: 10,
        isSaved: false,
        isPublished: false,
        imageUrl: "https://example.com/3d.png",
        thumbnailUrl: "https://example.com/thumb.png",
        status: "COMPLETED"
      }
    ]
  };

  it("TC-019: Menampilkan Empty State ketika tidak ada riwayat desain", () => {
    (useDesigns as any).mockReturnValue({
      data: { total: 0, designs: [] },
      loading: false
    });

    render(<HistoryPage />);
    expect(screen.getByText("Desain tidak ditemukan")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Buat Desain" })).toBeInTheDocument();
  });

  it("TC-004: Publish ke Gallery merubah status dan menampilkan feedback alert", async () => {
    (useDesigns as any).mockReturnValue({
      data: mockDesignData,
      loading: false
    });
    
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => ({ success: true })
    });

    render(<HistoryPage />);

    // Find publish button
    const publishBtn = screen.getByRole("button", { name: /Publish/i });
    fireEvent.click(publishBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/designs/design-123/publish", expect.objectContaining({ method: "POST" }));
      expect(mockAlert).toHaveBeenCalledWith("Successfully published to Gallery!");
      expect(mockReload).toHaveBeenCalled();
    });
  });

  it("TC-007: Toggle Favorite merubah status dan menampilkan alert", async () => {
    (useDesigns as any).mockReturnValue({
      data: mockDesignData,
      loading: false
    });
    
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => ({ success: true, data: { isSaved: true } })
    });

    render(<HistoryPage />);

    const saveBtn = screen.getByRole("button", { name: /Save/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/designs/design-123/save", expect.objectContaining({ method: "POST" }));
      expect(mockAlert).toHaveBeenCalledWith("Saved to Favorites!");
    });
  });

  it("TC-008: Menghapus desain dengan konfirmasi popup", async () => {
    (useDesigns as any).mockReturnValue({
      data: mockDesignData,
      loading: false
    });
    
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => ({ success: true })
    });

    render(<HistoryPage />);

    // In the overlay there is a button with title="Delete"
    const deleteBtn = screen.getByTitle("Delete");
    fireEvent.click(deleteBtn);

    expect(mockConfirm).toHaveBeenCalledWith("Are you sure you want to delete this design?");

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/designs/design-123", expect.objectContaining({ method: "DELETE" }));
      expect(mockReload).toHaveBeenCalled();
    });
  });

  it("TC-009: Download 3D/2D mockup", () => {
    (useDesigns as any).mockReturnValue({
      data: mockDesignData,
      loading: false
    });

    const mockClick = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    const mockAppendChild = vi.spyOn(document.body, "appendChild");
    const mockRemoveChild = vi.spyOn(document.body, "removeChild");

    render(<HistoryPage />);

    const downloadBtn = screen.getByTitle("Download");
    fireEvent.click(downloadBtn);

    // Verify anchor element is appended, clicked, and removed
    expect(mockAppendChild).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();
    expect(mockRemoveChild).toHaveBeenCalled();
    
    mockClick.mockRestore();
    mockAppendChild.mockRestore();
    mockRemoveChild.mockRestore();
  });
});
