import sequelize from '../config/sequelize.config';

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
    await sequelize.sync({ alter: true });
  } catch (error) {
    console.error('Unable to sync models:', error);
    throw Error();
  }
};
