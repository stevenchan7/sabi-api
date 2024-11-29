import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, HasManyGetAssociationsMixin } from 'sequelize';
import sequelize from '../config/sequelize.config';

class Article extends Model<InferAttributes<Article>, InferCreationAttributes<Article>> {
  declare id: number;
  declare title: string;
  declare content: string;
  declare thumbnailUrl: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
}

Article.init(
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
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    thumbnailUrl: {
      type: DataTypes.STRING,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  { modelName: 'Article', sequelize, underscored: true }
);

export default Article;
