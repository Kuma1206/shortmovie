declare module 'recorder-js' {
  interface RecorderOptions {
    type?: string;
    bitRate?: number;
  }

  interface Recorder {
    init(stream: MediaStream): Promise<void>;
    start(): Promise<void>;
    stop(): Promise<{ blob: Blob; buffer: Float32Array[] }>;
  }

  export default class Recorder {
    constructor(audioContext: AudioContext, options?: RecorderOptions);
  }
}
