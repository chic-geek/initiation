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
    settings.dir.source + settings.asset_dir.fonts + '*.eot',
    settings.dir.source + settings.asset_dir.fonts + '*.ttf',
    settings.dir.source + settings.asset_dir.fonts + '*.svg',
    settings.dir.source + settings.asset_dir.fonts + '*.woff',
    settings.dir.source + settings.asset_dir.fonts + '*.woff2'
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
  .pipe(gulp.dest('./'));
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
    livereload: true
  });
});


// Watch files
// --------------------------------------------------------------
//
gulp.task('watch', function() {
  gulp.watch( settings.dir.source + settings.asset_dir.scripts + '**/*.js', ['scripts']);
  gulp.watch( settings.dir.source + settings.asset_dir.styles + '**/*.scss', ['styles']);
  gulp.watch( settings.dir.source + settings.asset_dir.images, ['images']);
  gulp.watch( settings.dir.source + settings.asset_dir.fonts, ['fonts']);
  gulp.watch( settings.dir.source + '**/*.html', ['fileinclude']);
});


// Remove all files in the public and dist directories
// --------------------------------------------------------------
//
gulp.task('spring-clean', function() {
  del([
    settings.dir.public + '**/*'
  ]);
});


// Compress and uglify assets
// --------------------------------------------------------------
//
gulp.task('compress-styles', function() {
  return gulp.src(
    settings.dir.public + '*.css'
  )
  .pipe( minifyCss({}) )
  .pipe(out( settings.dir.dist + '{basename}.min{extension}' ));
});


gulp.task('compress-scripts', function() {
  return gulp.src(
    settings.dir.public + '*.js'
  )
  .pipe(uglify())
  .pipe(out( settings.dir.dist + '{basename}.min{extension}' ));
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

gulp.task('pipeline', function() {
  gulp.start('scripts');
  gulp.start('styles');
  gulp.start('images');
  gulp.start('fonts');
  gulp.start('watch');
});

gulp.task('pipeline-serve', ['server'], function() {
  gulp.start('pipeline');
});

// this task cleans out the public and distribution directories.
gulp.task('pipeline-clean', function() {
  gulp.start('spring-clean');
});

// cleans out everything then builds and minifies all assets
gulp.task('pipeline-build', function() {

  // build out all assets
  gulp.start('scripts');
  gulp.start('styles');
  gulp.start('images');
  gulp.start('fonts');

  // compress and uglify project assets
  setTimeout(function() {
    gulp.start('compress-styles');
    gulp.start('compress-scripts');
  }, 2000);

  // copy EVERYTHING in public to distribution directory.
  gulp.start(function() {
    return gulp.src('public/**/*', { base: './public'})
    .pipe(gulp.dest( settings.dir.dist ));
  });
});







// // PLUGINS
// // --------------------------------------------------------------
// //
// var
//   // utility plugins
//   gulp         = require('gulp'),
//   del          = require('del'),
//   out          = require('gulp-out'),
//   connect      = require('gulp-connect'),
//   fileinclude  = require('gulp-file-include'),
//
//   // styling plugins
//   sass         = require('gulp-ruby-sass'),
//   minifyCss    = require('gulp-minify-css'),
//   autoprefixer = require('gulp-autoprefixer'),
//
//   // scripting plugins
//   include      = require('gulp-include'),
//   uglify       = require('gulp-uglify'),
//
//   // imaging plugins
//   imagemin     = require('gulp-imagemin');
//
//
//
// // SETTINGS
// // --------------------------------------------------------------
// //
// // Should you need to change anything, here is where you'd add,
// // change or access any settings.
// var
//   settings = {
//     dir: {
//       src:  'source/',
//       dist: 'public/assets/'
//     },
//
//     folder: {
//       scripts: 'javascripts/',
//       styles:  'stylesheets/',
//       images:  'images/',
//       fonts:   'fonts/'
//     },
//
//     server: {
//       port: 5000
//     }
//   };
//
//
//
// // PATH VARIABLES
// // --------------------------------------------------------------
// //
// // These variables are used to help setup where to look and
// // compile various files. You shouldn't need to change these but
// // may need to add new paths if required.
// var
//   path = {
//
//     // source paths
//     src_scripts:   settings.dir.src + settings.folder.scripts + '*.js',
//     src_styles:    settings.dir.src + settings.folder.styles,
//     src_images:   [settings.dir.src + settings.folder.images + '*.png',
//                    settings.dir.src + settings.folder.images + '*.jpg',
//                    settings.dir.src + settings.folder.images + '*.svg'],
//     src_fonts:    [settings.dir.src + settings.folder.fonts + '*.eot',
//                    settings.dir.src + settings.folder.fonts + '*.svg',
//                    settings.dir.src + settings.folder.fonts + '*.ttf',
//                    settings.dir.src + settings.folder.fonts + '*.woff',
//                    settings.dir.src + settings.folder.fonts + '*.woff2'],
//
//     // build paths
//     build_scripts: settings.dir.dist + settings.folder.scripts,
//     build_styles:  settings.dir.dist + settings.folder.styles,
//     build_images:  settings.dir.dist + settings.folder.images,
//     build_fonts:   settings.dir.dist + settings.folder.fonts,
//
//     // watch paths
//     watch_styles:  settings.dir.src + settings.folder.styles + '**/*.scss',
//     watch_scripts: settings.dir.src + settings.folder.scripts + '**/*.js'
//   };
//
//
//
// // SERVER
// // --------------------------------------------------------------
// //
// gulp.task('connect', function() {
//   connect.server({
//     port: settings.server.port,
//     livereload: true
//   });
// });
//
//
//
// // SCRIPTS
// // --------------------------------------------------------------
// //
// gulp.task('scripts', function() {
//   return gulp.src(path.src_scripts)
//     .pipe(include())
//       .on('error', console.log)
//     .pipe(gulp.dest(path.build_scripts));
// });
//
//
//
// // STYLES
// // --------------------------------------------------------------
// //
// gulp.task('styles', function() {
//   return sass(path.src_styles, {style: 'expanded'})
//     .on('error', sass.logError)
//     .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
//     .pipe(gulp.dest(path.build_styles));
// });
//
//
//
// // IMAGES
// // --------------------------------------------------------------
// //
// gulp.task('images', function() {
//   return gulp.src(path.src_images)
//     .pipe(imagemin({
//       progressive: true
//     }))
//     .pipe(gulp.dest(path.build_images));
// });
//
//
//
// // FONTS
// // --------------------------------------------------------------
// //
// gulp.task('fonts', function() {
//   return gulp.src(path.src_fonts)
//     .pipe(gulp.dest(path.build_fonts));
// });
//
//
//
// // WATCHING
// // --------------------------------------------------------------
// //
// gulp.task('watch', function() {
//   gulp.watch(path.watch_scripts, ['scripts']);
//   gulp.watch(path.watch_styles, ['styles']);
//   gulp.watch(path.src_images, ['images']);
//   gulp.watch(path.src_fonts, ['fonts']);
// });
//
//
//
// // UTILITIES
// // --------------------------------------------------------------
// //
// gulp.task('clean', function() {
//   del([
//     dir.build + folder.scripts,
//     dir.build + folder.styles,
//     dir.build + folder.images,
//     dir.build + folder.fonts
//   ]);
// });
//
// gulp.task('squish-styles', function() {
//   return gulp.src(path.build_styles + '*.css')
//     .pipe(minifyCss({}))
//     .pipe(out(path.build_styles + '{basename}.min{extension}'));
// });
//
// gulp.task('squish-scripts', function() {
//   return gulp.src(path.build_scripts + '*.js')
//     .pipe(uglify())
//     .pipe(out(path.build_scripts + '{basename}.min{extension}'));
// });
//
//
//
// // GULP CLI TASKS
// // --------------------------------------------------------------
// //
// gulp.task('build', function() {
//   gulp.start('scripts');
//   gulp.start('styles');
//   gulp.start('images');
//   gulp.start('fonts');
// });
//
// gulp.task('develop', function() {
//   gulp.start('watch');
// });
//
// gulp.task('livereload', ['connect'], function() {
//   gulp.start('watch');
// });
//
// gulp.task('deploy', ['clean'], function() {
//   gulp.start('build');
//
//   setTimeout(function() {
//     gulp.start('squish-styles');
//     gulp.start('squish-scripts');
//   }, 2000);
// });
//
//
//
// // NOTES:
// // Gulp tasks are run asynchronously so we'll use a setTimeout
// // function(s) to allow us to run tasks in a sequence.
