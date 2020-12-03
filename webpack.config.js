const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const HtmlCriticalWebpackPlugin = require('./src/assets/vendors/html-critical-webpack-plugin-fork')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackDeployPlugin = require('html-webpack-deploy-plugin')
const IconfontPlugin = require('iconfont-plugin-webpack')
const MediaQueryPlugin = require('media-query-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const SvgStorePlugin = require('external-svg-sprite-loader')
const TerserJSPlugin = require('terser-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const fs = require('fs')
const path = require('path')
const resolve = path.resolve.bind(path, __dirname)
const PATHS = {
  relative: false,
  src: path.join(__dirname, 'src'),
  public: path.join(__dirname, 'public'),
  fonts: path.join(__dirname, 'public/fonts'),
  baseUrl: '/'
}
const webpack = require('webpack')

// generate multiple HtmlWebpackPlugins
let htmlFiles = fs.readdirSync(`${PATHS.public}`).filter(file => {
  if (file.indexOf('.shtm') !== -1) return file
})
const htmlBasenames = htmlFiles.map(file => {
  const basename = file.split('.')[0]
  return basename
})

module.exports = (env, options) => {
  console.log(`Webpack is running as ${options.mode} mode.`)
  const isDevMode = options.mode === 'development'
  const loaders = {
    cssLoader: {
      loader: 'css-loader',
      options: {
        importLoaders: 4,
        sourceMap: true
      }
    },
    groupCssMediaQueriesLoader: {
      loader: 'group-css-media-queries-loader',
      options: {
        sourceMap: true
      }
    },
    MiniCssExtractPluginLoader: {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDevMode,
        reloadAll: true
      }
    },
    MediaQueryPluginLoader: MediaQueryPlugin.loader,
    postCssLoader: {
      loader: 'postcss-loader',
      options: {
        sourceMap: true,
        // plugins: [require('autoprefixer')]
        postcssOptions: {
          plugins: ['autoprefixer']
        }
      }
    },
    resolveUrlLoader: {
      loader: 'resolve-url-loader',
      options: {
        debug: true,
        sourceMap: true,
        keepQuery: true
      }
    },
    sassLoader: {
      loader: 'sass-loader',
      options: {
        additionalData: `@import './src/sass/_abstracts.sass'`,
        sourceMap: true,
        implementation: require('sass'),
        sassOptions: {
          indentedSyntax: true,
          fiber: require('fibers'),
          sourceMap: true,
          outputStyle: 'expanded',
          includePaths: ['src/sass']
        }
      }
    }
  }
  const plugins = {
    CopyWebpackPlugin: () => {
      return new CopyWebpackPlugin([
        {
          from: './node_modules/animate.css/animate.min.css',
          to: './vendors/',
          toType: 'dir'
        },
        {
          from: isDevMode
            ? './node_modules/vue/dist/vue.js'
            : './node_modules/vue/dist/vue.runtime.min.js',
          to: './vendors/',
          toType: 'dir'
        },
        {
          from: './node_modules/vue-router/dist/vue-router.min.js',
          to: './vendors/',
          toType: 'dir'
        },
        {
          from: './node_modules/vuex/dist/vuex.min.js',
          to: './vendors/',
          toType: 'dir'
        },
        // {
        //   from: './public/js/libs/jquery.min.js',
        //   to: './js/libs/jquery.min.js',
        //   toType: 'file',
        // },
        {
          from: './src/db',
          to: './db'
        }
      ])
    },
    CleanWebpackPlugin: () => {
      return new CleanWebpackPlugin({
        dry: true,
        cleanOnceBeforeBuildPatterns: ['**/*', '!images/favicons/**/*']
      })
    },
    DefinePlugin: () => {
      const media = {
        mobile: '(max-width: 47.9375em)',
        tablet: '(min-width: 48em) and (max-width: 64em)',
        belowTablet: 'only screen and (max-width: 64em)',
        aboveTablet: 'only screen and (min-width: 48em)',
        desktop: '(min-width: 64.0625em)'
      }
      return new webpack.DefinePlugin({
        BASE_URL: JSON.stringify(PATHS.baseUrl),
        DEVELOPMENT: isDevMode,
        MOBILE: JSON.stringify(media.mobile),
        TABLET: JSON.stringify(media.tablet),
        BELOWTABLET: JSON.stringify(media.belowTablet),
        ABOVETABLET: JSON.stringify(media.aboveTablet),
        DESKTOP: JSON.stringify(media.desktop)
      })
    },
    FaviconsWebpackPlugin: () => {
      return new FaviconsWebpackPlugin({
        // Your source logo (required)
        logo: './src/assets/images/favicon.png',

        // Enable caching and optionally specify the path to store cached data
        cache: true,

        // Override the publicPath option usually read from webpack configuration
        publicPath: PATHS.relative ? './' : '/',

        // The directory to output the assets relative to the webpack output dir.
        // Relative string paths are allowed here ie '../public/static'. If this
        // option is not set, `prefix` is used.
        // outputPath: 'images/favicons',

        // Prefix path for generated assets
        prefix: 'images/favicons',

        // Inject html links/metadata (requires html-webpack-plugin).
        // This option accepts arguments of different types:
        //  * boolean
        //    `false`: disables injection
        //    `true`: enables injection if that is not disabled in html-webpack-plugin
        //  * string
        //    `'force'`: enables injection even if that is disabled in html-webpack-plugin
        //  * function
        //    any predicate that takes an instance of html-webpack-plugin and returns either
        //    `true` or `false` to control the injection of html metadata for the html files
        //    generated by this instance.
        inject: true,
        mode: 'webapp', // optional can be 'webapp' or 'light' - 'webapp' by default
        devMode: 'webapp', // optional can be 'webapp' or 'light' - 'light' by default
        favicons: {
          appName: 'PharmaEngine', // Your application's name. `string`
          appShortName: 'PE', // Your application's short_name. `string`. Optional. If not set, appName will be used
          appDescription: null, // Your application's description. `string`
          developerName: null, // Your (or your developer's) name. `string`
          developerURL: null, // Your (or your developer's) URL. `string`
          dir: 'auto', // Primary text direction for name, short_name, and description
          lang: 'zh-Hant', // Primary language for name and short_name
          background: '#fff', // Background colour for flattened icons. `string`
          theme_color: '#fff', // Theme color user for example in Android's task switcher. `string`
          appleStatusBarStyle: 'black-translucent', // Style for Apple status bar: "black-translucent", "default", "black". `string`
          display: 'standalone', // Preferred display mode: "fullscreen", "standalone", "minimal-ui" or "browser". `string`
          orientation: 'any', // Default orientation: "any", "natural", "portrait" or "landscape". `string`
          scope: '/', // set of URLs that the browser considers within your app
          start_url: '', // Start URL when launching the application from a device. `string`
          version: '1.0', // Your application's version string. `string`
          logging: false, // Print logs to console? `boolean`
          pixel_art: false, // Keeps pixels "sharp" when scaling up, for pixel art.  Only supported in offline mode.
          loadManifestWithCredentials: false, // Browsers don't send cookies when fetching a manifest, enable this to fix that. `boolean`
          icons: {
            // Platform Options:
            // - offset - offset in percentage
            // - background:
            //   * false - use default
            //   * true - force use default, e.g. set background for Android icons
            //   * color - set background for the specified icons
            //   * mask - apply mask in order to create circle icon (applied by default for firefox). `boolean`
            //   * overlayGlow - apply glow effect after mask has been applied (applied by default for firefox). `boolean`
            //   * overlayShadow - apply drop shadow after mask has been applied .`boolean`
            //
            android: false, // Create Android homescreen icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
            appleIcon: false, // Create Apple touch icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
            appleStartup: false, // Create Apple startup images. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
            coast: false, // Create Opera Coast icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
            favicons: true, // Create regular favicons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
            firefox: false, // Create Firefox OS icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
            windows: false, // Create Windows 8 tile icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
            yandex: false // Create Yandex browser icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
          }
        }
      })
    },
    FriendlyErrorsWebpackPlugin: () => {
      return new FriendlyErrorsWebpackPlugin()
    },
    IconfontPlugin: () => {
      return new IconfontPlugin({
        src: resolve('./src/assets/fonts'),
        family: 'myFont',
        dest: {
          font: resolve('./public/fonts/[family].[type]'),
          css: resolve('./src/sass/abstracts/mixins/_iconFontByWebpack.scss')
        },
        watch: {
          pattern: 'src/assets/fonts/**/*.svg',
          cwd: __dirname
        },
        cssTemplate: require('./src/assets/vendors/iconfont-plugin-webpack/template')
      })
    },
    MediaQueryPlugin: () => {
      return new MediaQueryPlugin({
        include: htmlBasenames,
        queries: {
          'only screen and (max-width: 47.9375em)': 'mobile',
          'only screen and (max-width: 47.9375em) and (orientation: landscape)':
            'mobile',
          'only screen and (max-width: 47.9375em) and (orientation: portrait)':
            'mobile',
          'only screen and (min-width: 48em) and (max-width: 64em)': 'tablet',
          'only screen and (min-width: 48em) and (max-width: 64em) and (orientation: landscape)':
            'tablet',
          'only screen and (min-width: 48em) and (max-width: 64em) and (orientation: portrait)':
            'tablet',
          'only screen and (min-width: 64.0625em)': 'desktop'
        }
      })
    },
    MiniCssExtractPlugin: () => {
      return new MiniCssExtractPlugin({
        filename: isDevMode ? 'css/[name].css' : 'css/[name].css?[contenthash]',
        chunkFilename: isDevMode
          ? 'css/[name].css'
          : 'css/[name].css?[contenthash]'
      })
    },
    MultiHtmlWebpackPlugins: () => {
      return htmlFiles.map(file => {
        const name = file.split('.')[0]
        return new HtmlWebpackPlugin({
          minify: false,
          chunks: [name],
          filename: `${file}`,
          template: `${PATHS.public}/${file}`,
          include: {
            critical: `<!--#include virtual="${PATHS.baseUrl}${name}.critical.tpl" -->`
          }
        })
      })
    },
    MultiHtmlCriticalWebpackPlugins: () => {
      return htmlFiles.map(file => {
        const name = file.split('.')[0]
        return new HtmlCriticalWebpackPlugin(
          {
            base: resolve('dist'),
            src: file,
            dest: file,
            css: [
              // css files to scan
              `./dist/css/${name}.css`
              // `./dist/css/${name}-desktop.css`,
              // `./dist/css/${name}-tablet.css`,
              // `./dist/css/${name}-mobile.css`,
              // `./dist/css/alert.css`,
              // `./dist/css/mediaelement.css`,
              // `./dist/css/swiper.css`,
              // `./dist/css/toast.css`
            ],
            inline: true,
            minify: true,
            extract: true,
            dimensions: [
              {
                width: 414,
                height: 736
              },
              {
                width: 768,
                height: 1024
              },
              {
                width: 1200,
                height: 500
              }
            ],
            // ignore: ['@font-face'],
            penthouse: {
              blockJSRequests: false
            }
          },
          function (html) {
            const criticalCode =
              '<style>' + html.split('<style>')[1].split('</head>')[0]
            const restCode = html.replace(criticalCode, '')
            fs.writeFileSync(`./dist/${name}.critical.tpl`, criticalCode)
            fs.writeFileSync(`./dist/${name}.shtm`, restCode)
          }
        )
      })
    },
    ScriptExtHtmlWebpackPlugin: () => {
      return new ScriptExtHtmlWebpackPlugin({
        defaultAttribute: 'defer'
      })
    },
    SvgStorePlugin: () => {
      return new SvgStorePlugin()
    },
    HtmlWebpackDeployPlugin: () => {
      return new HtmlWebpackDeployPlugin({
        packages: {
          'animate.css': {
            copy: [{ from: 'animate.min.css', to: 'animate.min.css' }],
            links: 'animate.min.css'
          },
          vue: {
            copy: isDevMode
              ? [{ from: 'dist/vue.js', to: 'vue.js' }]
              : [{ from: 'dist/vue.runtime.min.js', to: 'vue.runtime.min.js' }],
            scripts: 'vue.js'
          },
          'vue-router': {
            copy: [{ from: 'dist/vue-router.min.js', to: 'vue-router.min.js' }],
            scripts: 'vue-router.min.js'
          },
          vuex: {
            copy: [{ from: 'dist/vuex.min.js', to: 'vuex.min.js' }],
            scripts: 'vuex.min.js'
          }
        },
        append: false,
        useCdn: false,
        hash: false,
        packagesPath: 'vendor'
      })
    },
    VueLoaderPlugin: () => {
      return new VueLoaderPlugin()
    },
    WebpackProvidePlugin: () => {
      return new webpack.ProvidePlugin({
        // $: 'jquery',
        // jQuery: 'jquery',
        // Vue: 'vue/dist/vue.js',
        app: resolve('./src/assets/js/app.js'),
        anime: 'animejs/lib/anime.js'
        // axios: 'axios'
        // Waypoint: ['waypoints/lib/noframework.waypoints.js', 'waypoints/lib/shortcuts/inview.js']
      })
    }
  }

  return {
    mode: options.mode,
    devtool: isDevMode ? 'eval' : 'none',
    devServer: {
      contentBase: [
        path.join(__dirname, 'src'),
        PATHS.public,
        path.join(__dirname, 'dist')
      ],
      historyApiFallback: {
        rewrites: [
          { from: /^\/$/, to: '/index.shtm' },
          { from: /^\/about$/, to: '/about.shtm' },
          { from: /^\/boardOrganization$/, to: '/boardOrganization.shtm' },
          { from: /^\/businessModel$/, to: '/businessModel.shtm' },
          { from: /^\/career$/, to: '/career.shtm' },
          { from: /^\/contact$/, to: '/contact.shtm' },
          { from: /^\/corporateGovernance$/, to: '/corporateGovernance.shtm' },
          { from: /^\/CSR$/, to: '/CSR.shtm' },
          { from: /^\/events$/, to: '/events.shtm' },
          { from: /^\/eventView$/, to: '/eventView.shtm' },
          { from: /^\/financialInfos$/, to: '/financialInfos.shtm' },
          { from: /^\/historyMilestones$/, to: '/historyMilestones.shtm' },
          { from: /^\/IDCP$/, to: '/IDCP.shtm' },
          { from: /^\/investors$/, to: '/investors.shtm' },
          { from: /^\/managementTeam$/, to: '/managementTeam.shtm' },
          { from: /^\/news$/, to: '/news.shtm' },
          { from: /^\/newsView$/, to: '/newsView.shtm' },
          { from: /^\/rd$/, to: '/rd.shtm' },
          { from: /^\/rdView$/, to: '/rdView.shtm' },
          { from: /^\/shareholdersMeeting$/, to: '/shareholdersMeeting.shtm' },
          { from: /^\/stakeholder$/, to: '/stakeholder.shtm' },
          { from: /^\/whistleblowerSystem$/, to: '/whistleblowerSystem.shtm' }
        ]
      },
      hot: true,
      host: '0.0.0.0',
      https: true,
      // open: true,
      openPage: 'contact',
      port: 8000,
      proxy: {
        '/api': {
          target: 'https://localhost:3000',
          changeOrigin: true,
          secure: false
        }
      },
      publicPath: '/',
      useLocalIp: true,
      watchContentBase: true
    },
    entry: htmlBasenames.reduce((acc, name) => {
      acc[name] = `./src/js/${name}.js`
      return acc
    }, {}),
    output: {
      filename: isDevMode ? 'js/[name].js' : 'js/[name].js?[hash:8]',
      path: resolve('dist'),
      chunkFilename: isDevMode ? 'js/[name].js' : 'js/[name].js?[contenthash]',
      publicPath: PATHS.relative ? './' : '/',
      pathinfo: isDevMode
    },
    target: 'web',
    // externals: {
    //   jquery: 'jQuery',
    //   vue: 'Vue',
    //   vuex: 'Vuex',
    //   'vue-router': 'VueRouter'
    // },
    resolve: {
      extensions: ['.vue', '.mjs', '.js', '.json'],
      alias: {
        '@': resolve('./src')
      }
    },
    module: {
      noParse: /jquery|lodash/,
      rules: [
        {
          test: /\.js$/,
          exclude: [
            resolve('./node_modules/'),
            resolve('./src/assets/html-critical-webpack-plugin-fork')
          ],
          use: ['babel-loader']
        },
        {
          test: /\.(jpe?g|png)$/i,
          include: resolve('./src/assets/responsiveImages/'),
          use: [
            {
              loader: 'responsive-loader',
              options: {
                adapter: require('responsive-loader/sharp'),
                name: '[name]-[width].[ext]',
                outputPath: 'images',
                publicPath: PATHS.relative ? './images/' : '/images/'
              }
            }
          ]
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          include: resolve('./src/assets/images/'),
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'images',
                publicPath: PATHS.relative ? './images/' : '/images/',
                esModule: false
              }
            }
          ]
        },
        {
          test: /\.(ogg|mp4|webm)$/i,
          include: resolve('./src/assets/videos/'),
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'videos',
                publicPath: PATHS.relative ? './videos/' : '/videos/',
                esModule: false
              }
            }
          ]
        },
        {
          test: /\.svg$/i,
          include: resolve('./src/assets/sprite/'),
          loader: SvgStorePlugin.loader,
          options: {
            name: 'images/sprite.svg',
            iconName: '[name]-[contenthash]',
            publicPath: PATHS.relative ? './' : '/',
            svgoOptions: {
              plugins: [
                { collapseGroups: true },
                { convertPathData: true },
                { convertStyleToAttrs: true },
                { convertTransform: true },
                { removeDesc: true },
                { removeViewBox: false },
                { removeDimensions: true },
                { convertColors: { shorthex: false } }
              ]
            }
          }
        },
        {
          test: /\.svg$/i,
          include: resolve('./node_modules/'),
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'images',
            publicPath: PATHS.relative ? './images/' : '/images/'
          }
        },
        {
          test: /\.svg$/i,
          include: resolve('./src/assets/inlineSVG/'),
          loader: 'svg-inline-loader'
        },
        // {
        //   test: /\.(sass|scss|css)$/,
        //   // include: [resolve('./src/sass/'), resolve('./src/components/'), resolve('./node_modules/')],
        //   use: [
        //     // keep orders
        //     isDevMode ? 'style-loader' : loaders.MiniCssExtractPluginLoader,
        //     loaders.cssLoader,
        //     loaders.postCssLoader,
        //     loaders.resolveUrlLoader,
        //     loaders.groupCssMediaQueriesLoader,
        //     loaders.sassLoader
        //   ]
        // },
        {
          test: /\.sass$/,
          use: [
            // keep orders
            isDevMode ? 'style-loader' : loaders.MiniCssExtractPluginLoader,
            loaders.cssLoader,
            loaders.postCssLoader,
            loaders.resolveUrlLoader,
            loaders.groupCssMediaQueriesLoader,
            {
              loader: 'sass-loader',
              options: {
                additionalData: `@import './src/sass/_abstracts.sass'`,
                sourceMap: true,
                implementation: require('sass'),
                sassOptions: {
                  indentedSyntax: true,
                  fiber: require('fibers'),
                  sourceMap: true,
                  outputStyle: 'expanded',
                  includePaths: ['src/sass']
                }
              }
            }
          ]
        },
        {
          test: /\.s?css$/,
          use: [
            // keep orders
            isDevMode ? 'style-loader' : loaders.MiniCssExtractPluginLoader,
            loaders.cssLoader,
            loaders.postCssLoader,
            loaders.resolveUrlLoader,
            loaders.groupCssMediaQueriesLoader,
            {
              loader: 'sass-loader',
              options: {
                additionalData: `@import './src/sass/_abstracts.sass';`,
                sourceMap: true,
                implementation: require('sass'),
                sassOptions: {
                  fiber: require('fibers'),
                  sourceMap: true,
                  outputStyle: 'expanded',
                  includePaths: ['src/sass']
                }
              }
            }
          ]
        },
        {
          test: require.resolve('pace-js'),
          use: ['imports-loader?define=>false']
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)$/i,
          include: PATHS.fonts,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'fonts',
                publicPath: PATHS.relative ? '../fonts/' : '/fonts/'
              }
            }
          ]
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        }
      ]
    },
    plugins: isDevMode
      ? [
          // keep orders
          // plugins.CleanWebpackPlugin(),
          plugins.VueLoaderPlugin(),
          plugins.DefinePlugin(),
          plugins.FriendlyErrorsWebpackPlugin(),
          plugins.WebpackProvidePlugin(),
          plugins.MiniCssExtractPlugin(),
          plugins.IconfontPlugin(),
          plugins.SvgStorePlugin(),
          // plugins.CopyWebpackPlugin(),
          ...plugins.MultiHtmlWebpackPlugins(),
          // plugins.HtmlWebpackDeployPlugin(),
          plugins.ScriptExtHtmlWebpackPlugin()
        ]
      : [
          // keep orders
          plugins.VueLoaderPlugin(),
          plugins.CleanWebpackPlugin(),
          plugins.DefinePlugin(),
          plugins.FriendlyErrorsWebpackPlugin(),
          plugins.WebpackProvidePlugin(),
          plugins.MiniCssExtractPlugin(),
          // plugins.MediaQueryPlugin(),
          plugins.SvgStorePlugin(),
          // plugins.CopyWebpackPlugin(),
          ...plugins.MultiHtmlWebpackPlugins(),
          // plugins.HtmlWebpackDeployPlugin(),
          plugins.FaviconsWebpackPlugin(),
          ...plugins.MultiHtmlCriticalWebpackPlugins(),
          plugins.ScriptExtHtmlWebpackPlugin()
        ],
    optimization: {
      minimizer: [
        new TerserJSPlugin({ cache: true, sourceMap: true }),
        new OptimizeCssAssetsPlugin({})
      ],
      // runtimeChunk: {
      //   name: 'runtime'
      // },
      splitChunks: {
        chunks: 'async',
        cacheGroups: {
          styles: {
            // name: 'styles',
            name(module, chunks) {
              // const moduleFileName = module
              //   .identifier()
              //   .split('/')
              //   .reduceRight(item => item);
              const allChunksNames = chunks.map(item => item.name).join('~')
              // console.log(`cacheGroupKey= ${cacheGroupKey}`);
              // console.log(`allChunksNames= ${allChunksNames}`);
              // console.log(`moduleFileName= ${moduleFileName}`);
              return allChunksNames
            },
            test: /\.css$/i,
            chunks: 'all',
            enforce: true,
            priority: 1
          },
          commons: {
            name: 'commons',
            test: resolve('src/assets/js'),
            priority: 2,
            minSize: 1000
          },
          vendors: {
            name: 'vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: 2,
            minSize: 1000
          }
        }
      }
    },
    stats: 'errors-only'
  }
}
