const express = require('express');
const router = express.Router();

const { downloadHighestQualityVideo } = require('../controllers/downloader')
router.post('/download/hoghest-quality', downloadHighestQualityVideo)

module.exports = router