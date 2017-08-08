const webpack = require('webpack')
const library = '[name]_lib'
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
 entry: {
   vendors: ['jquery','react','react-dom','prop-types','react-router', 'react-router-dom','semantic-ui/dist/semantic.js']
 },

 output: {
  filename: '[name].dll.js',
  path: path.resolve(__dirname, 'dist/assets'),
  library
 },

 plugins: [
  new webpack.DllPlugin({
   path: path.join(__dirname, 'dist/assets/[name]-manifest.json'),
   // This must match the output.library option above
   name: library
  }),
  new CleanWebpackPlugin(
    ['dist/'],　 //匹配删除的文件
    {
        root: __dirname,       　　　　　　　　　　//根目录
        verbose:  true,        　　　　　　　　　　//开启在控制台输出信息
        dry:      false        　　　　　　　　　　//启用删除文件
    })
 ]
}