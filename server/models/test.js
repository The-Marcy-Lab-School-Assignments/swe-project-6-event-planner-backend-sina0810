require('dotenv').config();
const rsvpModel = require('./rsvpModel');

const test = async () => {
      // test listByEvent
    console.log(await rsvpModel.listByEvent(1));

    // test create
    // const newRsvp = await rsvpModel.create(2, 3);
    // console.log('New RSVP:', newRsvp);

  // Kill the process (the open pool connections) after running queries
  process.exit();
}
test();

