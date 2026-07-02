import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        tsconfigPaths: true,
    },
    server: {
        proxy: {
            // フロントで `/api` から始まるリクエストを送った場合の転送先を設定
            "/api": {
                target: "http://localhost:8787",
                changeOrigin: true,
                // 必要に応じて、バックエンドに渡す手前でパスを書き換える設定
                // もしWorkers側も `/api/...` で待ち受けているなら、この rewrite は不要です
                // rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },
});
