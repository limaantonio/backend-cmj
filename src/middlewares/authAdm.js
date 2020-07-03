const jwt = require('jsonwebtoken');
const authConfig = require('../config/authAdm.json')

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  
  if(!authHeader)
    return res.status(401).send({error: 'No token provider'});

    const parts = authHeader.split(' ');

    if(!(parts.length === 2))
     return res.status(401).send({error: 'Token error'});

    const [scheme, tokenAdm] = parts;

    if(!/^Bearer$/i.test(scheme))
      return res.status(401).send({error: 'TokenAdm malformatted'});

    jwt.verify(tokenAdm, authConfig.secret, (err, decoded) => {
      if(err) return res.status(401).send({error: 'Token invalid'});

      req.admId = decoded.id;
      return next();
    });

}