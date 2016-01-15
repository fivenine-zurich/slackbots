var gulp = require('gulp');
var ts = require('gulp-typescript');
var del = require('del');
var jasmine = require('gulp-jasmine');
var typescript = require('typescript');

var Reporter = require('jasmine-spec-reporter');

var tslint = require('gulp-tslint');
var stylish = require('tslint-stylish');

var serverOptions = {
	root: '',
	port: 8000,
	livereload: true,
};

var tasks = {
	defaultTask: 'default',
    lint: 'lint',
	build: 'build',
	clean: 'clean',
	watch: 'watch',
	watcher_rebuild: 'watcher-rebuild',
	test: 'test'
};

gulp.task(tasks.defaultTask, [tasks.build] );

gulp.task(tasks.lint, function() {
    
    gulp.src('src/**.ts')
        .pipe(tslint())
        .pipe(tslint())
        .pipe(tslint.report(stylish, {
            emitError: false,
            sort: true,
            bell: true
        }));
});

gulp.task(tasks.build, [tasks.lint], function() {
    
    var tsProject = ts.createProject('tsconfig.json', {
        typescript: require('typescript')
    }); 
    
	var tsResult = tsProject.src() 
		.pipe(ts(tsProject));
	
	return tsResult.js.pipe(gulp.dest('bin'));
});

gulp.task(tasks.clean, function () {
	return del(['bin/']);
});

gulp.task(tasks.test, [tasks.build], function (done) {
    
    var reporter = new Reporter({
        showColors: true,
        isVerbose: true
    });
    
    return gulp.src('bin/tests/**.spec.js')
        .pipe(jasmine({
			reporter: reporter
		}));
});