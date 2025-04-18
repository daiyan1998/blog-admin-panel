import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const generateAccessAndRefreshToken = async (user) => {
  try {
    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    const refreshToken = jwt.sign(
      {
        id: user.id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Save refreshToken with current user
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: refreshToken,
      },
    });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany();
  res.status(200).json({ data: users });
});

const createUser = asyncHandler(async (req, res) => {
  let { name, email, password, role } = req.body;
  const filePath = req.file?.path.replace(/\\/, "/");
  const fileUrl = req.file
    ? `${req.protocol}://${req.get("host")}/${filePath}`
    : "";

  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password, salt);
  password = hash;

  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const user = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: password,
      role: role || "USER",
    },
  });
  const { accessToken } = generateAccessAndRefreshToken(user);

  const oneDay = 24 * 60 * 60 * 1000;
  return res
    .status(200)
    .cookie("accessToken", accessToken, { httponly: true, maxage: oneDay })
    .json({
      message: "User created successfully",
      user: user,
    });
});

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let { name, email, password, role, img } = req.body;

  const user = await prisma.user.findUnique({
    where: { id: id },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const filePath = req.file?.path.replace(/\\/, "/");
  const fileUrl = `${req.protocol}://${req.get("host")}/${filePath}`;

  if (password) {
    let salt = bcrypt.genSalt(10);
    let hash = bcrypt.hash(password, salt);
    password = hash;
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      name: name || undefined,
      email: email || undefined,
      password: password || undefined,
      role: role || undefined,
      // img: fileUrl || img || undefined,
    },
  });

  res
    .status(200)
    .json({ message: "User updated successfully", user: updatedUser });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await prisma.user.delete({
    where: {
      id: id,
    },
  });
  res.status(200).json({ message: "User deleted successfully", result });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  // Check if user exists
  if (!user) {
    throw new Error("User not found");
  }

  const validPassword = bcrypt.compareSync(password, user?.password);
  if (user && validPassword) {
    // Create jwt token
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user
    );

    // Store cookie
    const day = 72 * 60 * 60 * 1000;

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: day,
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "User logged in successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  } else {
    throw new ApiError(404, "Email or password is incorrect");
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  await prisma.user.update({
    where: {
      id: req.user.id,
    },
    data: {
      refreshToken: null,
    },
  });
  const day = 72 * 60 * 60 * 1000;
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: day,
  };
  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({ message: "User logged out successfully" });
});

// const refreshAccessToken = asyncHandler(async (req, _) => {
//   const incomingRefreshToken = req.cookies?.refreshToken;
//   if (!incomingRefreshToken) {
//     throw new ApiError(401, "Unauthorized request");
//   }

//   const decodedToken = jwt.verify(
//     incomingRefreshToken,
//     process.env.REFRESH_TOKEN_SECRET
//   );
// });
export {
  createUser,
  loginUser,
  logoutUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
