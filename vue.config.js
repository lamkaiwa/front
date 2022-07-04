module.exports = {
  publicPath: '/',
  //构建生产环境的项目入口 生产环境时为/my-project ,否则为/
  // publicPath: process.env.NODE_ENV === 'production' ? '/vue-danmu/' : '/',
  lintOnSave: true,
  devServer: {
    port: 80
    /*proxy: {
     '/api': {//这里最好有一个 /
     target: 'http://localhost:3000',// 后台接口域名
     ws: true,//如果要代理 websockets，配置这个参数
     secure: false,// 如果是https接口，需要配置这个参数
     changeOrigin: true, //是否跨域
     pathRewrite: {
     '^/api': ''
     }
     }
     }*/
  }
}
