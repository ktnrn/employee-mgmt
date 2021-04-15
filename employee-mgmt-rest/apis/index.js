var router = require('express').Router();
//Any new APIS should be added to the index.
router.use('/employees', require('./employees'));
router.use('/departments', require('./departments'));
module.exports = router;