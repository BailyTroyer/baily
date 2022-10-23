import { NextApiResponse, NextApiRequest } from "next";
export const config = {
  api: {
    bodyParser: false,
  },
};

import { app } from "./_app";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res
      .status(405)
      .json({ error: "Sorry! This endpoint does not accept your requests." });
    return;
  }

  const users = await app.client.conversations.members({ channel: "channel" });
  return res.json(users);
}
