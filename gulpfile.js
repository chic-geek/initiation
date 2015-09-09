// PLUGINS
// --------------------------------------------------------------
var gulp         = require('gulp'),
    sass         = require('gulp-ruby-sass'),
    include      = require('gulp-include'),
    imagemin     = require('gulp-imagemin'),
    del          = require('del'),
    minifyCss    = require('gulp-minify-css'),
    out          = require('gulp-out'),
    uglify       = require('gulp-uglify')
    autoprefixer = require('gulp-autoprefixer');


// PATHS
// --------------------------------------------------------------
var dir = {
  src:   'source/',
  build: 'build/assets/'
}

var folder = {
  scripts: 'javascripts/',
  styles:  'stylesheets/',
  images:  'images/',
  fonts:   'fonts/'
};

var path = {
  src_scripts:  dir.src + folder.scripts + '*.js',
  src_styles:   dir.src + folder.styles,

  src_images:   [dir.src + folder.images + '*.png',
                 dir.src + folder.images + '*.jpg',
                 dir.src + folder.images + '*.svg'],

  src_fonts:    [dir.src + folder.fonts + '*.eot',
                 dir.src + folder.fonts + '*.svg',
                 dir.src + folder.fonts + '*.ttf',
                 dir.src + folder.fonts + '*.woff',
                 dir.src + folder.fonts + '*.woff2'],

  build_scripts: dir.build + folder.scripts,
  build_styles:  dir.build + folder.styles,
  build_images:  dir.build + folder.images,
  build_fonts:   dir.build + folder.fonts,

  watch_styles:  dir.src + folder.styles + '**/*.scss',
  watch_scripts:  dir.src + folder.scripts + '**/*.js'
};


// SCRIPTS
// --------------------------------------------------------------
gulp.task('scripts', function() {
  return gulp.src(path.src_scripts)
    .pipe(include())
      .on('error', console.log)
    .pipe(gulp.dest(path.build_scripts));
});


// STYLES
// --------------------------------------------------------------
gulp.task('styles', function() {
  return sass(path.src_styles, {style: 'expanded'})
    .on('error', sass.logError)
    .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
    .pipe(gulp.dest(path.build_styles));
});


// IMAGES
// --------------------------------------------------------------
gulp.task('images', function() {
  return gulp.src(path.src_images)
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(gulp.dest(path.build_images));
});


// FONTS
// --------------------------------------------------------------
gulp.task('fonts', function() {
  return gulp.src(path.src_fonts)
    .pipe(gulp.dest(path.build_fonts));
});


// WATCHING
// --------------------------------------------------------------
gulp.task('watch', function() {
  gulp.watch(path.watch_scripts, ['scripts']);
  gulp.watch(path.watch_styles, ['styles']);
  gulp.watch(path.src_images, ['images']);
  gulp.watch(path.src_fonts, ['fonts']);
});


// UTILITIES
// --------------------------------------------------------------
gulp.task('clean', function() {
  del([
    dir.build + folder.scripts,
    dir.build + folder.styles,
    dir.build + folder.images,
    dir.build + folder.fonts
  ]);
});

gulp.task('squish-styles', function() {
  return gulp.src(path.build_styles + '*.css')
    .pipe(minifyCss({}))
    .pipe(out(path.build_styles + '{basename}.min{extension}'));
});

gulp.task('squish-scripts', function() {
  return gulp.src(path.build_scripts + '*.js')
    .pipe(uglify())
    .pipe(out(path.build_scripts + '{basename}.min{extension}'));
});


// GULP CLI TASKS
// --------------------------------------------------------------
gulp.task('build', function() {
  gulp.start('scripts');
  gulp.start('styles');
  gulp.start('images');
  gulp.start('fonts');
});

gulp.task('develop', function() {
  gulp.start('watch');
});

gulp.task('deploy', ['clean'], function() {
  gulp.start('build');

  setTimeout(function() {
    gulp.start('squish-styles');
    gulp.start('squish-scripts');
  }, 2000);
});


// NOTES:
// Gulp tasks are run asynchronously so we'll use a setTimeout
// function(s) to allow us to run tasks in a sequence.
