const AdminLogin = (req, res, next) => {
  const token = "xyz";
  isAuthorized = token === "xyz";
  if (!isAuthorized) {
    res.status(401).send("unAuthorized request");
  } else {
    next();
  }
};

const AuthUser = (req, res, next) => {
  const token = "xyz";
  isAuthorized = token === "xyz";
  if (!isAuthorized) {
    res.status(401).send("unAuthorized request");
  } else {
    next();
  }
};

module.exports = { AdminLogin, AuthUser };
