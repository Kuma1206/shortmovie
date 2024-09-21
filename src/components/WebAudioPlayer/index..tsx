import React, { useRef, useState } from "react";

interface WebAudioPlayerProps {
  audioUrl: string;
}

const WebAudioPlayer: React.FC<WebAudioPlayerProps> = ({ audioUrl }) => {
  const audioContextRef = useRef<AudioContext | null>(null); // AudioContextの参照を保持
  const gainNodeRef = useRef<GainNode | null>(null); // 音量制御用のGainNode
  const sourceRef = useRef<AudioBufferSourceNode | null>(null); // 再生中のSourceを保持
  const [isPlaying, setIsPlaying] = useState(false); // 再生状態を管理
  const [volume, setVolume] = useState(1); // ボリューム（初期値: 1）
  const [currentTime, setCurrentTime] = useState(0); // 現在の再生時間
  const [duration, setDuration] = useState(0); // 音声の長さ

  const initAudioContext = async () => {
    if (!audioContextRef.current) {
      // AudioContextを初期化
      audioContextRef.current = new AudioContext();
      gainNodeRef.current = audioContextRef.current.createGain(); // GainNodeを作成
      gainNodeRef.current.gain.value = volume; // 初期ボリュームを設定
    }

    // Fetchで音声ファイルをロード
    const response = await fetch(audioUrl);
    const arrayBuffer = await response.arrayBuffer();

    // AudioContextでデコードしてAudioBufferを作成
    const audioBuffer = await audioContextRef.current.decodeAudioData(
      arrayBuffer
    );

    // AudioBufferSourceNodeを作成
    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;

    // GainNodeを介してAudioContextの出力に接続
    source
      .connect(gainNodeRef.current!)
      .connect(audioContextRef.current.destination);

    sourceRef.current = source; // 再生中のSourceを保持
    setDuration(audioBuffer.duration); // 音声の長さを設定

    return source; // SourceNodeを返す
  };

  const handlePlay = async () => {
    if (!audioContextRef.current || !sourceRef.current) {
      try {
        const source = await initAudioContext(); // AudioBufferSourceNodeを取得
        source.start(0); // 再生開始
        setIsPlaying(true);

        // 再生終了時の処理
        source.onended = () => {
          setIsPlaying(false);
          setCurrentTime(0); // 再生時間をリセット
        };

        // 現在の再生時間を定期的に更新
        const interval = setInterval(() => {
          if (audioContextRef.current) {
            setCurrentTime(audioContextRef.current.currentTime);
          }
        }, 1000);
      } catch (error) {
        console.error("Audio play error:", error);
      }
    }
  };

  const handleStop = () => {
    if (sourceRef.current) {
      sourceRef.current.stop(); // 再生を停止
      setIsPlaying(false);
      setCurrentTime(0); // 再生位置をリセット
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(event.target.value);
    setVolume(newVolume);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newVolume; // ボリュームを調整
    }
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(event.target.value);
    setCurrentTime(newTime);
    if (audioContextRef.current && sourceRef.current) {
      // 再生位置を変更
      sourceRef.current.stop(); // 一旦停止
      sourceRef.current.start(0, newTime); // 新しい再生位置で再開
    }
  };

  return (
    <div>
      <button onClick={isPlaying ? handleStop : handlePlay}>
        {isPlaying ? "停止" : "再生"}
      </button>

      <div>
        <label>ボリューム: {volume}</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>

      <div>
        <label>
          再生位置: {currentTime.toFixed(2)} / {duration.toFixed(2)}秒
        </label>
        <input
          type="range"
          min="0"
          max={duration}
          step="0.1"
          value={currentTime}
          onChange={handleTimeChange}
        />
      </div>
    </div>
  );
};

export default WebAudioPlayer;
