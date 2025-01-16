export const verifyCsrfToken = (req, res, next) => {
  const csrfToken = req.cookies.csrfToken;
  const requestToken = req.headers['x-csrf-token'];

  if (!csrfToken || csrfToken !== requestToken) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  next();
};
