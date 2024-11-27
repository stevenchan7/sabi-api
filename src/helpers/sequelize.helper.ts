import sequelize from '../config/sequelize.config';
import '../models/article.model';
import Group from '../models/group.model';
import Option from '../models/option.model';
import Question from '../models/question.model';
import User from '../models/user.model';
import UserAnswer from '../models/userAnswer.model';
import UserAnswerGroup from '../models/userAnswerGroup.model';

const associate = () => {
  Group.hasMany(Question, { foreignKey: 'group_id' });
  Question.belongsTo(Group, { foreignKey: 'group_id' });

  Question.hasMany(Option, { foreignKey: 'question_id', onDelete: 'CASCADE', as: 'options' });
  Option.belongsTo(Question, { foreignKey: 'question_id', onDelete: 'CASCADE', as: 'question' });

  User.hasMany(UserAnswerGroup, { foreignKey: 'user_id' });
  UserAnswerGroup.belongsTo(User, { foreignKey: 'user_id' });

  UserAnswerGroup.hasMany(UserAnswer, { foreignKey: 'user_answer_group_id' });
  UserAnswer.belongsTo(UserAnswerGroup, { foreignKey: 'user_answer_group_id' });

  Question.hasMany(UserAnswer, { foreignKey: 'question_id' });
  UserAnswer.belongsTo(Question, { foreignKey: 'question_id' });

  Option.hasMany(UserAnswer, { foreignKey: 'option_id' });
  UserAnswer.belongsTo(UserAnswer, { foreignKey: 'option_id' });
};

export const connectSequelize = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw Error();
  }
};

export const syncModel = async () => {
  try {
    associate();
    await sequelize.sync({ alter: true });
    console.log('Models have been sync successfully.');
  } catch (error) {
    console.error('Unable to sync models:', error);
    throw Error();
  }
};
