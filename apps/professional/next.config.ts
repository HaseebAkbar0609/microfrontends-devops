/** @type {import('next').NextConfig} */
const nextConfig = {
	// output: "standalone",
	// r4ok's frozen workspace build must include hoisted dependencies.
	...(process.env.TFS_WORKSPACE_BUILD === "true"
		? { outputFileTracingRoot: require("node:path").resolve(__dirname, "../..") }
		: {}),
	images: {
		remotePatterns: [
			{ protocol: "https", hostname: "images.unsplash.com" },
			// Local dev — MinIO (docker-compose.local.yml), used for presigned
			// profile-picture/media URLs when AWS_S3_PUBLIC_ENDPOINT_URL is set.
			{ protocol: "http", hostname: "localhost", port: "9000" },
			// Real S3 — presigned URLs from production/staging.
			{ protocol: "https", hostname: "*.s3.amazonaws.com" },
			{ protocol: "https", hostname: "s3.eu-north-1.amazonaws.com" },
			{ protocol: "https", hostname: "*.s3.eu-north-1.amazonaws.com" },
		],
	},
};

module.exports = nextConfig;
