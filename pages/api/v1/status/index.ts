import type { NextApiRequest, NextApiResponse } from "next";

import database from '../../../../infra/database';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const result = await database.query("SELECT 1 + 1 as sum;");

  console.log(result.rows);

  return response
    .status(200)
    .json({ message: "Alunos do curso.dev são pessoas incríveis!" });
}
