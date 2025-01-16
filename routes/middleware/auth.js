import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const token = req.cookies.jwt; // Get token from cookie

  if (!token) {
    return res.status(401).json({ error: 'Access token is missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.user = decoded; // Attach user info to the request
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

