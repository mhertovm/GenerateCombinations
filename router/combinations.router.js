const express = require('express');
const router = express.Router();
const { generate } = require('../controller/combinations.controller');

router.post('/generate', generate);

module.exports = router;