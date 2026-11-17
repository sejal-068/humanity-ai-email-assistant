// backend/src/middlewares/role.js
module.exports = {
  assistantOnly: (req, res, next) => {
    if (req.user.role !== 'assistant') {
      return res.status(403).json({ message: 'Assistant role required' });
    }
    next();
  },
  clientOnly: (req, res, next) => {
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Client role required' });
    }
    next();
  },
};

