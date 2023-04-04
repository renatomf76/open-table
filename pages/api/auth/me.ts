import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const bearerToken = req.headers["authorization"] as string;
  const token = bearerToken.split(" ")[1];

  const payload = jwt.decode(token) as { email: string };

  if (!payload) {
    return res.status(401).json({
      errorMessage: "Unauthrized request",
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      city: true,
      phone: true,
    },
  });

  return res.json({ user });
}
