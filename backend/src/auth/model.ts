import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db/config';

interface UserAttributes {
    id: string;
    username: string;
    password: string;
    email: string;

    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

type UserCreationAttributes = Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

export class Users extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: string;
    public username!: string;
    public password!: string;
    public email!: string;

    public createdAt!: Date;
    public updatedAt!: Date;
    public deletedAt?: Date;
}

Users.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    deletedAt: {
        type: DataTypes.DATE
    }
}, {
    sequelize,
    timestamps: true,
    paranoid: true,
    tableName: 'user'
});