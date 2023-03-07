const jwt = require("jsonwebtoken");

function verify(req, res, next) {
  const authHeaders = req.headers.token;
  if (authHeaders) {
    const token = authHeaders.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (error, user) => {
      if (error) res.status(403).json("token is not valid");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("you are not authenticated");
  }
}

module.exports = verify;
