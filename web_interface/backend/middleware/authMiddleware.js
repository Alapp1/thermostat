export const checkAuth = (req, res, next) => {
    if (req.session.loggedIn) {
        next(); // User is authenticated, proceed to the next middleware or route handler
    } else {
        res.status(401).send('Unauthorized'); // User is not authenticated, respond with an error
    }
};
