const path = require('path');

// const HTMLWebpackPlugin = require('html-webpack-plugin') // плагин для переноса HTML в dist и авто подключение js скриптов
const { CleanWebpackPlugin } = require('clean-webpack-plugin')  // плагин для очистки дист
const CopyWebpackPlugin = require('copy-webpack-plugin') // копирует что угодно в дист
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // сжимает css
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin') // uglify js
// const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all'
    }
  }

  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetWebpackPlugin(),
      new TerserWebpackPlugin()
    ]
  }

  return config
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

const cssLoaders = extra => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        // some options
      }
    },
    'css-loader'
  ]
  if (extra) {
    loaders.push(extra)
  }
  return loaders
}

const babelOptions = preset => {
  const opts = {
    presets: [
      '@babel/preset-env'
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties'
    ]
  }

  if (preset) {
    opts.presets.push(preset)
  }

  return opts
}


const jsLoaders = () => {
  const loaders = [{
    loader: 'babel-loader',
    options: babelOptions()
  }]

  if (isDev) {
    loaders.push('eslint-loader')
  }

  return loaders
}


module.exports = {
  context: path.join(__dirname, "public"),  // указывает оносительный путь к исходной папке
  mode: "development", // можно будет в cli использовать мод в скрипте, по умолчанию dev 
  entry: {
    main: ['@babel/polyfill', './javascripts/index.js'],   // js точки входа 
    // other: ['@babel/polyfill', "./javascripts/index2.ts"]
  },
  output: {
    path: path.join(__dirname, "./public/dist"),  // сюда выгружается всё
    filename: "[name].bundle.js"   // [contenthash] динамическое указание имён выгружаемых файлов
  },
  resolve: {
    extensions: ['.js', '.json', '.png'], // расширения по умолчанию, после этой строчки их можно не указывать в импортах 
    alias: {
      '@assets': path.resolve(__dirname, 'public/assets'), // таким образом можно избежать длинных путей в импортах
      '@': path.resolve(__dirname, 'public'),              // --- || --- || ---
      '@sass': path.resolve(__dirname, 'public/stylesheets/sass')
    }
  },
  optimization: optimization(),
  plugins: [
    // new HTMLWebpackPlugin({
    // title: "webpack jetrealllllllll",   // можно указывать параметры если неуказан template
    // template: "./public/index.html",  // путь откуда берётся html для переноса
    // minify: {
    //   collapseWhitespace: isProd
    // }
    // }),
    new CleanWebpackPlugin(),   // ощинение dist
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public/assets/json.json'),    // копирует при билде что угодно в дист
          to: path.resolve(__dirname, 'public/dist')
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: filename('css')
    })
  ],
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader'
      },
      {
        test: /\.css$/,
        use: cssLoaders() // лоадеры нужно устанавливать через npm
      },
      {
        test: /\.less$/,
        use: cssLoaders('less-loader')
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders('sass-loader')
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: ['file-loader']
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: ['file-loader']
      },
      {
        test: /\.xml$/,
        use: ['xml-loader']
      },
      {
        test: /\.csv$/,
        use: ['csv-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders()
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
         
        },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: 'jsx-loader'
      }
    ]
  },
  devServer: {
    // static: {
    //   directory: path.join(__dirname, 'public'),
    // },
    compress: true,
    port: 4200,    // для дев сервера нужен скрипт в стартСкриптах
    // hot: isDev,
    proxy: {
      "/": "http://localhost:3000"
    }
  }
}
