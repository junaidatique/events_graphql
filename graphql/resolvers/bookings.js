const Booking = require('../../models/booking');
const Event = require('../../models/event');
const { dateToString } = require('../../helpers/date_helper')
const { simpleBooking, simpleEvent } = require("./common")

module.exports = {

  bookings: async (args, request) => {
    try {
      if (!request.isAuth) {
        throw new Error("Un Authenticated request");
      }
      const bookings = await Booking.find();
      return bookings.map(booking => {
        return simpleBooking(booking)
      })
    } catch (error) {
      throw error;
    }
  },
  bookEvent: async (input, request) => {
    if (!request.isAuth) {
      throw new Error("Un Authenticated request");
    }
    const dbEvent = await Event.findOne({ _id: input.eventId });
    const booking = new Booking({
      user: '5c5037135a7b834c3b403bda',
      event: dbEvent
    });
    const result = await booking.save();
    return simpleBooking(result)
  },
  cancelEvent: async (input, request) => {
    if (!request.isAuth) {
      throw new Error("Un Authenticated request");
    }
    try {
      const booking = await Booking.findById(input.bookingId).populate('event');
      const event = simpleEvent(booking.event)
      await Booking.deleteOne({ _id: input.bookingId });
      return event;
    } catch (error) {
      throw error;
    }

  }
}