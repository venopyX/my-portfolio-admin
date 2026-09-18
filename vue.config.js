const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')

module.exports = defineConfig({
  publicPath: '/',
  transpileDependencies: true,
  devServer: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: 'all'
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
        __VUE_PROD_DEVTOOLS__: 'false',
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_TIPS__: 'false'
      })
    ]
  }
})
