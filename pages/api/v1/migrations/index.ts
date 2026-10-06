import { NextApiRequest, NextApiResponse } from "next";
import * as database from "infra/database";
import { join } from "node:path";
import migrationRunner, { RunnerOption } from "node-pg-migrate";
import { Client } from "pg";

const allowedMethods = ["GET", "POST"];

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (!allowedMethods.includes(request.method || "")) {
    return response.status(405).json({
      error: `Method ${request.method} not allowed`,
    });
  }

  let dbClient: Client;

  try {
    dbClient = await database.createNewClient();

    const defaultMigrationOptions: RunnerOption = {
      dbClient: dbClient,
      dryRun: true,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    if (request.method === "GET") {
      const pendingMigrations = await migrationRunner(defaultMigrationOptions);
      return response.status(200).json(pendingMigrations);
    }

    if (request.method === "POST") {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationOptions,
        dryRun: false,
      });

      if (migratedMigrations.length > 0) {
        return response.status(201).json(migratedMigrations);
      }

      return response.status(200).json(migratedMigrations);
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}
