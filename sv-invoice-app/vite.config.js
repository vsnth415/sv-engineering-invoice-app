import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/sv-engineering-invoice-app/", // ← this must match your repo name
});
