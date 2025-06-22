const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.resolve.alias['@'] = path.resolve(__dirname, './')

        config.module.rules.push({
            test: /pdf\.worker(\.min)?\.js/,
            use: { loader: 'worker-loader' },
        })

        return config
    },
}

module.exports = nextConfig
