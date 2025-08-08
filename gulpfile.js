import gulp from "gulp";
import htmlmin from "gulp-htmlmin";
import cleanCSS from "gulp-clean-css";
import uglify from "gulp-uglify";
import { deleteAsync } from "del";
import postcss from "gulp-postcss";
import sourcemaps from "gulp-sourcemaps";
import * as dartSass from "sass";
import gulpSass from "gulp-sass";
import webserver from "gulp-webserver";
import rev from "gulp-rev";
import revRewrite from "gulp-rev-rewrite";
import autoprefixer from "autoprefixer";
import fs from "fs";
import concat from 'gulp-concat';
import pxToRem from "postcss-pxtorem";
import buffer from 'vinyl-buffer';

const sass = gulpSass(dartSass);
const isDev = process.env.NODE_ENV === "development";
const manifestPath = "dist/rev-manifest.json";

// PostCSS 插件配置
const postcssPlugins = [
    autoprefixer(),
    // pxToRem({
    //     rootValue: 75,
    //     propList: ["*"],
    //     minPixelValue: 1,
    // }),
];

// 统一读取 rev-manifest.json
function getManifest() {
    if (fs.existsSync(manifestPath)) {
        return fs.readFileSync(manifestPath, "utf-8");
    }
    return {};
}

// 编译 SCSS
export function compileSCSS() {
    let stream = gulp.src("src/styles/*.scss").pipe(concat('index.css')); // 使用 buffer 以支持二进制文件

    if (isDev) {
        stream = stream.pipe(sourcemaps.init());
    }

    stream = stream.pipe(sass().on("error", sass.logError)).pipe(postcss(postcssPlugins));

    if (!isDev) {
        stream = stream
            .pipe(cleanCSS())
            .pipe(rev()) // 添加 hash
            .pipe(gulp.dest("dist/styles"))
            .pipe(rev.manifest(manifestPath, { merge: true }))
            .pipe(gulp.dest("."));
    } else {
        stream = stream.pipe(sourcemaps.write(".")).pipe(gulp.dest("dist/styles"));
    }

    return stream;
}

export function compileFont() {
    return gulp
        .src("src/fonts/**/*.{woff,woff2,ttf,otf,eot,svg}", { buffer: false }) // 使用 stream 模式读取
        .pipe(buffer()) // 强制转成 Buffer，确保写入二进制不损坏
        .pipe(gulp.dest("dist/fonts"));
}

// 压缩 HTML
export function minifyHTML() {
    let stream = gulp.src("src/*.html");

    if (!isDev) {
        stream = stream
            .pipe(htmlmin({ collapseWhitespace: true }))
            .pipe(revRewrite({ manifest: getManifest() }));
    }

    return stream.pipe(gulp.dest("dist"));
}

// 压缩合并 JS
export function minifyJS() {
    let stream = gulp.src(["src/scripts/*.js", "!src/scripts/config.js"])
        .pipe(concat('bundle.js'));  // 合并成 bundle.js
    if (isDev) {
        stream = stream.pipe(sourcemaps.init());
    }
    if (!isDev) {
        stream = stream
            .pipe(uglify())
            .pipe(rev())
            .pipe(gulp.dest("dist/scripts"))
            .pipe(rev.manifest(manifestPath, { merge: true }))
            .pipe(gulp.dest("."));
    } else {
        stream = stream.pipe(sourcemaps.write(".")).pipe(gulp.dest("dist/scripts"));
    }
    return stream;
}
// 移动 config.js 文件（可选）
export function moveConfig() {
    let stream = gulp.src("src/scripts/config.js");
    if (isDev) {
        stream = stream.pipe(sourcemaps.init());
    }
    if (!isDev) {
        stream = stream
            .pipe(uglify())
            .pipe(rev())
            .pipe(gulp.dest("dist/scripts"))
            .pipe(rev.manifest(manifestPath, { merge: true }))
            .pipe(gulp.dest("."));
    } else {
        stream = stream.pipe(sourcemaps.write(".")).pipe(gulp.dest("dist/scripts"));
    }
    return stream
}

// 拷贝图片（可选 hash）
export function optimizeImages() {
    let stream = gulp.src("src/images/**/*", { encoding: false });

    if (!isDev) {
        stream = stream
            .pipe(rev())
            .pipe(gulp.dest("dist/images"))
            .pipe(rev.manifest(manifestPath, { merge: true }))
            .pipe(gulp.dest("."));
    } else {
        stream = stream.pipe(gulp.dest("dist/images"));
    }

    return stream;
}

// 清空 dist
export function clean() {
    return deleteAsync(["dist/*"]);
}

// 本地开发服务器
export function startServer() {
    return gulp.src("dist").pipe(
        webserver({
            livereload: isDev,
            host: "0.0.0.0",
            open: false,
            port: 9000,
            proxies: [
                {
                    source: "/api",
                    target: "http://192.168.3.156:5003",
                    pathRewrite: { "^/api": "" },
                },
            ],
        })
    );
}

// 监听源文件变化
export function watchFiles() {
    gulp.watch("src/styles/*.scss", compileSCSS);
    gulp.watch("src/scripts/*.js", minifyJS);
    gulp.watch("src/scripts/config.js", moveConfig);
    gulp.watch("src/images/*", optimizeImages);
    gulp.watch("src/*.html", minifyHTML);
}

// 开发模式任务
export const dev = gulp.series(
    clean,
    gulp.parallel(compileFont, optimizeImages, compileSCSS, minifyJS, moveConfig, minifyHTML),
    gulp.parallel(startServer, watchFiles)
);

// 生产构建任务
export const build = gulp.series(
    clean,
    gulp.parallel(compileFont, optimizeImages, compileSCSS, minifyJS, moveConfig),
    gulp.parallel(minifyHTML)
);

// 默认任务（开发）
export default dev;