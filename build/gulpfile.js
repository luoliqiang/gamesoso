const { watch, src, dest } = require('gulp');
var connect = require('gulp-connect');
var sass = require('gulp-sass');

function css () {
    return src('../assets/scss/*.scss')
        .pipe(sass())
        .pipe(dest('../assets/css'))
}

function compileCss (cb) {
    watch('../assets/scss/*.scss', css)
}

function autoReload () {
    const htmlPath = '../pages/**/*.html'
    const cssPath = '../assets/css/*.css'
    watch([cssPath, htmlPath], function () {
        return src(htmlPath)
            .pipe(connect.reload())
    })
}

function server () {
    connect.server({
        root: '../',
        port: 3000,
        livereload: true
    })
}

exports.default = function (cb) {
    server()
    compileCss()
    autoReload()
    cb()
}