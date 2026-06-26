import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  return response
    .status(200)
    .json({ message: "Alunos do curso.dev são pessoas incríveis!" });
}
