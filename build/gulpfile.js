const { watch, src, dest, series } = require('gulp');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var proxy = require('http-proxy-middleware').createProxyMiddleware;
var babel = require('gulp-babel');
var clean = require('gulp-clean');

function css () {
    return src('../src/assets/scss/*.scss')
        .pipe(sass())
        .pipe(dest('../src/assets/css'))
}

function compileCss (cb) {
    watch('../src/assets/scss/*.scss', css)
}

function autoReload () {
    const htmlPath = '../src/pages/**/*.html'
    const cssPath = '../src/assets/css/*.css'
    const scriptPath = '../src/js/**/*.js'
    watch([cssPath, htmlPath, scriptPath], function () {
        return src(htmlPath)
            .pipe(connect.reload())
    })
}

function server () {
    connect.server({
        root: '../src',
        port: 3000,
        livereload: true,
        middleware: function(connect, opt) {
            return [
                proxy('/api', {
                    target: 'http://47.110.51.187:9100/api',//代理的目标地址
                    changeOrigin: true,
                    pathRewrite: {// 路径重写规则
                        '^/api':''
                    }
                })
            ]
        }
    })
}

function transfromJs () {
    return src('../dist/js/app/**/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(dest('../dist/js/app'))
}

function cleanDist () {
    return src(['../dist'], {allowEmpty: true})
        .pipe(clean({force: true}));
}

function cleanNodemodules () {
    return src(['../dist/node_modules', '../dist/assets/scss'], {allowEmpty: true})
        .pipe(clean({force: true}));
}

function copy () {
    return src([
            '../src/**/*',
            '!../src/node_modules/',
            '!../src/node_modules/**',
            '!../src/assets/scss/',
            '!../src/assets/scss/**'
        ])
        .pipe(dest('../dist'));
}

exports.default = function (cb) {
    server()
    compileCss()
    autoReload()
    cb()
}
exports.build = series(cleanDist, copy, cleanNodemodules, transfromJs)
// function (cb) {
//     series(cleanDist, copy, transfromJs)
//     // cleanDist()
//     // copy()
//     // transfromJs()
//     // cleanNodemodules()
//     cb()
// }