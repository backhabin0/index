import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/apple-touch-icon.png"],
      manifest: {
        id: "/",
        name: "Index",
        short_name: "Index",
        description: "일상, 문화생활, 소비, 미식, 여행을 달력으로 기록하는 라이프로그 앱",
        start_url: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#fbf6f1",
        theme_color: "#eaa7bb",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/icons/maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
      },
    }),
  ],
  // 같은 와이파이 네트워크의 iPad Safari에서 접속 테스트를 하기 위한 설정
  server: {
    host: true,
  },
});
