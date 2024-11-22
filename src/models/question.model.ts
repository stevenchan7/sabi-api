import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, HasManyGetAssociationsMixin, ForeignKey } from 'sequelize';
import sequelize from '../config/sequelize.config';
import Group from './group.model';

class Question extends Model<InferAttributes<Question>, InferCreationAttributes<Question>> {
  declare id: number;
  declare question: string;
  declare groupId: ForeignKey<Group['id']>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
}

Question.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  { modelName: 'Question', sequelize, underscored: true, paranoid: true }
);

export default Question;
