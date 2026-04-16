import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow your local network IPs to access the dev server
  allowedDevOrigins: ['192.168.1.70', '172.20.10.3', 'localhost'],
};

export default nextConfig;