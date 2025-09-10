import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: {
        id: string;
    };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req?.headers?.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'Authentication failed: No token provided' });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        req.user = { id: decodedToken.id };
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Authentication failed: Invalid token' });
    }
};