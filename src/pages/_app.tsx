import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "../context/auth";
import Layout from "@/components/Layourfile/Layout"; // Layoutコンポーネントをインポート

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Layout>
        {" "}
        {/* Layoutを全体の親として設置 */}
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}

export default MyApp;
