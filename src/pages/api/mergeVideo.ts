// /pages/api/mergeVideo.ts
import { NextApiRequest, NextApiResponse } from 'next';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { videoPath, subtitles } = req.body;

  // デバッグ: 受け取ったリクエスト内容を出力
  console.log('Received videoPath:', videoPath);
  console.log('Received subtitles:', subtitles);

  // 出力先ディレクトリをプロジェクトのtempフォルダ内に設定
  const tempDir = path.join(process.cwd(), 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir); // tempフォルダがない場合は作成
  }

  // SRTファイルを保存するパス
  const srtPath = path.join(tempDir, 'subtitles.srt');
  fs.writeFileSync(srtPath, subtitles);

  // 動画の出力先をプロジェクト内の 'temp' に変更
  const outputPath = path.join(tempDir, 'output_temp_video.mp4');

  try {
    // Windows環境用にエスケープされたパスを使用
    const escapedSrtPath = srtPath.replace(/\\/g, '/');  // バックスラッシュをスラッシュに変換
    const escapedOutputPath = outputPath.replace(/\\/g, '/');

    // ffmpegコマンドの確認
    console.log('ffmpeg command:', `-vf subtitles=${escapedSrtPath}`);
    console.log('Output path:', escapedOutputPath);

    ffmpeg(videoPath)
      .outputOptions([`-vf subtitles='${escapedSrtPath}'`])  // 字幕を追加
      .on('start', (commandLine) => {
        console.log('Spawned Ffmpeg with command: ' + commandLine);
      })
      .save(escapedOutputPath)
      .on('end', () => {
        // 字幕ファイルを削除
        fs.unlinkSync(srtPath);

        // クライアントにレスポンスを返す
        res.status(200).json({ message: '動画と字幕の結合が完了しました', outputPath: escapedOutputPath });
      })
      .on('error', (err?: Error) => {
        console.error('ffmpegエラーが発生しました:', err?.message);
        res.status(500).json({ message: '動画の結合中にエラーが発生しました', error: err?.message });
      });
  } catch (error) {
    console.error('サーバー側でエラーが発生しました:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました', error });
  }
}
