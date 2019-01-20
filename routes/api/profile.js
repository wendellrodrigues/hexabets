const express = require('express'); //To use the router
const router = express.Router();

/**   /api/users/exampleRoute     */

// @route     /api/profile/test
// @desc      Test public profile
// @access    Public
router.get('/test', (req, res) => res.json({msg: 'Users Works'}));


module.exports = router;