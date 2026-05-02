const eventModel = require('../models/eventModel');

const listEvent = async (req, res, next) => {
    try {
        const listEvents = await eventModel.list();
        res.send(listEvents);

    } catch (err){
        next(err)
    };
};

const listUserEvents = async (req, res, next) => {
    try{
        const user_id = req.session.user_id;
        const events = await eventModel.listByUser(user_id);
        res.send(events)

    }
    catch(err) {
        next(err)
    }
};

const createEvents = async (req, res, next) => {
    try {
                console.log('req.body:', req.body);
        console.log('req.session:', req.session);
        

        const { title, description, date, location, event_type, max_capacity } = req.body;
        if (!title || !date || !location || !event_type || !max_capacity) {
        return res.status(400).send({ error: 'All fields are required!'});
    } 

    const event = await eventModel.create(req.session.user_id, title, description, date, location, event_type, max_capacity);
    res.status(201).send(event);
} catch (err) {
        next(err)
    }
};

const deleteEvent = async (req, res, next) => {
    try {
        const { event_id } = req.body;
        const event = await eventModel.find(event_id);
        if (!event) return res.status(404).send({ message: 'event not found'});

        if (event.user_id !== req.session.user_id){
            return res.status(403).send({ message: 'You do not have permission to delete this event.'});
        }
        await eventModel.destroy(event_id)
        res.sendStatus(204);
    } catch (err){
        next(err)
    }
};

module.exports = { listEvent, listUserEvents, createEvents, deleteEvent};