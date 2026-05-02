const rsvpModel = require('../models/rsvpModel');


const createRsvp = async (req, res, next) => {
    try {
        const rsvp = await rsvpModel.create(req.session.user_id, req.params.event_id);
        res.status(201).send(rsvp);
    } catch (err){
        if (err.code === '23505') {
            return res.status(409).send({ message: 'You have already RSVPed to this event.' });
        }
        next(err);
    }
};


const destroy = async (req, res, next) => {
    try {
        const deleteRsvp = await rsvpModel.deleteRsvps(req.session.user_id, req.params.event_id);
         res.sendStatus(204)
    } catch(err) {
        next (err)
    }
};



const listByUser = async (req, res, next) => {
    try {
        const rsvps = await rsvpModel.listByUser(req.params.user_id);
        res.send(rsvps);
    } catch(err) {
        next(err);
    }
};
module.exports = { createRsvp, destroy, listByUser};