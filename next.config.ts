import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Client-demo with in-memory state; skip Cache Components prerender constraints
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
