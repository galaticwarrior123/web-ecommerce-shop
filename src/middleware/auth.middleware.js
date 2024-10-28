import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Đảm bảo đây là giá trị an toàn

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  console.log("Authorization Header:", token); // Ghi lại header Authorization

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  const tokenAuth = token.split(' ')[1];
  try {
    const decoded = jwt.verify(tokenAuth, JWT_SECRET);
    //req.userId = decoded.id;
    req.userId = decoded.user._id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default authMiddleware;

// import jwt from 'jsonwebtoken';

// const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// const authMiddleware = (req, res, next) => {
//   const token = req.header('Authorization');

//   if (!token) {
//     console.log("No token provided");
//     return res.status(401).json({ message: 'No token, authorization denied' });
//   }

//   const tokenAuth = token.split(' ')[1];
//   try {
//     const decoded = jwt.verify(tokenAuth, JWT_SECRET);
//     console.log("Decoded Token:", decoded); // Log để kiểm tra nội dung của token
//     req.user = decoded.user; // Giả định rằng 'user' chứa thông tin người dùng

//     if (!req.user) {
//       console.log("Decoded user is undefined");
//       return res.status(401).json({ message: 'User information not found' });
//     }

//     console.log("Authenticated User:", req.user); // Log để kiểm tra giá trị của req.user
//     next();
//   } catch (error) {
//     console.error("Token verification failed:", error);
//     return res.status(401).json({ message: 'Token is not valid' });
//   }
// };

// export default authMiddleware;
