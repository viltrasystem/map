import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
//import fs from "fs";
import basicSsl from "@vitejs/plugin-basic-ssl";
//import XMLLoader from "vite-plugin-xml-loader";
// https://vitejs.dev/config/
export default defineConfig({
  // server: {
  //   proxy: {
  //     "/api": {
  //       target: "https://test.viltrapporten.no",
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, "/api/v1"),
  //     },
  //   },
  // },
  // server: {
  //   https: {
  //     key: fs.readFileSync("./Ssl/ca.key"),
  //     cert: fs.readFileSync("./Ssl/ca.crt"),
  //   },
  // },
  /////// //https://github.com/crxjs/chrome-extension-tools/issues/696
  ///////////////////////
  /*this make some issues */
  // server: {
  //   port: 5173,
  //   strictPort: true,
  //   hmr: {
  //     port: 5173,
  //   },
  // },
  /////////////////////////////
  //////
  base: "/",
  plugins: [react(), basicSsl()], // for xml load=> xmlLoader()
});
