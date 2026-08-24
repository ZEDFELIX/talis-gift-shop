const nextConfig = {
  images: { unoptimized: true },
  experimental: {
    serverActions: {
      bodySizeLimit: "8mb"
    },
    outputFileTracingIncludes: {
      "/**": ["./prisma/dev.db"]
    }
  }
};

export default nextConfig;
