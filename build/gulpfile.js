const { watch, src, dest } = require('gulp');
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
    return src('../src/js/app/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(dest('../src/js/app-build'))
        .piple
}

function clean () {
    return src(['dist'], {read: false})
        .pipe(clean());
}

function copy () {
    return src(['../src/**/*'])
        .pipe(dest('../dist'));
}

exports.default = function (cb) {
    server()
    compileCss()
    autoReload()
    cb()
}
exports.build = function (cb) {
    clean()
    copy()
    transfromJs()
    cb()
}