const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body;

  // Check if password meets length requirement
  if (!password || password.length < 3) {
    return res.status(400).json({ error: 'Password must be at least 3 characters long' });
  }

  // Check for duplicate username
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ error: 'username must be unique' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({ username, name, passwordHash });

  try {
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = usersRouter;
