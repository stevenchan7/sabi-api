import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, HasManyGetAssociationsMixin, ForeignKey } from 'sequelize';
import sequelize from '../config/sequelize.config';
import User from './user.model';

class UserAnswerGroup extends Model<InferAttributes<UserAnswerGroup>, InferCreationAttributes<UserAnswerGroup>> {
  declare id: number;
  declare userId: ForeignKey<User['id']>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
}

UserAnswerGroup.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  { modelName: 'UserAnswerGroup', sequelize, underscored: true, paranoid: true }
);

export default UserAnswerGroup;
