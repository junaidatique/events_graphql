const userResolver = require('../resolvers/users')
const eventsResolver = require('../resolvers/events')
const bookingsResolver = require('../resolvers/bookings')


module.exports = {
  ...userResolver,
  ...eventsResolver,
  ...bookingsResolver,

}