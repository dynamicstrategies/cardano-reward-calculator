/** @type {import('next').NextConfig} */

// use this for a static build
const nextConfig = {
  reactStrictMode: true,
  // output: 'export',
  basePath: '/crewardcalculator',
  images: {unoptimized: true}
};

// use this for standalone (e.g. localhost tests)
// const nextConfig = {
//   reactStrictMode: true,
//   output: "standalone",
//   basePath: '/crewardcalculator'
// };

// we may want to use an .env flag in the future
// const isStaticExport = process.env.NEXT_STATIC_EXPORT;
//
// const nextConfig = {
//   reactStrictMode: true,
//   output: isStaticExport ? "export" : "standalone",
//   basePath: isStaticExport ? "/reward-calculator" : "/crewardcalculator",
//   images: isStaticExport ? {unoptimized: true} : undefined
// };

export default nextConfig;
