const jwt = require('jsonwebtoken');
const authStudentConfig = require('../config/authStudent.json')

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  
  if(!authHeader)
    return res.status(401).send({error: 'No token provider'});

    const parts = authHeader.split(' ');

    if(!(parts.length === 2))
     return res.status(401).send({error: 'Token error'});

    const [scheme, tokenStudent] = parts;

    if(!/^Bearer$/i.test(scheme))
      return res.status(401).send({error: 'tokenStudent malformatted'});

    jwt.verify(tokenStudent, authStudentConfig.secret, (err, decoded) => {
      if(err) return res.status(401).send({error: 'Token invalid'});

      req.studentId = decoded.id;
      return next();
    });

}