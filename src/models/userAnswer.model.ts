import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, HasManyGetAssociationsMixin, ForeignKey, NonAttribute } from 'sequelize';
import sequelize from '../config/sequelize.config';
import Question from './question.model';
import Option from './option.model';
import UserAnswerGroup from './userAnswerGroup.model';

class UserAnswer extends Model<InferAttributes<UserAnswer>, InferCreationAttributes<UserAnswer>> {
  declare id: number;
  declare isCorrect: boolean;
  declare questionId: ForeignKey<Question['id']>;
  declare optionId: ForeignKey<Option['id']>;
  declare user_answer_group_id: ForeignKey<UserAnswerGroup['id']>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
  declare question: NonAttribute<Question>;
}

UserAnswer.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    isCorrect: {
      type: DataTypes.BOOLEAN,
    },
    questionId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: Question,
        key: 'id',
      },
    },
    optionId: {
      type: DataTypes.BIGINT.UNSIGNED,
      references: {
        model: Option,
        key: 'id',
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  { modelName: 'UserAnswer', sequelize, underscored: true, paranoid: true }
);

export default UserAnswer;
