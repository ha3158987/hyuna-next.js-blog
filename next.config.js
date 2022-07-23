// next.config.js
const isProduction = process.env.NODE_ENV === 'production'
const repositoryName = 'hyuna-next.js-blog'

module.exports = {
  assetPrefix: isProduction ? `/${repositoryName}` : '',
  experimental: {
    images: {
      unoptimized: true,
    },
  },
  env: {
    assetPrefix: isProduction ? `/${repositoryName}` : '',
  },
}