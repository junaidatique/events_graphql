const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const { simpleUser } = require("./common")

module.exports = {
  users: () => {
    return User.find().populate('createdEvents').then(users => {
      return users.map(user => {
        return simpleUser(user)
      })
    }).catch(err => {
      console.log(err)
    });
  },
  createUser: ({ input }) => {
    return User
      .findOne({ email: input.email })
      .then(user => {
        if (user) {
          throw new Error('User exists already');
        }
        return bcrypt.hash(input.password, 12)
      }).then(hashedPassword => {
        const user = new User({
          email: input.email,
          password: hashedPassword
        });
        return user.save()
          .then(result => {
            return simpleUser(result);

          }).catch(error => {
            throw error;
          })
      }).catch(error => {
        throw error;
      })
  }
}