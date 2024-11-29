import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, HasManyGetAssociationsMixin, HasManyCreateAssociationMixin } from 'sequelize';
import sequelize from '../config/sequelize.config';
import Question from './question.model';

class Group extends Model<InferAttributes<Group>, InferCreationAttributes<Group>> {
  declare id: number;
  declare title: string;
  declare description: string;
  declare thumbnailUrl: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
  declare getQuestions: HasManyGetAssociationsMixin<Question>;
  declare createQuestion: HasManyCreateAssociationMixin<Question, 'groupId'>;
}

Group.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT('tiny'),
      allowNull: false,
    },
    thumbnailUrl: {
      type: DataTypes.STRING,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  { modelName: 'Group', sequelize, underscored: true }
);

export default Group;
