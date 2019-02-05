const jwt = require('jsonwebtoken');
module.exports = (request, response, next) => {
  const authHeader = request.get('Authorization');
  if (!authHeader || typeof authHeader === "undefined") {
    request.isAuth = false;
    return next();
  }

  const token = authHeader.split(' ')[1];
  if (!token || token === '') {
    request.isAuth = false;
    return next();
  }
  try {
    decodedToken = jwt.verify(token, "someSuperSecretKey");
  } catch (error) {
    request.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    request.isAuth = false;
    return next();
  }

  request.isAuth = true;
  request.userId = decodedToken.userId;
  request.userEmail = decodedToken.userEmail;
  return next();
};