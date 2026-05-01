const rsvpModel = require('../models/rsvpModel');


const createRsvp = async (req, res, next) => {
    try {
        const listRsvp = await rsvpModel.create(req.session.userId, req.params.event_id);
         res.status(201).send(listRsvp)
    } catch (err){
        next (err)
    }
};


const destroy = async (req, res, next) => {
    try {
        const deleteRsvp = await rsvpModel.deleteRsvps(req.session.userId, req.params.event_id);
         res.sendStatus(deleteRsvp)
    } catch(err) {
        next (err)
    }
};

const listByUser = async (req, res, next) => {
    try {
        const listRsvpByEvent = await rsvpModel.listByEvent(req.params.user_id);
            res.send(listRsvpByEvent) 
    } catch(err) {
        next(err)
    }
};

module.exports = { createRsvp, destroy, listByUser};