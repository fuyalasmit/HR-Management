const message = require("../constants/messages.json");

const requireAuth = (req, res, next) => {
  const sessionToken = req.headers['x-session-token'] || req.headers['authorization']?.replace('Bearer ', '');

  if (!sessionToken) {
    return res.status(401).json({ message: message.sessionExpired });
  }

  // Import here to avoid circular dependency
  const { validateSession } = require("../src/controllers/authentication");
  const session = validateSession(sessionToken);

  if (!session) {
    return res.status(401).json({ message: message.sessionExpired });
  }

  // Add session info to request
  req.session = session;
  req.userEmail = session.userEmail;
  next();
};

const getAuthUser = (sessionToken) => {
  if (!sessionToken) return null;
  
  const { validateSession } = require("../src/controllers/authentication");
  const session = validateSession(sessionToken);
  
  return session ? session.userEmail : null;
};

module.exports = { requireAuth, getAuthUser };
