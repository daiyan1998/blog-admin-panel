import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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
