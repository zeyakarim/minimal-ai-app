import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Users } from "./model";

export const signUp = async (req: Request, res: Response) => {
    const { username, password, email } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await Users.create({ username, password: hashedPassword, email });
        res.status(201).json({ success: true, message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating user' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const user = await Users.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.getDataValue('password'));
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.getDataValue('id') }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
        res.status(200).json({ success: true, message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error logging in' });
    }
}