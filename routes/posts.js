const router = require('express').Router()
const verify = require('./verifytoken')

router.get('/', verify, (req, res) => {
  // res.send(req.user)
  res.json({
    posts: {
      title: 'safasfasf',
      desc: 'safsafasff',
    },
  })
})

module.exports = router
