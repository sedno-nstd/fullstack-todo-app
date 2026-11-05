import e, { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma";

const authRoutes = Router();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

authRoutes.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json("Invalid Email or password");
    }

    const existUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existUser) {
      return res.status(400).json({ error: "User already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email: email, password: hashedPassword },
    });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to register" });
  }
});

authRoutes.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json("User not found, try again");
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    return res.status(500).json({ error: "Failed to register" });
  }
});

export default authRoutes;
