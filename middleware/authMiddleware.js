const sessions = {};

function authRequired(req, res, next) {
  const token = req.cookies.auth_token;

  if (!token || !sessions[token]) {
    return res.redirect("/login");
  }

  req.user = sessions[token];
  next();
}

module.exports = {
  authRequired,
  sessions
};