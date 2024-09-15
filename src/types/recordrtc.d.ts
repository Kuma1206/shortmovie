declare module 'recordrtc' {
  export default class RecordRTC {
    constructor(stream: MediaStream, options?: any);
    startRecording(): void;
    stopRecording(callback: (audioURL: string) => void): void;
    getBlob(): Blob;
    // 他の必要なメソッドやプロパティをここに追加
  }
}