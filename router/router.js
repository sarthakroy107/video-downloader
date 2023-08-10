const express = require('express');
const router = express.Router();

const { downloadHighestQualityVideo, analyzeVideo, downloadOptions, downloadParticularQuality, DownloadOnlyVideo, downloadMp3 } = require('../downloader')
router.post('/download/highest-quality', downloadHighestQualityVideo)
router.put('/download/analyze-video', analyzeVideo)
router.put('/download/download-options', downloadOptions)
router.put('/download/particular-quality', downloadParticularQuality)
router.put('/download/only-video', DownloadOnlyVideo)
router.put('/download/mp3', downloadMp3)

module.exports = router