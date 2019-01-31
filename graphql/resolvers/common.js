const User = require('../../models/user');
const Event = require('../../models/event');
const { dateToString } = require('../../helpers/date_helper')
const simpleEvent = (event) => {
  return {
    ...event._doc,
    _id: event.id,
    creator: getUser.bind(this, event._doc.creator),
    date: dateToString(event._doc.date)
  }
}

const simpleUser = (user) => {
  return {
    ...user._doc,
    _id: user.id,
    password: null,
    createdEvents: getEvents.bind(this, user._doc.createdEvents)
  }
}

const simpleBooking = (booking) => {
  return {
    ...booking._doc,
    _id: booking.id,
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
    event: getEvent.bind(this, booking._doc.event),
    user: getUser.bind(this, booking._doc.user)
  }
}

const getUser = async userId => {
  try {
    user = await User.findById(userId);
    return simpleUser(user)
  } catch (error) {
    throw error;
  }
}

const getEvents = async eventIds => {
  try {
    events = await Event.find({ _id: { $in: eventIds } });
    return events.map(event => {
      return simpleEvent(event)
    })
  } catch (error) {
    throw error;
  }
}
const getEvent = async eventId => {
  try {
    event = await Event.findById(eventId);
    return simpleEvent(event)
  } catch (error) {
    throw error;
  }
}

exports.getUser = getUser;
exports.getEvents = getEvents;
exports.getEvent = getEvent;
exports.simpleEvent = simpleEvent;
exports.simpleBooking = simpleBooking;
exports.simpleUser = simpleUser;