/** @type {import('next').NextConfig} */
const nextConfig = {
    // experimental: {
    //   esmExternals: "loose",
    // },
    webpack: (config) => {
        config.resolve.alias.canvas = false;
        config.resolve.alias.encoding = false;
        // config.externals = [...config.externals, { canvas: "canvas" }];
        return config;
    }
};

module.exports = nextConfig;
