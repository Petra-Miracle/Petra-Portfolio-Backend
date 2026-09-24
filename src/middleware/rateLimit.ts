import rateLimit from "express-rate-limit";

/** Throttles login attempts to blunt password brute-forcing — 10 tries per 15 minutes per IP. */
export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Terlalu banyak percobaan login. Coba lagi nanti." },
});
