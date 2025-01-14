import sequelize from '../config/sequelize.config';
import '../models/reading.model';
import Group from '../models/group.model';
import Option from '../models/option.model';
import Question from '../models/question.model';
import User from '../models/user.model';
import UserAnswer from '../models/userAnswer.model';
import UserAnswerGroup from '../models/userAnswerGroup.model';

const associate = () => {
  Group.hasMany(Question, { foreignKey: 'group_id', onDelete: 'CASCADE' });
  Question.belongsTo(Group, { foreignKey: 'group_id', as: 'group' });

  Question.hasMany(Option, { foreignKey: 'question_id', onDelete: 'CASCADE', as: 'options' });
  Option.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });

  User.hasMany(UserAnswerGroup, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  UserAnswerGroup.belongsTo(User, { foreignKey: 'user_id' });

  UserAnswerGroup.hasMany(UserAnswer, { foreignKey: 'user_answer_group_id', as: 'userAnswers', onDelete: 'CASCADE' });
  UserAnswer.belongsTo(UserAnswerGroup, { foreignKey: 'user_answer_group_id', as: 'userAnswerGroup' });

  Question.hasMany(UserAnswer, { foreignKey: 'question_id', as: 'userAnswers', onDelete: 'CASCADE' });
  UserAnswer.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });

  Option.hasMany(UserAnswer, { foreignKey: 'option_id', onDelete: 'CASCADE' });
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
