const nextConfig = {
  images: { unoptimized: true },
  outputFileTracingIncludes: {
    "/**": ["./prisma/dev.db"]
  }
};

export default nextConfig;
