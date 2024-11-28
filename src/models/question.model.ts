import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, HasManyGetAssociationsMixin, ForeignKey, HasManyCreateAssociationMixin, NonAttribute } from 'sequelize';
import sequelize from '../config/sequelize.config';
import Group from './group.model';
import Option from './option.model';

class Question extends Model<InferAttributes<Question>, InferCreationAttributes<Question>> {
  declare id: number;
  declare question: string;
  declare groupId: ForeignKey<Group['id']>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
  declare options: NonAttribute<Option[]>;
  declare createOption: HasManyCreateAssociationMixin<Option, 'questionId'>;
  declare getOptions: HasManyGetAssociationsMixin<Option>;
}

Question.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
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
  {
    modelName: 'Question',
    sequelize,
    underscored: true,
  }
);

export default Question;
