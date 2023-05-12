const jwt = require("jsonwebtoken");
const NotAuthorized = require("../errors/not-authorized");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    next(new NotAuthorized("Необходима авторизация"));
    return;
  }

  const token = authorization.replace("Bearer ", "");

  let payload;
  try {
    payload = jwt.verify(token, "some-secret-key");
  } catch (error) {
    next(new NotAuthorized("Необходима авторизация"));
    return next(error);
  }

  req.user = payload;
  return next();
};
