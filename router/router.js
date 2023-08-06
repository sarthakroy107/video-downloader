const express = require('express');
const router = express.Router();

const { downloadHighestQualityVideo, analyzeVideo } = require('../downloader')
router.post('/download/highest-quality', downloadHighestQualityVideo)
router.put('/download/analyze-video', analyzeVideo)

module.exports = router