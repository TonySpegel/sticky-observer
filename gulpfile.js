// Plugins
var gulp        = require('gulp');
var browserSync = require('./node_modules/browser-sync').create();
var sass        = require('./node_modules/gulp-sass');
var reload      = browserSync.reload;

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {
    browserSync.init({
        server: "./app"
    });

    gulp.watch('app/scss/**/*.scss', ['sass']);
    gulp.watch('app/*.html').on('change', reload);
    gulp.watch('app/js/*.js').on('change', reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src('app/scss/main.scss')
        .pipe(sass())
        .pipe(gulp.dest('app/css/'))
        .pipe(reload({stream: true}));
});

gulp.task('default', ['serve', 'sass']);
