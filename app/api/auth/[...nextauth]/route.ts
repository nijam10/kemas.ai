/**
 * Auth.js v5 — catch-all route handler
 * Handles all /api/auth/* requests (signin, signout, callback, session, etc.)
 */

import { handlers } from "@/auth";

export const { GET, POST } = handlers;
