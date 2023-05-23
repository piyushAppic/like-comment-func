const jwt = require('jsonwebtoken');

const auth = async(req, res, next) => {
    let token = req.body.token || req.headers['x-access-token']
    try{
        if(!token){
            return res.json({message: "user unauthorize !!"})
        }
        jwt.verify(token, process.env.json_secret_key, (error, user) => {
        if (error) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        req.user = user;
        next();
        });
    }catch(err){
        return res.json({message: err.message})
    }
    
}

module.exports = {auth}