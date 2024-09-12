// lib/ffmpegHelper.js
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

// パラメータの型を明示的に指定
export const mergeVideoAndSubtitles = (
  videoPath: string,
  subtitlesPath: string,
  outputPath: string
): void => {
  ffmpeg(videoPath)
    .outputOptions([`-vf subtitles=${subtitlesPath}`]) // 字幕を追加
    .save(path.resolve(outputPath))
    .on('end', () => {
      console.log('動画と字幕が正常に結合されました');
    })
    .on('error', (err: Error) => { // 'err' の型を 'Error' に指定
      console.error('エラーが発生しました:', err.message);
    });
};

module.exports = { mergeVideoAndSubtitles };
