const checkAuthentication = (req, res, next) => {
    const { user_id } = req.session;

    if (!user_id){
        return res.status(401).send({ message: 'You must be logged in to do that.'})
    }
    next();
};

module.exports = checkAuthentication;