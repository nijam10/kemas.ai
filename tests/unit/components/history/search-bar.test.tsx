import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import HistoryPage from "@/app/(user)/history/page";
import { useDesigns } from "@/hooks/use-designs";

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
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() })
}));

describe("HistoryPage Search & Filter (Pencarian & Filter Template)", () => {
  const mockDesignData = {
    total: 2,
    designs: [
      {
        id: "design-1",
        title: "Kopi Hitam",
        packagingType: "standing_pouch",
        createdAt: new Date().toISOString(),
        prompt: "Dark coffee packaging",
        creditsUsed: 10,
        isSaved: false,
        isPublished: false,
        imageUrl: "https://example.com/1.png",
        thumbnailUrl: "https://example.com/thumb1.png",
        status: "COMPLETED"
      },
      {
        id: "design-2",
        title: "Teh Hijau",
        packagingType: "box",
        createdAt: new Date().toISOString(),
        prompt: "Green tea box design",
        creditsUsed: 10,
        isSaved: false,
        isPublished: false,
        imageUrl: "https://example.com/2.png",
        thumbnailUrl: "https://example.com/thumb2.png",
        status: "COMPLETED"
      }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("TC-012: Filter real-time grid desain berdasarkan kata kunci relevan", async () => {
    (useDesigns as any).mockReturnValue({
      data: mockDesignData,
      loading: false
    });

    render(<HistoryPage />);

    // Initially both should be visible
    expect(screen.getAllByText("Kopi Hitam").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Teh Hijau").length).toBeGreaterThan(0);

    const searchInput = screen.getByPlaceholderText(/Cari desain.../i);
    
    // Type "Kopi"
    fireEvent.change(searchInput, { target: { value: "Kopi" } });

    await waitFor(() => {
      expect(screen.getAllByText("Kopi Hitam").length).toBeGreaterThan(0);
      expect(screen.queryAllByText("Teh Hijau").length).toBe(0);
    });

    // Type "Teh"
    fireEvent.change(searchInput, { target: { value: "Teh" } });

    await waitFor(() => {
      expect(screen.getAllByText("Teh Hijau").length).toBeGreaterThan(0);
      expect(screen.queryAllByText("Kopi Hitam").length).toBe(0);
    });
  });

  it("TC-013: Empty State muncul jika kata kunci tidak valid", async () => {
    (useDesigns as any).mockReturnValue({
      data: mockDesignData,
      loading: false
    });

    render(<HistoryPage />);

    const searchInput = screen.getByPlaceholderText(/Cari desain.../i);
    
    // Type something that doesn't exist
    fireEvent.change(searchInput, { target: { value: "Susu Coklat" } });

    await waitFor(() => {
      expect(screen.queryAllByText("Kopi Hitam").length).toBe(0);
      expect(screen.queryAllByText("Teh Hijau").length).toBe(0);
      expect(screen.getByText("Desain tidak ditemukan")).toBeInTheDocument();
    });
  });
});
