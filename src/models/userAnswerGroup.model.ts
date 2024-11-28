import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, HasManyGetAssociationsMixin, ForeignKey, HasManyCreateAssociationMixin, NonAttribute } from 'sequelize';
import sequelize from '../config/sequelize.config';
import User from './user.model';
import UserAnswer from './userAnswer.model';

class UserAnswerGroup extends Model<InferAttributes<UserAnswerGroup>, InferCreationAttributes<UserAnswerGroup>> {
  declare id: number;
  declare userId: ForeignKey<User['id']>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
  declare userAnswers: NonAttribute<UserAnswer[]>;
  declare createUserAnswer: HasManyCreateAssociationMixin<UserAnswer, 'user_answer_group_id'>;
}

UserAnswerGroup.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  { modelName: 'UserAnswerGroup', sequelize, underscored: true, paranoid: true }
);

export default UserAnswerGroup;
