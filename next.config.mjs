/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/reward-calculator',
  images: {unoptimized: true}
};

// const nextConfig = {
//   reactStrictMode: true,
//   output: "standalone",
//   basePath: '/crewardcalculator'
// };

// const isStaticExport = process.env.NEXT_STATIC_EXPORT;
//
// const nextConfig = {
//   reactStrictMode: true,
//   output: isStaticExport ? "export" : "standalone",
//   basePath: isStaticExport ? "/reward-calculator" : "/crewardcalculator",
//   images: isStaticExport ? {unoptimized: true} : undefined
// };

export default nextConfig;
