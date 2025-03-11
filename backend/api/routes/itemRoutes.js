const express = require('express');
const router = express.Router();
const { addItem } = require('../../controllers/itemController');

router.post('/add-item', addItem);

module.exports = router;
