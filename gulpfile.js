// PLUGINS
// --------------------------------------------------------------
//
var
  // util plugins
  gulp         = require('gulp'),
  del          = require('del'),
  out          = require('gulp-out'),
  connect      = require('gulp-connect'),
  fileinclude  = require('gulp-file-include'),

  // style plugins
  sass         = require('gulp-ruby-sass'),
  minifyCss    = require('gulp-minify-css'),
  autoprefixer = require('gulp-autoprefixer'),

  // script plugins
  include      = require('gulp-include'),
  uglify       = require('gulp-uglify'),

  // image plugins
  imagemin     = require('gulp-imagemin');



// PATHS
// --------------------------------------------------------------
//
var
  settings = {
    dir: {
      src:  'source/',
      dist: 'public/assets/'
    },

    folder: {
      scripts: 'javascripts/',
      styles:  'stylesheets/',
      images:  'images/',
      fonts:   'fonts/'
    },

    server: {
      port: 5000
    }
  };

var
  path = {

    // source paths
    src_scripts:  settings.dir.src + settings.folder.scripts + '*.js',
    src_styles:   settings.dir.src + settings.folder.styles,
    src_images:  [settings.dir.src + settings.folder.images + '*.png',
                  settings.dir.src + settings.folder.images + '*.jpg',
                  settings.dir.src + settings.folder.images + '*.svg'],
    src_fonts:   [settings.dir.src + settings.folder.fonts + '*.eot',
                  settings.dir.src + settings.folder.fonts + '*.svg',
                  settings.dir.src + settings.folder.fonts + '*.ttf',
                  settings.dir.src + settings.folder.fonts + '*.woff',
                  settings.dir.src + settings.folder.fonts + '*.woff2'],

    // build paths
    build_scripts: settings.dir.dist + settings.folder.scripts,
    build_styles:  settings.dir.dist + settings.folder.styles,
    build_images:  settings.dir.dist + settings.folder.images,
    build_fonts:   settings.dir.dist + settings.folder.fonts,

    // watch paths
    watch_styles:  settings.dir.src + settings.folder.styles + '**/*.scss',
    watch_scripts: settings.dir.src + settings.folder.scripts + '**/*.js'
  };



// SERVER
// --------------------------------------------------------------
//
gulp.task('connect', function() {
  connect.server({
    port: 5000,
    livereload: true
  });
});



// SCRIPTS
// --------------------------------------------------------------
//
gulp.task('scripts', function() {
  return gulp.src(path.src_scripts)
    .pipe(include())
      .on('error', console.log)
    .pipe(gulp.dest(path.build_scripts));
});



// STYLES
// --------------------------------------------------------------
//
gulp.task('styles', function() {
  return sass(path.src_styles, {style: 'expanded'})
    .on('error', sass.logError)
    .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
    .pipe(gulp.dest(path.build_styles));
});



// IMAGES
// --------------------------------------------------------------
//
gulp.task('images', function() {
  return gulp.src(path.src_images)
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(gulp.dest(path.build_images));
});



// FONTS
// --------------------------------------------------------------
//
gulp.task('fonts', function() {
  return gulp.src(path.src_fonts)
    .pipe(gulp.dest(path.build_fonts));
});



// WATCHING
// --------------------------------------------------------------
//
gulp.task('watch', function() {
  gulp.watch(path.watch_scripts, ['scripts']);
  gulp.watch(path.watch_styles, ['styles']);
  gulp.watch(path.src_images, ['images']);
  gulp.watch(path.src_fonts, ['fonts']);
});



// UTILITIES
// --------------------------------------------------------------
//
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
//
gulp.task('build', function() {
  gulp.start('scripts');
  gulp.start('styles');
  gulp.start('images');
  gulp.start('fonts');
});

gulp.task('develop', ['connect'], function() {
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
