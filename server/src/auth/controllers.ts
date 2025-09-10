import { Request, Response } from "express";
import { loginService, signUpService } from "./service";

export const signUp = async (req: Request, res: Response) => {
    try {
        const user = await signUpService(req?.body);
        res.status(201).json({ success: true, message: 'User created successfully' });
    } catch (error) {
        const errorMessage = error instanceof Error ? error?.message : 'Error in creating user';
        res.status(500).json({ success: false, message: errorMessage });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const token = await loginService(req?.body)
        res.status(200).json({ success: true, message: 'Login successful', token });
    } catch (error) {
        const errorMessage = error instanceof Error ? error?.message : 'Error in Login';
        res.status(500).json({ success: false, message: errorMessage });
    }
};