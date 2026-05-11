import type { NextConfig } from "next";
const nextConfig: NextConfig = {
	output: "standalone",
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
				port: "",
				pathname: "/dtlt4zkth/image/upload/**",
			},
			{
				protocol: "https",
				hostname: "via.placeholder.com",
				port: "",
				pathname: "/**",
			},
		],
	},
};
export default nextConfig;
