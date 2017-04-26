var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/login', (req, res) => {
  console.log(req.query);
  const username = req.query.username;
  if (username) {
    req.session.username = username;
    res.json({ username });
  } else {
    res.render('index');
  }
});


module.exports = router;
