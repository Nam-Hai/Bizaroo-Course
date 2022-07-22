const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  const home = await client.getSingle('home')

  return res.render('template', {
    route: 'pages/home',
    home,
  });
});


module.exports = router
