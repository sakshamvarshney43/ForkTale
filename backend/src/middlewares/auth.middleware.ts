import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/db";

//Extend Express Req
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    //check if token exist in header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized. No token provided.",
      });
    }

    //Extract Token
    const token = authHeader.split(" ")[1];

    //Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    //Find User in DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, username: true },
    });

    if (!user) {
      return res.status(401).json({
        message: "Not authorized. User not found.",
      });
    }

    //Attach user to request
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized. Invalid token.",
    });
  }
};

export const attachUserIfPresent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, username: true },
    });

    if (user) {
      req.user = user;
    }
  } catch {
    // invalid/expired token but continue without user don't block
  }
  next();
};
