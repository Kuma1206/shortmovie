declare module 'fluent-ffmpeg' {
  import { Readable, Writable } from 'stream';

  interface FfmpegCommand {
    input(file: string | Readable): FfmpegCommand;
    output(file: string | Writable | string): FfmpegCommand;
    outputOptions(options: string[]): FfmpegCommand;
    save(path: string): FfmpegCommand;
    on(event: string, callback: (err?: Error, stdout?: string, stderr?: string) => void): FfmpegCommand;
    run(): void;
  }

  function ffmpeg(file?: string | Readable): FfmpegCommand;

  export = ffmpeg;
}
