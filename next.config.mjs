/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // External domains used by Next.js <Image> components.
    // github-readme-stats and streak-stats serve the GitHub stat card embeds.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github-readme-stats.vercel.app",
      },
      {
        protocol: "https",
        hostname: "github-readme-streak-stats.herokuapp.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;
