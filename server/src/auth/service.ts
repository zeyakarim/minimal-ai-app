import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Users } from "./model";
import { sequelize } from '../db/config';

interface SignUpPayload {
    username: string;
    password: string;
    email: string;
}

interface LoginPayload {
    email: string;
    password: string;
}

const signUpService = async (payload: SignUpPayload) => {
    const transaction = await sequelize.transaction();
    const { username, password, email } = payload;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await Users.findOne({ where: { email }, transaction });
        if (user) throw new Error('Email already exists')

        const createdUser = await Users.create(
            { username, password: hashedPassword, email },
            { transaction }
        );

        await transaction.commit();
        return createdUser;
    } catch (error) {
        await transaction.rollback();
        console.error('Error in creating user : ', error);
        throw error;
    }
};

const loginService = async (payload: LoginPayload) => {
    const { email, password } = payload;
    try {
        const user = await Users.findOne({ where: { email } });
        if (!user) {
            throw new Error('User not found')
        }
        const isPasswordValid = await bcrypt.compare(password, user.getDataValue('password'));
        if (!isPasswordValid) {
            throw new Error('Invalid Credentials')
        }
        const token = jwt.sign(
            { id: user.getDataValue('id') }, 
            process.env.JWT_SECRET as string, 
            { expiresIn: '1h' }
        );

        return token;
    } catch (error) {
        console.error('Error in login : ', error);
        throw error;
    }
};

export { 
    signUpService,
    loginService 
}