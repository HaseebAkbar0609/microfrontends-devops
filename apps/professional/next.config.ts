/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "standalone",
	images: {
		domains: ["images.unsplash.com"],
	},
	experimental: {
		cpus: 1,
	},
};

module.exports = nextConfig;
