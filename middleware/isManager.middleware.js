import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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
