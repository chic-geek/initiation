# Project pipeline

This repository has been put together to enable projects **NOT** running Middleman or Rails frameworks to have a pre-determined asset-pipeline that is similar to the way in which those frameworks are put together only this uses Gulp.

The purpose of this project was for use with .Net projects or anything that doesn't run on the above frameworks with it's own asset-pipeline.

### Gulp CLI commands

There are 3 main Gulp commands you'll need to use:

* `$ gulp build` - This will create the `build` directory if it doesn't already exist and output all the assets added.

* `$ gulp develop` - Used when developing your application, this task runs the `watch` task to keep track of your changing assets.

* `$ gulp deploy` - For use when you're ready to deploy. This will clean out the `build directory`, apply the `build` task followed by minifying and uglifying the css and js respectively.

#### ToDo

* Finish up writing `README.md`.
* Find a more robust work-around for the setTimeout function in `$ gulp deploy` task.
* Add ability to to compile coffeeScript files too.
* Make sourcemaps available.
