const userModel = require('../models/userModel.js');

const register = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password){
            return res.status(400).send({ error: 'Username and password are required.' });
        }
        const existingUser = await userModel.findByUsername(username);
        if (existingUser){
            return res.status(409).send({ message: 'Username already taken'});
        }
        const user = await userModel.create(username, password);

        req.session.userId = user.user_id

        res.status(201).send(user);

    } catch (err) {
        next(err);
    }
};