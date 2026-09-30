import type { NextApiRequest, NextApiResponse } from "next";

import database from 'infra/database';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const updatedAt = new Date().toISOString();

  // #region Database
  const databaseName = process.env.POSTGRES_DB;

  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersion = databaseVersionResult.rows[0].server_version;

  const maxConnectionsResult = await database.query("SHOW max_connections;");
  const maxConnections = parseInt(maxConnectionsResult.rows[0].max_connections);

  const openedConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const openedConnections = openedConnectionsResult.rows[0].count;
  // #endregion

  return response
    .status(200)
    .json({
      updated_at: updatedAt,
      dependencies: {
        database: {
          version: databaseVersion,
          max_connections: maxConnections,
          opened_connections: openedConnections,
        },
      }
    });
}
