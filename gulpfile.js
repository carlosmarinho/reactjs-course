"use strict"

var gulp 	= require("gulp");
var connect = require("gulp-connect"); //Runs a local dev server
var open 	= require("gulp-open"); // Open a Url in a web browser
var browserify 	= require('browserify'); //Bundles JS
var reactify	= require('reactify'); // Transforms react jsx to js
var source		= require('vinyl-source-stream'); // use conventional text streams with gulp

var config = {
	port: 9005,
	devBaseUrl: 'http://localhost',
	paths: {
		html: './src/*.html',
		js: './src/**/.js',
		dist: './dist',
		mainJs: './src/main.js'
	}
}

//Start a local develoopment server
gulp.task('connect', function(){
	connect.server({
		root:['dist'],
		port:config.port,
		base:config.devBaseUrl,
		livereload:true
	});
});

gulp.task('open',['connect'], function(){
	var url = config.devBaseUrl + ':' + config.port + '/';
	gulp.src('dist/index.html')
		.pipe(open({ uri: url }))
});

gulp.task('html', function(){
	gulp.src(config.paths.html)
		.pipe(gulp.dest(config.paths.dist))
		.pipe(connect.reload());
});

gulp.task('js', function(){
	browserify(config.paths.mainJs)
		.transform(reactify)
		.bundle()
		.on('error', console.error.bind(console))
		.pipe(source('bundle.js'))
		.pipe(gulp.dest(config.paths.dist + '/scripts'))
		.pipe(connect.reload())
})

gulp.task('watch', function(){
	gulp.watch(config.paths.html,['html']);
	gulp.watch(config.paths.js,['js']);
})

gulp.task('default', ['html', 'js', 'open','watch']);
