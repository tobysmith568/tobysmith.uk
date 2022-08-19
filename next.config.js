// cspell:words graphassets

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    domains: ["media.graphassets.com"]
  },
  experimental: {
    outputStandalone: true
  }
};

module.exports = nextConfig;
