const router = require('express').Router()
const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { registerValidation, loginValidation } = require('../validation')

router.post('/register', async (req, res) => {
  //Validate the data
  const { error } = registerValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  //checking if the user is already in DB
  const isEmailExist = await User.findOne({ email: req.body.email })
  if (isEmailExist) return res.status(400).send('Email already exists')

  const salt = await bcrypt.genSalt(10)
  const hashPassword = await bcrypt.hash(req.body.password, salt)
  //Create user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  })

  try {
    const savedUser = await user.save()
    res.send({ user: user.id })
  } catch (error) {
    res.status(400).send(err)
  }
})

// LOGIN
router.post('/login', async (req, res) => {
  //Validate the data
  const { error } = loginValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  //checking if the email exists
  const user = await User.findOne({ email: req.body.email })
  if (!user) return res.status(400).send('Email is not found')
  //Password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password)
  if (!validPass) return res.status(400).send('Invalid password')
  //Create and assing a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
  res.header('auth-token', token).send(token)
})

module.exports = router
