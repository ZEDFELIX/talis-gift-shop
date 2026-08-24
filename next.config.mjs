const nextConfig = {
  images: { unoptimized: true },
  experimental: {
    outputFileTracingIncludes: {
      "/**": ["./prisma/dev.db"]
    }
  }
};

export default nextConfig;
