export type Gender = 'male' | 'female';

export type User = {
  id: string;
  name: string;
  photoURL: string;
  email: string;
  createdAt: number;
  description?: string;
  gender?: Gender;
  // 以下を追加
  title?: string; // 肩書き
  links?: string[]; // リンク
  coverURL?: string; // カバーイメージ
};