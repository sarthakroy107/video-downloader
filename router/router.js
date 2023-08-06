const express = require('express');
const router = express.Router();

const { downloadHighestQualityVideo } = require('../downloader')
router.post('/download/highest-quality', downloadHighestQualityVideo)

module.exports = router