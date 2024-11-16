import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, "src"),
      '@mui/icons-material': '@mui/icons-material/esm', // Aliases to use ESM version
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
});
