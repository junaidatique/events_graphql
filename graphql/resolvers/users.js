const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const { simpleUser } = require("./common")
const jwt = require('jsonwebtoken');
module.exports = {
  users: async () => {
    const users = await User.find().populate('createdEvents');
    try {
      return users.map(user => {
        return simpleUser(user)
      })
    } catch (error) {
      throw error;
    }
  },
  createUser: async ({ input }) => {
    try {
      const user = await User.findOne({ email: input.email });
      if (user) {
        throw new Error('User exists already');
      }
      hashedPassword = await bcrypt.hash(input.password, 12);
      const newUser = new User({
        email: input.email,
        password: hashedPassword
      });
      const dbUser = await newUser.save();
      return simpleUser(dbUser);
    } catch (error) {
      throw error;
    }
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid Email/Password1");
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error("Invalid Email/Password2");
    }
    const token = jwt.sign({ userId: user.id, userEmail: user.email }, 'someSuperSecretKey', {
      expiresIn: '1h'
    })
    return {
      userId: user.id,
      token: token,
      tokenExpiration: 1
    }
  }
}