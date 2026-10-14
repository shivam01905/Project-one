import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Client-demo with in-memory state; skip Cache Components prerender constraints
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
