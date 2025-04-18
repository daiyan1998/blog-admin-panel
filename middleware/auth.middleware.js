import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//TODO: make sure token is working correctly
export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken?.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Token has expired");
    } else {
      throw new ApiError(401, "Invalid access token");
    }
  }
});

export const isAdmin = asyncHandler(async (req, res, next) => {
  const user = req.user;

  if (user && user.role === "ADMIN") {
    return next();
  } else {
    throw new ApiError(
      403,
      "Unauthorized request: Only admins are allowed to access this resource"
    );
  }
});

export const isManager = asyncHandler(async (req, res, next) => {
  const user = req.user;

  if ((user && user.role === "MANAGER") || user.role === "ADMIN") {
    return next();
  } else {
    throw new ApiError(
      403,
      "Unauthorized request: Only managers are allowed to access this resource"
    );
  }
});
