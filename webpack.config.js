// 🚀 異次元通販 ウルトラバンドル最適化設定
// Worker3 コードクリーンアップ特化配置 - 208KB削減目標

const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

// 🎆 最適化設定
const OPTIMIZATION_CONFIG = {
  TARGET_SIZE_REDUCTION: 208, // KB
  CURRENT_SIZE: 758, // KB
  TARGET_SIZE: 550, // KB (758 - 208)
  COMPRESSION_LEVEL: 9,
  TREE_SHAKING: true,
  CODE_SPLITTING: true
};

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    mode: isProduction ? 'production' : 'development',
    
    // ⚡ エントリポイント最適化
    entry: {
      main: './ultra-sync-system.js',
      'cache-strategy': './api/cache-strategy.js',
      'security-check': './api/security-check.js',
      'performance-monitor': './monitoring/ultra-performance-monitor.js'
    },
    
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash:8].js' : '[name].js',
      chunkFilename: isProduction ? '[name].[contenthash:8].chunk.js' : '[name].chunk.js',
      clean: true,
      publicPath: '/',
      // 🚀 モジュールサイズ最適化
      chunkLoadingGlobal: 'ultraSyncChunks',
      environment: {
        arrowFunction: false,
        bigIntLiteral: false,
        const: false,
        destructuring: false,
        dynamicImport: false,
        forOf: false,
        module: false
      }
    },
    
    // 🌟 高速ビルド最適化
    optimization: {
      minimize: isProduction,
      minimizer: [
        // ⚡ JavaScript 最適化
        new TerserPlugin({
          terserOptions: {
            compress: {
              arguments: false,
              arrows: false,
              booleans: false,
              collapse_vars: false,
              comparisons: false,
              computed_props: false,
              hoist_funs: false,
              hoist_props: false,
              hoist_vars: false,
              if_return: false,
              inline: false,
              join_vars: false,
              keep_infinity: true,
              loops: false,
              negate_iife: false,
              properties: false,
              reduce_funcs: false,
              reduce_vars: false,
              switches: false,
              toplevel: false,
              typeofs: false,
              unused: true,
              conditionals: true,
              dead_code: true,
              drop_console: true,
              drop_debugger: true,
              evaluate: true,
              sequences: true,
              side_effects: false
            },
            mangle: {
              safari10: true,
              reserved: ['ultraSync', 'dimensionalCache', 'quantumShield']
            },
            format: {
              comments: false,
              ascii_only: true
            }
          },
          extractComments: false,
          parallel: true
        }),
        
        // CSS 最適化
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: [
              'default',
              {
                discardComments: { removeAll: true },
                normalizeWhitespace: true,
                colormin: true,
                convertValues: true,
                discardDuplicates: true,
                discardEmpty: true,
                discardOverridden: true,
                discardUnused: true,
                mergeIdents: true,
                mergeLonghand: true,
                mergeRules: true,
                minifyFontValues: true,
                minifyGradients: true,
                minifyParams: true,
                minifySelectors: true,
                normalizeCharset: true,
                normalizeDisplayValues: true,
                normalizePositions: true,
                normalizeRepeatStyle: true,
                normalizeString: true,
                normalizeTimingFunctions: true,
                normalizeUnicode: true,
                normalizeUrl: true,
                orderedValues: true,
                reduceIdents: true,
                reduceInitial: true,
                reduceTransforms: true,
                svgo: true,
                uniqueSelectors: true
              }
            ]
          }
        })
      ],
      
      // 🎆 高速 Code Splitting 最適化
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        minRemainingSize: 0,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50000,
        cacheGroups: {
          // 🚀 ベンダーライブラリ分離
          vendor: {
            test: /[\/\\]node_modules[\/\\]/,
            name: 'vendors',
            priority: 10,
            chunks: 'all',
            enforce: true
          },
          
          // ⚡ セキュリティモジュール分離
          security: {
            test: /security|crypto/,
            name: 'security',
            priority: 8,
            chunks: 'all',
            minSize: 0
          },
          
          // 📊 パフォーマンスモジュール分離
          performance: {
            test: /cache|monitor|performance/,
            name: 'performance',
            priority: 7,
            chunks: 'all',
            minSize: 0
          },
          
          // 🌟 コアシステム分離
          core: {
            test: /ultra-sync|dimensional/,
            name: 'core',
            priority: 6,
            chunks: 'all',
            minSize: 0
          },
          
          // 📝 ユーティリティ分離
          utils: {
            test: /utils|helpers|constants/,
            name: 'utils',
            priority: 5,
            chunks: 'all',
            minSize: 0
          },
          
          // 📊 デフォルトグループ
          default: {
            minChunks: 2,
            priority: -10,
            reuseExistingChunk: true,
            enforce: false
          }
        }
      },
      
      // 🎆 Tree Shaking 最適化
      usedExports: true,
      sideEffects: false,
      providedExports: true,
      
      // ⚡ モジュール結合最適化
      concatenateModules: true,
      
      // 🚀 マングル最適化
      mangleCssClassnames: true,
      
      // 🌟 ランタイムチャンク最適化
      runtimeChunk: {
        name: 'runtime'
      }
    },
    
    // 🚀 モジュール解決最適化
    resolve: {
      extensions: ['.js', '.json'],
      alias: {
        '@': path.resolve(__dirname, './'),
        '@api': path.resolve(__dirname, './api'),
        '@components': path.resolve(__dirname, './components'),
        '@services': path.resolve(__dirname, './services'),
        '@utils': path.resolve(__dirname, './utils')
      },
      // ⚡ モジュール検索最適化
      modules: ['node_modules'],
      symlinks: false,
      cacheWithContext: false
    },
    
    // 🎆 ローダー最適化
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: {
                      browsers: ['> 1%', 'last 2 versions']
                    },
                    modules: false,
                    useBuiltIns: 'usage',
                    corejs: 3
                  }
                ]
              ],
              plugins: [
                '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-proposal-object-rest-spread'
              ]
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                modules: {
                  localIdentName: isProduction ? '[hash:base64:8]' : '[name]__[local]__[hash:base64:5]'
                }
              }
            }
          ]
        }
      ]
    },
    
    // 🌟 プラグイン最適化
    plugins: [
      new MiniCssExtractPlugin({
        filename: isProduction ? '[name].[contenthash:8].css' : '[name].css',
        chunkFilename: isProduction ? '[name].[contenthash:8].chunk.css' : '[name].chunk.css'
      }),
      
      // 📊 バンドルサイズ分析
      ...(process.env.ANALYZE ? [
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: 'bundle-analysis.html',
          statsFilename: 'stats.json',
          generateStatsFile: true
        })
      ] : [])
    ],
    
    // ⚡ パフォーマンス最適化
    performance: {
      hints: isProduction ? 'warning' : false,
      maxEntrypointSize: OPTIMIZATION_CONFIG.TARGET_SIZE * 1024,
      maxAssetSize: 300000, // 300KB
      assetFilter: (assetFilename) => {
        return assetFilename.endsWith('.js') || assetFilename.endsWith('.css');
      }
    },
    
    // 🚀 キャッシュ最適化
    cache: {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename]
      },
      compression: 'gzip'
    },
    
    // 🎆 デバッグ情報最適化
    devtool: isProduction ? false : 'eval-cheap-module-source-map',
    
    // ⚡ 統計情報最適化
    stats: {
      preset: 'minimal',
      assets: true,
      chunks: true,
      modules: false,
      entrypoints: true,
      timings: true,
      colors: true,
      version: true,
      hash: true,
      children: false,
      warnings: true,
      errors: true,
      errorDetails: true
    }
  };
};