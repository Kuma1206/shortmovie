import multer from 'multer';
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import { v4 as uuidv4 } from 'uuid';

const upload = multer({ dest: 'uploads/' });
const nextConnect = require('next-connect');


const apiRoute = nextConnect({
  onError(error: Error, req: NextApiRequest, res: NextApiResponse) {
    res.status(501).json({ error: `Something went wrong! ${error.message}` });
  },
  onNoMatch(req: NextApiRequest, res: NextApiResponse) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});



// multerをnext-connectに組み込み
apiRoute.use(upload.single('audio'));

apiRoute.post((req: any, res: NextApiResponse) => {
  const inputFilePath = req.file.path;
  const outputFilePath = path.join(process.cwd(), 'public', 'uploads', `${uuidv4()}.mp3`);

  // ffmpegでwebmをmp3に変換
  ffmpeg(inputFilePath)
    .toFormat('mp3')
    .on('end', () => {
      fs.unlinkSync(inputFilePath); // 元のファイルを削除
      res.status(200).json({ mp3Url: `/uploads/${path.basename(outputFilePath)}` });
    })
    .on('error', (err: Error) => { // 'err' の型を明示的に 'Error' と指定
      console.error('Error converting audio:', err);
      res.status(500).json({ error: 'Error converting audio' });
    })
    .save(outputFilePath);
});


export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Multerを使うためbodyParserを無効化
  },
};
