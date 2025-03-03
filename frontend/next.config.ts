import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*' // Ajustez le port selon votre configuration FastAPI
      }
    ]
  }
};

module.exports = nextConfig

