import type { NextConfig } from "next";
const config: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  reactCompiler: false,
  cacheComponents: false,
};
export default config;
