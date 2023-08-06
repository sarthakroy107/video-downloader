const ytdl = require('ytdl-core');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

exports.downloadHighestQualityVideo = async (req, res) => {
    const {videoUrl} = req.body;
    console.log("HELLO")
    console.log(videoUrl);
    try {
        const info = await ytdl.getInfo(videoUrl);
    
        const videoFormat = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' });
        const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
        console.log(videoFormat)
        console.log(audioFormat)
    
        console.log('Downloading highest quality video...');
        const videoStream = await ytdl(videoUrl, {quality:'highestvideo'});
        const videoFile = fs.createWriteStream('video.mp4');
        videoStream.pipe(videoFile);
    
        videoFile.on('finish', async () => {
            console.log('Downloading highest quality audio...');
            const audioStream = await ytdl(videoUrl, {quality: 'highestaudio'});
            const audioFile = fs.createWriteStream('audio.webm');
            audioStream.pipe(audioFile);
    
            audioFile.on('finish', () => {
              console.log('Merging video and audio streams...');
              ffmpeg('video.mp4')
                .input('audio.webm')
                .videoCodec('copy')
                .audioCodec('aac')
                .output('output.mp4')
                .on('end', () => {
                    console.log('Muxing completed!');
                    // Remove the temporary video and audio files
                    fs.unlinkSync('video.mp4');
                    fs.unlinkSync('audio.webm');
                })
                .run();
            });

        });
        return res.status(200)
      } catch (err) {
        console.error('Error:', err.message);
      }

}