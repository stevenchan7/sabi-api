import User from '../models/user.model';

export const isUserExist = async (email: string, nim: string): Promise<boolean> => {
  try {
    const users = await User.findAll({
      where: {
        email,
      },
    });

    if (users && users.length > 0) {
      return true;
    }

    return false;
  } catch (error) {
    throw new Error('Terjadi kesalahan. Silahkan coba lagi.');
  }
};
