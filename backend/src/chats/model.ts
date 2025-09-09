import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db/config';
import { Users } from '../auth/model';


interface ChatAttributes {
    id: string;
    role: string;
    content: string;
    userId: string; // <-- Explicitly added for type safety

    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

type ChatCreationAttributes = Optional<
    ChatAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export class Chats extends Model<ChatAttributes, ChatCreationAttributes> implements ChatAttributes {
    public id!: string;
    public role!: string;
    public content!: string;
    public userId!: string;

    public createdAt!: Date;
    public updatedAt!: Date;
    public deletedAt?: Date;
}

Chats.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE
    },
    updatedAt: {
        type: DataTypes.DATE
    },
    deletedAt: {
        type: DataTypes.DATE
    }
}, {
    sequelize,
    timestamps: true,
    paranoid: true,
    tableName: 'chats'
});

Chats.belongsTo(Users, { foreignKey: 'userId', onDelete: 'CASCADE' });
Users.hasMany(Chats, { foreignKey: 'userId' });