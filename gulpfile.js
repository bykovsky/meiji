const { src, dest, series, watch } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const sassGlob = require('gulp-sass-glob')
const pug = require('gulp-pug')
const concat = require('gulp-concat')
const htmlmin = require('gulp-htmlmin')
const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
const svgSprite = require('gulp-svg-sprite')
const del = require('del')
const babel = require('gulp-babel')
const image = require('gulp-image')
const webpImages = require('gulp-webp')
const uglify = require('gulp-uglify-es').default
const notify = require('gulp-notify')
const sourcemaps = require('gulp-sourcemaps')
const browserSync = require('browser-sync').create()

/* Projects paths */
const devPath = 'dev';

/*
  DEV PIPES

  run developer: gulp dev
*/

const cleanDirDev = () => {
  return del(devPath)
}

const stylesDev = () => {
  return src('source/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(sourcemaps.write())
    .pipe(browserSync.stream())
    .pipe(dest(devPath + '/css'))
}

const pugDev = () => {
  return src('source/pug/*.pug')
    .pipe(pug({
      doctype: 'html'
    }))
    .pipe(dest(devPath + '/'))
    .pipe(browserSync.stream())
}

const scriptsDev = () => {
  return src('source/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('script.min.js'))
    .pipe(sourcemaps.write())
    .pipe(dest(devPath + '/js'))
    .pipe(browserSync.stream())
}

const fontsDev = () => {
  return src('source/fonts/**/*.*')
    .pipe(dest(devPath + '/fonts'))
    .pipe(browserSync.stream())
}

const imagesDev = () => {
  return src([
    'source/img/**/*.svg'
  ])
    .pipe(image())
    .pipe(dest(devPath + '/img'))
    .pipe(browserSync.stream())
}

const svgSpritesDev = () => {
  return src('source/img/svg/*.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: '../sprite.svg'
        }
      }
    }))
    .pipe(dest(devPath + '/img'))
}

const images2webpDev = () => {
  return src([
    'source/img/**/*.jpg',
    'source/img/**/*.png',
    'source/img/**/*.gif'
  ])
    .pipe(webpImages())
    .pipe(dest(devPath + '/img'))
    .pipe(browserSync.stream())
}

/* copy files to the root directory */
const copyFilesDev = () => {
  return src([
    'source/*.jpg',
    'source/*.svg',
    'source/*.ico'
  ])
    .pipe(dest(devPath))
    .pipe(browserSync.stream())
}

const watchFilesDev = () => {
  browserSync.init({
    server: {
      baseDir: devPath
    }
  })
  watch('source/scss/**/*.scss', stylesDev)
  watch('source/**/*.pug', pugDev)
  watch('source/js/**/*.js', scriptsDev)
  watch('source/scss/fonts/**/*.*', fontsDev)
  watch('source/img/**/*.*', imagesDev)
  watch('source/img/svg/*.svg', svgSpritesDev)
  watch('source/img/**/*.*', images2webpDev)
}

exports.cleanDirDev = cleanDirDev
exports.stylesDev = stylesDev
exports.pugDev = pugDev
exports.scriptsDev = scriptsDev
exports.fontsDev = fontsDev
exports.copyFilesDev = copyFilesDev
exports.svgSpritesDev = svgSpritesDev
exports.watchFilesDev = watchFilesDev
exports.dev = series(cleanDirDev, stylesDev, pugDev, scriptsDev, fontsDev, imagesDev, images2webpDev, copyFilesDev, svgSpritesDev, watchFilesDev)
exports.default = series(cleanDirDev, stylesDev, pugDev, scriptsDev, fontsDev, imagesDev, images2webpDev, copyFilesDev, svgSpritesDev, watchFilesDev)

/*
  BUILD PIPES

  run build: gulp build
*/
