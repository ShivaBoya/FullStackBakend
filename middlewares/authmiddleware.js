// const jwt = require("jsonwebtoken");

// const authMiddleware = (role) => {
//   return (req, res, next) => {
//     const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
    
//     if (!token) {
//       return res.status(401).json({ message: "No token provided" });
//     }

//     try {
        
//       const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

//       if (!decoded) {
//         return res.status(401).json({ message: "Token decoding failed" });
//       }

//       // If role is passed, check it
//       if (role && !role.includes(decoded.role)) {
//         return res.status(403).json({ message: "Unauthorized: Insufficient permissions" });
//       }

//       // Attach userId to request
//       req.userId = decoded.userId;
//       req.userRole = decoded.role;
//       next();
//     } catch (err) {
//         //console.log(err)
//         if(err.message === "jwt expired"){
//             res.status(403).json({message:"Token Expired , Please login Again"})
//         }else{
//             return res.status(401).json({ message: "Invalid token", error: err.message });
//         }
//     }
//   };
// };

// module.exports = authMiddleware;


const jwt = require("jsonwebtoken");

const authMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <access_token>

    try {
      
      if (!token) {
        return res.status(401).json({ message: "No access token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      // Role check
      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "Unauthorized: Insufficient permissions" });
      }

      req.userId = decoded.userId;
      req.userRole = decoded.role;
      next();
    } catch (err) {
      if (err.message === "jwt expired") {
        // Try verifying the refresh token
        const refreshToken = req.headers.refreshtoken?.split(" ")[1]; // Refresh <token>
        if (!refreshToken) {
          return res.status(403).json({ message: "Access token expired. Refresh token missing." });
        }

        try {
          const refreshDecoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);

          // Issue new access token
          const newAccessToken = jwt.sign(
            { userId: refreshDecoded.userId, role: refreshDecoded.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: 3000 } // 30 seconds or adjust as needed
          );

          // Attach info to request
          req.userId = refreshDecoded.userId;
          req.userRole = refreshDecoded.role;

          // Also send new token in header for client to update
          res.setHeader("new-access-token", newAccessToken);

          next();
        } catch (refreshErr) {
          return res.status(403).json({ message: "Refresh token expired or invalid" });
        }
      } else {
        return res.status(401).json({ message: "Invalid token", error: err.message });
      }
    }
  };
};

module.exports = authMiddleware;
