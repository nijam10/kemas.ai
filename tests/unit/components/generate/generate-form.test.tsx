import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import GeneratePage from "@/app/(user)/generate/page";

// Mock AuthNavbar because it might require Session context that we don't want to deal with here
vi.mock("@/components/layout/auth-navbar", () => ({
  default: () => <div data-testid="auth-navbar" />
}));

// Mock window.alert
const mockAlert = vi.spyOn(window, "alert").mockImplementation(() => {});

describe("GeneratePage (Generate AI Module)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it("TC-005: Memblokir proses jika prompt form kosong (validasi format)", async () => {
    render(<GeneratePage />);

    // Prompt default is empty
    const promptInput = screen.getByPlaceholderText(/Describe the packaging visual style.../i);
    fireEvent.change(promptInput, { target: { value: "short" } }); // less than 10 chars

    const startButton = screen.getByRole("button", { name: /Start Generation/i });
    fireEvent.click(startButton);

    expect(mockAlert).toHaveBeenCalledWith("Prompt must be at least 10 characters");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("TC-006: Memunculkan notifikasi insufisien kredit saat saldo tidak cukup", async () => {
    // Mock /api/generate failing due to insufficient credit
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => ({ success: false, error: "Insufficient credits" })
    });

    render(<GeneratePage />);

    const promptInput = screen.getByPlaceholderText(/Describe the packaging visual style.../i);
    fireEvent.change(promptInput, { target: { value: "A premium coffee packaging design with dark background" } });

    const startButton = screen.getByRole("button", { name: /Start Generation/i });
    fireEvent.click(startButton);

    // Expect failed screen directly because mock fetch resolves immediately and skips PROCESSING

    // Then expect failed screen
    await waitFor(() => {
      expect(screen.getByText("Generation Failed")).toBeInTheDocument();
      expect(screen.getByText("Insufficient credits")).toBeInTheDocument();
    });
  });

  it("TC-002 & TC-003: Menerima form, memanggil API, memotong kredit (mocked), dan polling UI 3D Canvas", async () => {
    // 1st fetch: /api/generate
    // 2nd fetch: /api/status/123 (PROCESSING)
    // 3rd fetch: /api/status/123 (COMPLETED)
    
    (global.fetch as any)
      .mockResolvedValueOnce({
        json: async () => ({ success: true, data: { jobId: "job-123" } })
      })
      .mockResolvedValueOnce({
        json: async () => ({ data: { status: "processing" } })
      })
      .mockResolvedValueOnce({
        json: async () => ({
          data: {
            status: "completed",
            master_wrapper_url: "https://example.com/2d.png",
            front_mockup_url: "https://example.com/3d.png"
          }
        })
      });

    // Mock Image object for preloading
    const originalImage = window.Image;
    window.Image = class {
      onload: any;
      src: string = "";
      constructor() {
        setTimeout(() => this.onload && this.onload(), 10);
      }
    } as any;

    render(<GeneratePage />);

    const promptInput = screen.getByPlaceholderText(/Describe the packaging visual style.../i);
    fireEvent.change(promptInput, { target: { value: "A beautiful tea packaging design with green leaves" } });

    const startButton = screen.getByRole("button", { name: /Start Generation/i });
    fireEvent.click(startButton);

    // Assert /api/generate is called (TC-002)
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/generate", expect.any(Object));
      expect(screen.getByText(/Processing Your Packaging/i)).toBeInTheDocument();
    });

    // Fast-forward or just wait for polling
    await waitFor(() => {
      // Assert it eventually reaches completed screen and shows 2D and 3D mockups (TC-003)
      expect(screen.getByText("Generation Complete")).toBeInTheDocument();
      
      const images = screen.getAllByRole("img");
      expect(images.length).toBeGreaterThanOrEqual(2);
    }, { timeout: 5000 }); // Since polling is 2s

    window.Image = originalImage;
  });
});
