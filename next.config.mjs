/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["firebasestorage.googleapis.com"], // Firebaseの外部ホスト名を追加
  },
};

export default nextConfig;
