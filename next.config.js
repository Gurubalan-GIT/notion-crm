/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  experimental: {
    fontLoaders: [
      { loader: "@next/font/google", options: { subsets: ["latin"] } },
    ],
  },
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/:slug*.php",
        destination: "/no-php",
        permanent: true,
      },
    ];
  },
};
