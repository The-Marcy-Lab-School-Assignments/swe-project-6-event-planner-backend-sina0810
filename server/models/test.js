require('dotenv').config();
const eventModel = require('./eventModel');

const test = async () => {
      // test listByEvent
    console.log(await eventModel.list());

    // test create
    // const newRsvp = await rsvpModel.create(2, 3);
    // console.log('New RSVP:', newRsvp);

  // Kill the process (the open pool connections) after running queries
  process.exit();
}
test();

