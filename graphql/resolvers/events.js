const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date_helper')
const { simpleEvent } = require("./common")




module.exports = {
  events: async () => {
    try {
      const events = await Event.find().populate('creator');
      return events.map(event => {
        return simpleEvent(event)
      })
    } catch (error) {
      throw error;
    }
  },
  createEvent: async ({ input }) => {
    try {
      const event = new Event({
        title: input.title,
        description: input.description,
        price: input.price,
        date: input.date,
        creator: '5c5037135a7b834c3b403bda'
      });
      await event.save();
      let createdEvent = simpleEvent(event);
      const user = await User.findById("5c5037135a7b834c3b403bda");
      if (!user) {
        throw new Error('User not found');
      }
      user.createdEvents.push(event);
      return createdEvent;
    } catch (error) {
      throw error;
    }
  },

}