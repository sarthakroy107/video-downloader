const express = require('express');
const router = express.Router();

const { downloadHighestQualityVideo, analyzeVideo, downloadOptions, downloadParticularQuality, DownloadOnlyVideo } = require('../downloader')
router.post('/download/highest-quality', downloadHighestQualityVideo)
router.put('/download/analyze-video', analyzeVideo)
router.put('/download/download-options', downloadOptions)
router.put('/download/particular-quality', downloadParticularQuality)
router.put('/download/only-video', DownloadOnlyVideo)

module.exports = router