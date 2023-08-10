const ytdl = require('ytdl-core');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');


//Download highest quality
exports.downloadHighestQualityVideo = async (req, res) => {
  const { videoUrl } = req.body;
  console.log('HELLO');
  console.log(videoUrl);
  try {
    const info = await ytdl.getInfo(videoUrl);

    const videoFormat = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' });
    const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
    console.log(videoFormat);
    console.log(audioFormat);

    console.log('Downloading highest quality video...');
    const videoStream = await ytdl(videoUrl, { quality: 'highestvideo' });
    const videoFile = fs.createWriteStream('video.mp4');
    
    videoStream.pipe(videoFile);

    videoFile.on('finish', async () => {
      console.log('Downloading highest quality audio...');
      const audioStream = await ytdl(videoUrl, { quality: 'highestaudio' });
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
            const filePath = './output.mp4';

            // Set the Content-Disposition header to trigger download
            res.setHeader('Content-Type', 'video/mp4');
            res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');

            // Create a read stream for the video file and pipe it to the response
            const videoFileStream = fs.createReadStream(filePath);

            // Delete the output video file after the response is fully sent
            res.on('finish', () => {
              fs.unlinkSync(filePath);
            });

            videoFileStream.pipe(res);
          })
          .run();
      });
    });
  } catch (err) {
    console.error('Error:', err.message);
  }
};


//Download a particular quality
exports.downloadParticularQuality = async (req, res) => {
  console.log("IN PARTICULAR DOWNLOAD ROUTE")
  try{
    console.log("IN PARTICULAR DOWNLOAD ROUTE")
    const {videoUrl, itag} = req.body;
    console.log(videoUrl, itag);

    const info = await ytdl.getInfo(videoUrl);
    const format = ytdl.chooseFormat(info.formats, {quality: itag});
    // const videoFormat = ytdl.chooseFormat(info.formats, {quality: itag})
    // const audioFormat = ytdl.chooseFormat(info.formats, {quality: 'highestaudio'})

    const videoStream = ytdl.downloadFromInfo(info, { format });
    const videoFile = fs.createWriteStream('video.mp4');
    videoStream.pipe(videoFile);

    videoFile.on('finish', async () => {
      const audioStream = await ytdl(videoUrl, {quality: 'highestaudio'})
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
            const filePath = './output.mp4';

            // Set the Content-Disposition header to trigger download
            res.setHeader('Content-Type', 'video/mp4');
            res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');

            // Create a read stream for the video file and pipe it to the response
            const videoFileStream = fs.createReadStream(filePath);

            //Delete the output video file after the response is fully sent
            res.on('finish', () => {
              fs.unlinkSync(filePath);
            });

            videoFileStream.pipe(res);
          })
          .run();
      });
    })
  }catch(err) {
    res.status(500).json({
      succes: false,
      data:err
    })
  }

}


//Download only video
exports.DownloadOnlyVideo = async (req, res) => {
  try{

    const {videoUrl, itag} = req.body;
    console.log(videoUrl, itag);


    const info = await ytdl.getInfo(videoUrl);
    const format = ytdl.chooseFormat(info.formats, {quality: itag});
    const videoStream = ytdl.downloadFromInfo(info, { format });
    const videoFile = fs.createWriteStream('video.mp4');
    videoStream.pipe(videoFile);

    videoFile.on('finish', async ()=>{
      console.log("in on finish")
      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');
      const filePath = './video.mp4'
      const videoFileStream = fs.createReadStream(filePath);
      res.on('finish', async () => {
        fs.unlinkSync(filePath);
      });
      videoFileStream.pipe(res);
    })

  }catch(err) {
    return res.status(200).json({
      succes: false,
      message: "Error while fetching only video",
      data: err
    })
  }
}


//Download mp3
exports.downloadMp3 = async (req, res) => {
  
  try{
    const {videoUrl} = req.body;

    const audioStream = ytdl(videoUrl, {quality: 'highestaudio'})
    const audioFile = fs.createWriteStream('audio.webm');
    
    audioStream.pipe(audioFile);

    audioFile.on('finish', async()=>{
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Disposition', 'attachment; filename="audio.mp3"');

      ffmpeg('audio.webm').toFormat('mp3').output(res).run()

    })
    
  }catch(err) {
    return res.status(200).json({
      succes:false,
      data:err
    })
  }
}


//Analyze youtube video
exports.analyzeVideo = async (req, res) => {
  try{
    const {videoUrl} = req.body;
    //console.log(videoUrl)
    const info = await ytdl.getInfo(videoUrl);
    //console.log(info.videoDetails);
    return res.status(200).json({
      data: info.videoDetails
    })
  }catch(err) {
    console.log(err)
    return res.status(500).json({
      data:err
    })
  }
}


//Get download options
exports.downloadOptions = async (req, res) => {
  const {videoUrl} = req.body;
  //console.log(videoUrl)
  try{
    const info = await ytdl.getInfo(videoUrl);
    res.status(200).json({
      success: true,
      data: info.player_response.streamingData
    })
  }catch(err) {
    res.status(200).json({
      success: false,
      message: "Download options fetching failed",
      data: err
    })
  }
}