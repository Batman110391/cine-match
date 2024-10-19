import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
  },
  manifest: {
    name: "Cinematc Match",
    short_name: "Cinematic.",
    description: "Your perfect site movies",
    icons: [
      {
        src: "./public/images/svg/favicon-48x48.png",
        sizes: "48x48",
        type: "image/png",
      },
    ],
  },
});
