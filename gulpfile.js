var gulp = require('gulp');
var del = require('del');

var plumber = require('gulp-plumber');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');

var jasmine = require('gulp-jasmine');
var Reporter = require('jasmine-spec-reporter');

var typescript = require('typescript');
var ts = require('gulp-typescript');

var tslint = require('gulp-tslint');
var stylish = require('tslint-stylish');
var tsd = require('gulp-tsd');

var tasks = {
    defaultTask: 'default',
    build: 'build',
    lint: 'ts:lint',
    tsd: 'ts:tsd',
    buildts: 'ts:build',
    clean: 'clean',
    test: 'test',
    dev: 'dev',
    dist: 'dist'
};

gulp.task(tasks.defaultTask, [tasks.dev]);

gulp.task(tasks.dev, function (callback) {
    runSequence(tasks.build,
        tasks.test,
        callback);
});

gulp.task(tasks.build, function (callback) {
    runSequence(tasks.clean,
        tasks.tsd,
        [tasks.buildts, tasks.lint],
        callback);
});

gulp.task(tasks.dist, [tasks.build]);

gulp.task(tasks.tsd, function (callback) {
    return tsd({
        command: 'reinstall',
        config: './tsd.json'
    }, callback);
});

gulp.task(tasks.lint, function () {

    return gulp.src('src/**.ts')
        .pipe(tslint())
        .pipe(tslint.report(stylish, {
            emitError: false,
            sort: true,
            bell: true
        }));
});

gulp.task(tasks.buildts, function () {

    var tsProject = ts.createProject('tsconfig.json', {
        typescript: require('typescript')
    });

    var tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(ts(tsProject));

    return tsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('bin'));
});

gulp.task(tasks.clean, function () {
    return del(['bin/']);
});

gulp.task(tasks.test, function (done) {

    var reporter = new Reporter({
        showColors: true,
        isVerbose: true
    });

    return gulp.src('bin/**/*[sS]pec.js')
        .pipe(plumber())
        .pipe(jasmine({
            reporter: reporter
        }));
});