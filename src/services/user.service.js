const User = require("../models/user.model");
const APIFeatures = require("../utils/apiFeatures");

const addUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await User.create(data);

      resolve({
        status: response ? "success" : "fail",
        msg: response ? "Create user successfully" : "Fail to create user",
        user: response ? response : null,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const findUserById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(id);

      resolve(user);
    } catch (error) {
      reject(error);
    }
  });
};

const findUserWithConditions = (condition) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne(condition);

      resolve(user);
    } catch (error) {
      reject(error);
    }
  });
};

const findAllUsersWithConditions = (query) => {
  return new Promise(async (resolve, reject) => {
    try {
      const features = new APIFeatures(User.find(), query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
      const users = await features.query;

      resolve(users);
    } catch (error) {
      reject(error);
    }
  });
};

const updateUserById = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      resolve(user);
    } catch (error) {
      reject(error);
    }
  });
};

const deleteUserById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findByIdAndDelete(id);

      resolve(user);
    } catch (error) {
      reject(error);
    }
  });
};

const updateUserAvatar = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findByIdAndUpdate(id, data, { new: true });

      resolve(user);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  addUser,
  findUserById,
  findUserWithConditions,
  findAllUsersWithConditions,
  updateUserById,
  deleteUserById,
  updateUserAvatar,
};
