  declare module 'lamejs' {
    class Mp3Encoder {
      constructor(channels: number, sampleRate: number, kbps: number);
      encodeBuffer(left: Int16Array, right?: Int16Array): Int8Array;
      flush(): Int8Array;
    }

    class WavHeader {
      static readHeader(dataView: DataView): {
        channels: number;
        sampleRate: number;
        dataLen: number;
        dataOffset: number;
      };
    }

    export { Mp3Encoder, WavHeader };
  }
