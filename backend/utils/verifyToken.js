import jwt from "jsonwebtoken";

/**
 * verifyToken middleware:
 * - checks cookie "accessToken"
 * - falls back to Authorization: Bearer <token>
 * - verifies using process.env.JWT_SECRET_KEY
 */
const verifyToken = (req, res, next) => {
  try {
    // try cookie first
    let token = req.cookies && req.cookies.accessToken;

    // fallback to Authorization header
    if (!token) {
      const authHeader = req.headers.authorization || "";
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return res
        .status(401)
        .json({ success: false, msg: "Access denied. No token provided" });
    }

    const secret = process.env.JWT_SECRET_KEY || process.env.SECRET_KEY;

    jwt.verify(token, secret, (err, user) => {
      if (err) {
        console.error("JWT verify error:", err.message);
        return res
          .status(401)
          .json({ success: false, message: "Token is invalid" });
      }

      // attach user payload to request
      req.user = user;
      next();
    });
  } catch (err) {
    console.error("verifyToken exception:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.role === "admin") {
      next();
    } else {
      return res
        .status(401)
        .json({ success: false, message: "You're not authorized to access" });
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "admin") {
      next();
    } else {
      return res
        .status(401)
        .json({ success: false, msg: "You're not authorized" });
    }
  });
};

export default verifyToken;
