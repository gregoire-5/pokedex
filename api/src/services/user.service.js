const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const userModel = require("../models/user.model");

exports.createUser = async (body) => {
  let user;
  let userData = structuredClone(body);

  try {
    let hash = await bcrypt.hash(userData.password, 10);
    userData.password = hash;
    user = await userModel.create(userData);
  } catch (error) {
    throw error;
  }

  return user;
};

exports.getUserById = async (id) => {
  try {
    return await User.findById(id);
  } catch (err) {
    throw err;
  }
};

exports.getUserByEmail = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (err) {
    throw err;
  }
};

exports.updateUserById = async (id, updateData) => {
  try {
    return await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  } catch (err) {
    throw err;
  }
};

exports.deleteUserById = async (id) => {
  try {
    return await User.findByIdAndDelete(id);
  } catch (err) {
    throw err;
  }
};

exports.verifyPassword = async (enteredPassword, hashedPassword) => {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};

exports.findUserByEmail = async (email) => {
  return await userModel.findOne({ email });
};

exports.getUserByUsername = async (username) => {
  try {
    return await User.findOne({ username });
  } catch (err) {
    throw err;
  }
};
