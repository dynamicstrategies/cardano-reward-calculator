/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/crewardcalculator',
        permanent: true, // Set to false for temporary redirects
      },
    ];
  },
  output: "standalone",
};

export default nextConfig;
