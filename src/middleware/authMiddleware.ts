// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }

//   jwt.verify(token, '', (err, decoded) => {
//     if (err) {
//       return res.status(403).json({ error: 'Forbidden' });
//     }
//     // Decoded payload contains userId
//     // You can add it to the request object to use in subsequent middleware or route handlers
//     req.userId = (decoded as { userId: number }).userId;
//     next();
//   });
// };
