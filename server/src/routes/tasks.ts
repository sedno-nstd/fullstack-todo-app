import { authenticateToken, AuthRequest } from "../middleware/auth";
import { prisma } from "../prisma";
import { Router, Response } from "express";

const router = Router();

router.get("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { authorId: req.userId },
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.json(tasks);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

router.post("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, status } = req.body;

    const task = await prisma.task.create({
      data: {
        title: title,
        description: description,
        authorId: req.userId!,
        status: status,
      },
    });

    return res.status(201).json(task);
  } catch (err) {
    return res.status(500).json({ error: "Failed to create tasks" });
  }
});

router.patch(
  "/:id",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { title, description, status } = req.body;

      const existingTask = await prisma.task.findUnique({
        where: { id: Number(id) },
      });

      if (!existingTask || existingTask.authorId !== req.userId) {
        return res.status(404).json("Task not found");
      }

      const updatedTask = await prisma.task.update({
        data: {
          title: title,
          description: description,
          status: status,
        },
        where: { id: Number(id) },
      });

      return res.json(updatedTask);
    } catch (err) {
      return res.status(500).json({ error: "Failed to update tasks" });
    }
  },
);

router.delete(
  "/:id",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const existingTask = await prisma.task.findUnique({
        where: { id: Number(id) },
      });

      if (!existingTask || existingTask.authorId !== req.userId) {
        return res.status(404).json("Task not found");
      }

      await prisma.task.delete({
        where: { id: Number(id) },
      });

      return res.json({ message: "Task deleted successfully" });
    } catch (err) {
      return res.status(500).json({ error: "Failed to delete tasks" });
    }
  },
);

export default router;
