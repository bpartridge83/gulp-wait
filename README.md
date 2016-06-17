gulp-wait
=========

A gulp task that inserts a delay before calling the next function in a chain.

## Example

### Time based delay

Waits a specified number of milliseconds before executing the next item in the chain.

```javascript

  var wait = require('gulp-wait');

  gulp.task('wait', function() {
    gulp.src('yourfile.js')
        .pipe(wait(1500))
        .pipe(gulp.dest('destfile.js'));
  });

```

### Callback based delay

Waits for a callback to be truthy before executing the next item in the chain.

```javascript

  var wait = require('gulp-wait');
  var fs = require('fs');

  function doesFileExist(filePath) {
    try {
      fs.accessSync(filePath);
      return true;
    } catch () {
      return false;
    }
  }

  gulp.task('wait', function() {
    gulp.src('yourfile.js')
        .pipe(wait(doesFileExist('../path/to/some/file.js')))
        .pipe(gulp.dest('destfile.js'));
  });

```

### Using an options object

You can pass in an options object as well.

```javascript

const options = {
  time: 100, // same as wait(100)
  callback: () => true, // same as wait(() => true) - defaults to callback if both time and callback are passed
  before: () => {},
  after: () => {}
};

gulp.task('wait', function() {
  gulp.src('yourfile.js')
      .pipe(wait(options))
      .pipe(gulp.dest('destfile.js'));
});

```
