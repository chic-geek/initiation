// **************************************************************
// GULPFILE
// **************************************************************


// ==============================================================
// Gulp plugins
// ==============================================================
//
var
  // utility plugins
  fileinclude  = require('gulp-file-include'),
  connect      = require('gulp-connect'),
  gulp         = require('gulp'),
  del          = require('del'),
  out          = require('gulp-out')

  // styling plugins
  autoprefixer = require('gulp-autoprefixer'),
  minifyCss    = require('gulp-minify-css'),
  sass         = require('gulp-ruby-sass'),

  // scripting plugins
  include      = require('gulp-include'),
  uglify       = require('gulp-uglify'),

  // imaging plugins
  imagemin     = require('gulp-imagemin');




// ==============================================================
// Settings
// ==============================================================
//
var
  settings = {

    // directories
    // bear in mind that if you amend these, you'll need to change .gitignore too.
    dir: {
      source: 'source/',
      public: 'public/',
      dist:   'build/'
    },

    // assets directories
    asset_dir: {
      scripts: 'javascripts/',
      styles:  'stylesheets/',
      images:  'images/',
      fonts:   'fonts/'
    },

    // server details
    server: {
      port: 5000
    }
  };




// ==============================================================
// Asset tasks
// ==============================================================
//

// Stylesheets
// --------------------------------------------------------------
//
gulp.task('styles', function() {
  return sass(
    settings.dir.source + settings.asset_dir.styles, { style: 'expanded' }
  )

  // setup error logging for scss compilation.
  .on('error', sass.logError)

  // run through autoprefixer.
  .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))

  // spit out the file into the public directory.
  .pipe(gulp.dest( settings.dir.public + settings.asset_dir.styles ));
});


// Javascripts
// --------------------------------------------------------------
//
gulp.task('scripts', function() {
  return gulp.src(
    settings.dir.source + settings.asset_dir.scripts + '*.js'
  )

  // gulp include allows you to 'require' files in similar fashion to sprockets.
  .pipe(include())
  .on('error', console.log)

  // once again spit out final file into public directory.
  .pipe(gulp.dest( settings.dir.public + settings.asset_dir.scripts ));
});


// Images
// --------------------------------------------------------------
//
gulp.task('images', function() {
  return gulp.src([
    settings.dir.source + settings.asset_dir.images + '*.jpg',
    settings.dir.source + settings.asset_dir.images + '*.png',
    settings.dir.source + settings.asset_dir.images + '*.gif',
    settings.dir.source + settings.asset_dir.images + '*.svg'
  ])

  // run through imagemin processor to compress the crap outta them.
  .pipe(imagemin({
    progressive: true
  }))

  // drop the final images into the public directory.
  .pipe(gulp.dest( settings.dir.public + settings.asset_dir.images ));
});


// Fonts
// --------------------------------------------------------------
//
gulp.task('fonts', function() {
  return gulp.src([
    settings.dir.source + settings.asset_dir.fonts + '**/*'
    // settings.dir.source + settings.asset_dir.fonts + '*.eot',
    // settings.dir.source + settings.asset_dir.fonts + '*.ttf',
    // settings.dir.source + settings.asset_dir.fonts + '*.svg',
    // settings.dir.source + settings.asset_dir.fonts + '*.woff',
    // settings.dir.source + settings.asset_dir.fonts + '*.woff2'
  ])

  // pipe to the public destination.
  .pipe(gulp.dest( settings.dir.public + settings.asset_dir.fonts ));
});


// Partials
// --------------------------------------------------------------
//
gulp.task('fileinclude', function() {
  gulp.src(
    settings.dir.source + '*.html'
  )
  .pipe(fileinclude({
    prefix: '@@',
    basepath: '@file'
  }))
  .on('error', console.log)
  .pipe(gulp.dest(settings.dir.public));
});




// ==============================================================
// Utility tasks
// ==============================================================
//

// Server setup
// --------------------------------------------------------------
//
gulp.task('server', function() {
  connect.server({
    port: settings.server.port,
    root: settings.dir.public,
    livereload: true
  });
});


// Watch files
// --------------------------------------------------------------
//
gulp.task('watch', function() {
  gulp.watch( settings.dir.source + settings.asset_dir.scripts + '/**/*', ['scripts']);
  gulp.watch( settings.dir.source + settings.asset_dir.styles + '/**/*', ['styles']);
  gulp.watch( settings.dir.source + settings.asset_dir.images + '/**/*', ['images']);
  gulp.watch( settings.dir.source + settings.asset_dir.fonts + '/**/*', ['fonts']);
  gulp.watch( settings.dir.source + '/**/*.html', ['fileinclude']);
});


// Remove all files in the public and dist directories
// --------------------------------------------------------------
//
gulp.task('spring-clean', function() {
  del([
    settings.dir.public,
    settings.dir.dist
  ]);
});


// Copy EVERYTHING in public to dist directory
// --------------------------------------------------------------
//
gulp.task('public-build', function() {
  return gulp.src(
    settings.dir.public + '/**/*', { base: './' + settings.dir.public }
  )
  .pipe(gulp.dest( settings.dir.dist ));
});


// Compress and uglify assets
// --------------------------------------------------------------
//
gulp.task('compress-styles', function() {
  return gulp.src(
    settings.dir.dist + settings.asset_dir.styles + '*.css'
  )
  .pipe( minifyCss({}) )
  .pipe(out( settings.dir.dist + settings.asset_dir.styles + '{basename}.min{extension}' ));
});


gulp.task('compress-scripts', function() {
  return gulp.src(
    settings.dir.dist + settings.asset_dir.scripts + '*.js'
  )
  .pipe(uglify())
  .pipe(out( settings.dir.dist + settings.asset_dir.scripts + '{basename}.min{extension}' ));
});




// ==============================================================
// CLI tasks
// ==============================================================
//

// We've got a few CLI tasks available to us, they're as follows:
//
// * gulp pipeline       // Simply builds and watches the files.
// * gulp pipeline-serve // Builds and watches the files then serves it up.
// * gulp pipeline-clean // Cleans out both the public and dist directories.
// * gulp pipeline-build // Collects everything up from public and minifies into dist dir.

gulp.task('pipeline', ['styles', 'scripts', 'images', 'fonts'], function() {
  gulp.start('watch');
});

gulp.task('pipeline-serve', ['server', 'fileinclude'], function() {
  gulp.start('pipeline');
});

// this task cleans out the public and distribution directories.
gulp.task('pipeline-clean', function() {
  gulp.start('spring-clean');
});

// cleans out everything then builds and minifies all assets
gulp.task('pipeline-build', ['spring-clean', 'styles', 'scripts', 'images', 'fonts', 'fileinclude'], function() {
  gulp.start('public-build');

  setTimeout(function(){
    gulp.start('compress-styles');
    gulp.start('compress-scripts');
  }, 2000);
});
