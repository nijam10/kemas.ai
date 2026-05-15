/**
 * Design Service
 * Read-only queries for user-generated packaging designs.
 */

import { prisma } from "@/lib/prisma";
import type { Design, DesignStatus, PackagingType } from "@prisma/client";

export interface DesignFilters {
  status?: DesignStatus;
  packagingType?: PackagingType;
  savedOnly?: boolean;
}

export interface PaginatedDesigns {
  designs: Design[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class DesignService {
  /**
   * Get all designs for a user, newest first.
   * Supports optional status/type filters and pagination.
   */
  async getDesignsByUserId(
    userId: string,
    filters: DesignFilters = {},
    page = 1,
    pageSize = 20
  ): Promise<PaginatedDesigns> {
    const where = {
      userId,
      ...(filters.status && { status: filters.status }),
      ...(filters.packagingType && { packagingType: filters.packagingType }),
      ...(filters.savedOnly && { isSaved: true }),
    };

    const [designs, total] = await Promise.all([
      prisma.design.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.design.count({ where }),
    ]);

    return {
      designs,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Get a single design by ID.
   */
  async getDesignById(id: string): Promise<Design | null> {
    return prisma.design.findUnique({ where: { id } });
  }

  /**
   * Get a design by ID, only if it belongs to the given user.
   */
  async getDesignByIdForUser(id: string, userId: string): Promise<Design | null> {
    return prisma.design.findFirst({ where: { id, userId } });
  }
}

export const designService = new DesignService();
