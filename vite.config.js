import { defineConfig } from "vite";
import autoprefixer from "autoprefixer";
import pxToRem from "postcss-pxtorem";
import htmlMinify from 'vite-plugin-html-minify';
import compression from 'vite-plugin-compression';
import path from "path";

export default defineConfig(({ mode }) => {
    const isDev = mode === "development";

    return {
        root: path.resolve(__dirname, "src"),  // 让开发和入口都在 src 目录
        base: "./",                            // 打包资源相对路径
        publicDir: path.resolve(__dirname, "public"), // 静态资源放项目根的 public
        plugins: [
            htmlMinify({
                minifyOptions: {
                    collapseWhitespace: true,
                    removeComments: true,
                    removeRedundantAttributes: true,
                    removeEmptyAttributes: true,
                    minifyCSS: true,
                    minifyJS: true,
                }
            }),
            compression({
                verbose: true,       // 控制台输出压缩结果
                disable: false,      // 启用压缩
                threshold: 10240,    // 超过 10kb 才压缩
                algorithm: 'gzip',   // 压缩算法，支持 gzip、brotliCompress 等
                ext: '.gz',          // 生成文件后缀名
            }),
        ],
        build: {
            outDir: path.resolve(__dirname, "dist"), // 打包产物输出到项目根的 dist
            emptyOutDir: true,
            rollupOptions: {
                input: {
                    main: path.resolve(__dirname, "src/index.html"),
                },
                output: {
                    assetFileNames: (assetInfo) => {
                        const extType = assetInfo.name.split(".").pop();
                        if (/ttf|woff2?|otf|eot|svg/i.test(extType)) {
                            return "fonts/[name]-[hash][extname]";
                        }
                        if (/png|jpe?g|gif|svg|webp/i.test(extType)) {
                            return "images/[name]-[hash][extname]";
                        }
                        if (/css/i.test(extType)) {
                            return "styles/[name]-[hash][extname]";
                        }
                        return "assets/[name]-[hash][extname]";
                    },
                    chunkFileNames: "scripts/[name]-[hash].js",
                    entryFileNames: "scripts/[name]-[hash].js",
                    manualChunks(id) {
                        // 这里判断路径，把 config.js 单独拆成一个 chunk
                        if (id.includes("af_smart_script")) {
                            return 'af_smart_script'
                        }
                        return 'main'
                    }
                },
            },
            minify: isDev ? false : "esbuild",
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `` // 全局 SCSS 变量
                },
            },
            postcss: {
                plugins: [
                    autoprefixer(),
                    // 启用 pxToRem
                    // pxToRem({
                    //     rootValue: 75,
                    //     propList: ["*"],
                    //     minPixelValue: 1,
                    // }),
                ],
            },
        },
        server: {
            host: "0.0.0.0",
            port: 9000,
            open: false,
            proxy: {
                "/api": {
                    target: "http://192.168.3.156:5003",
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ""),
                },
            },
        },
    };
});