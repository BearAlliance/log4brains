import build from "next/dist/build";
import exportApp from "next/dist/export";
import path from "path";
import { logger } from "../lib";

export async function buildCommand(outPath: string): Promise<void> {
  process.env.NEXT_TELEMETRY_DISABLED = "1";
  logger.info("Building 🧠 log4brains static website...");

  const nextDir = path.join(__dirname, "..");

  await build(nextDir);

  await exportApp(nextDir, {
    outdir: outPath
  });

  logger.info(
    `✔️ Finished! Your log4brains static website is built in ${outPath}`
  );
}
