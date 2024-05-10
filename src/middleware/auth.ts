import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {JWT_SECRET} from "../utils/config";
import {UserPayload} from "../models/userPayload";
import {supabase} from "../utils/supabaseClient";



function isUserPayload(object: any): object is UserPayload {
    return object && typeof object.sub === 'string' && typeof object.email === 'string';
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (isUserPayload(decoded)) {
            res.locals.user = decoded;
            next();
        } else {
            return res.status(401).json({ message: 'Invalid token body' });
        }
    });
};
