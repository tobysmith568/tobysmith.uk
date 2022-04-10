// cspell:words graphassets

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    domains: ["media.graphassets.com"]
  }
};

module.exports = nextConfig;
