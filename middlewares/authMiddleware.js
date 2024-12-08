const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

exports.isLawyer = (req,res,next) => {
    if(req.user && req.user.role === 'lawyer'){
        next();
    }
    else{
        res.status(403).json({message : "Unauthorized access"});
    }
}

exports.isClient = (req,res,next) => {
    if(req.user && req.user.role === 'client'){
        next();
    }
    else{
        res.status(403).json({message: "Unauthorized access"});
    }
}