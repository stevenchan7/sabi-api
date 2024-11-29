import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, HasManyGetAssociationsMixin, HasManyCreateAssociationMixin } from 'sequelize';
import sequelize from '../config/sequelize.config';
import UserAnswerGroup from './userAnswerGroup.model';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: number;
  declare fullname: string;
  declare email: string;
  declare password: string;
  declare role: 'admin' | 'student';
  declare points: number;
  declare avatarUrl: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
  declare createUserAnswerGroup: HasManyCreateAssociationMixin<UserAnswerGroup, 'userId'>;
}

User.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'student'),
      allowNull: false,
      defaultValue: 'student',
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    avatarUrl: {
      type: DataTypes.STRING,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  { modelName: 'User', sequelize, underscored: true, paranoid: true }
);

export default User;
