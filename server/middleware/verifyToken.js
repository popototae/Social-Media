const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token || req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.status(403).json("Token ไม่ถูกต้อง!");
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json("คุณยังไม่ได้ยืนยันตัวตน (ไม่มี Token)");
    }
};

module.exports = verifyToken;