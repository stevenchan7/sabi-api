import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, HasManyGetAssociationsMixin, ForeignKey } from 'sequelize';
import sequelize from '../config/sequelize.config';

class Option extends Model<InferAttributes<Option>, InferCreationAttributes<Option>> {
  declare id: number;
  declare option: string;
  declare isAnswer: boolean;
  declare questionId: ForeignKey<Option['id']>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
}

Option.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    option: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAnswer: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  { modelName: 'Option', sequelize, underscored: true, paranoid: true }
);

export default Option;
