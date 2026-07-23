import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import GalleryPage from "@/app/gallery/page";

// Mock AuthNavbar
vi.mock("@/components/layout/auth-navbar", () => ({
  default: () => <div data-testid="auth-navbar" />
}));

// Mock useFavorites
vi.mock("@/lib/use-favorites", () => ({
  useFavorites: vi.fn().mockReturnValue({
    favoriteIds: new Set(),
    isFavorite: () => false,
    toggleFavorite: vi.fn()
  })
}));

// Mock useToast
vi.mock("@/hooks/use-toast", () => ({
  useToast: vi.fn().mockReturnValue({
    toast: vi.fn(),
    toasts: []
  })
}));

describe("GalleryPage (Pencarian & Filter Template)", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    
    // Mock window.location.href setter
    delete (window as any).location;
    window.location = { ...originalLocation, href: "" };
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  const mockGalleryData = {
    success: true,
    data: {
      templates: [
        {
          id: "tpl-1",
          title: "Kopi Nusantara",
          category: "beverages",
          packagingType: "STANDING_POUCH",
          previewImageUrl: "https://example.com/kopi.png",
          promptPreset: "Premium coffee packaging with traditional indonesian motifs",
          styleTags: ["premium", "traditional"],
          isFeatured: true,
          createdAt: new Date().toISOString()
        },
        {
          id: "tpl-2",
          title: "Keripik Pedas",
          category: "snacks",
          packagingType: "BAG",
          previewImageUrl: "https://example.com/keripik.png",
          promptPreset: "Spicy snack packaging with red fire accents",
          styleTags: ["spicy", "modern"],
          isFeatured: false,
          createdAt: new Date().toISOString()
        }
      ]
    }
  };

  it("TC-017: Sistem menampilkan galeri dan gambar template kemasan dengan baik", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => mockGalleryData
    });

    render(<GalleryPage />);

    // Wait for fetch and UI to update
    await waitFor(() => {
      expect(screen.getByText("Kopi Nusantara")).toBeInTheDocument();
      expect(screen.getByText("Keripik Pedas")).toBeInTheDocument();
    });

    // Check images
    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThanOrEqual(2);
    expect(images[0]).toHaveAttribute("src", "https://example.com/kopi.png");
  });

  it("TC-018: Menekan 'Use This Template' men-trigger route redirection dengan param promptPreset", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => mockGalleryData
    });

    render(<GalleryPage />);

    // Wait for templates to load
    await waitFor(() => {
      expect(screen.getByText("Kopi Nusantara")).toBeInTheDocument();
    });

    // Open template detail modal by clicking the image/card
    // The TemplateCard makes the whole wrapper clickable, we can click the title or image
    const cardTitle = screen.getByText("Kopi Nusantara");
    fireEvent.click(cardTitle);

    // Verify modal appears
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    // Click "Use This Template"
    const useBtn = screen.getByRole("button", { name: /Use This Template/i });
    fireEvent.click(useBtn);

    // Assert window.location.href changes
    const expectedUrl = "/generate?promptPreset=Premium%20coffee%20packaging%20with%20traditional%20indonesian%20motifs&packagingType=standing-pouch";
    expect(window.location.href).toBe(expectedUrl);
  });
});
