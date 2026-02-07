import type { VercelRequest, VercelResponse } from "@vercel/node";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { createServer } from "http";

const app = express();

app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);
app.use(express.urlencoded({ extended: false }));

let initialized = false;

async function ensureInitialized() {
  if (initialized) return;

  const { seedDatabase } = await import("./seed");
  await seedDatabase().catch((err) => console.error("Seed error:", err));

  const httpServer = createServer(app);
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error("Internal Server Error:", err);
    if (res.headersSent) {
      return next(err);
    }
    return res.status(status).json({ message });
  });

  initialized = true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await ensureInitialized();
  app(req as any, res as any);
}
