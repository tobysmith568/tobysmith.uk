// cspell:words graphassets

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    dangerouslyAllowSVG: true,
    domains: ["media.graphassets.com"]
  }
};

module.exports = nextConfig;
