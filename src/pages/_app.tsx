import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "../context/auth";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    // ここに設置して全体の親にします
    <AuthProvider>
      <Component {...pageProps} /> 
    </AuthProvider>
  );
}

export default MyApp;
