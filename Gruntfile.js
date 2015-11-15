/*global module:false*/
module.exports = function(grunt) {


	var lrPort = 35729;
	// 使用connect-livereload模块，生成一个与LiveReload脚本
	// <script src="http://127.0.0.1:35729/livereload.js?snipver=1" type="text/javascript"></script>
	var lrSnippet = require('connect-livereload')({
		port: lrPort
	});

	var serveStatic = require('serve-static');
	var serveIndex = require('serve-index');
	var lrMiddleware = function(connect, options, middlwares) {
		return [
			lrSnippet,
			// 静态文件服务器的路径 原先写法：connect.static(options.base[0])
			serveStatic(options.base[0]),
			// 启用目录浏览(相当于IIS中的目录浏览) 原先写法：connect.directory(options.base[0])
			serveIndex(options.base[0])
		];
	};

	// 项目配置.
	grunt.initConfig({
		// 任务配置.
		pkg: grunt.file.readJSON('package.json'),

		less: {
			development: {
				expand: true,
				cwd: './src/less',
				src: ['*.less'],
				dest: 'src/css/',
				ext: '.css'
			}
		},
		cssmin: {
			proc: {
				expand: true,
				cwd: 'src/',
				src: ['css/*.css'],
				dest: 'dist/',
				ext: '.min.css'
			}
		},
		includes: {
			files: {
				src: ['src/*.html'], // Source files 
				dest: 'dist/html', // Destination directory 
				flatten: true,
				cwd: '.',
				options: {
					silent: true,
					banner: '<!-- I am a banner <% includes.files.dest %> -->'
				}
			}
		},
		uglify: {
			build: { //任务一：压缩a.js，不混淆变量名，保留注释，添加banner和footer
				options: {
					footer: '\n/*! <%= pkg.name %> 最后修改于： <%= grunt.template.today("yyyy-mm-dd") %> */' //添加footer
				},
				files: [{
					expand: true,
					ext: '.min.js',
					cwd: 'src/js', //js目录下
					src: '*.js', //所有js文件
					dest: 'dist/js' //输出到此目录下
				}]
			}
		},
		connect: {
			options: {
				// 服务器端口号
				port: 8000,
				// 服务器地址(可以使用主机名localhost，也能使用IP)
				hostname: 'localhost',
				base: 'dist'
			},
			livereload: {
				options: {
					open: true, //自动打开网页 http://
					middleware: lrMiddleware,
				}

			}
		},
		watch: {
			connect: {
				options:{
					livereload:lrPort
				},
				// '**' 表示包含所有的子目录
				// '*' 表示包含所有的文件
				files: ['src/*','src/**/*']
			},
			uglify: {
				files: 'src/js/*',
				tasks: ['uglify']
			},
			less: {
				files: 'src/less/*',
				tasks: ['less', 'cssmin']
			},
			html: {
				files: ['src/*.html', 'src/parts/*.html'],
				tasks: ['less', 'includes']
			},
		}
	});
	require('load-grunt-tasks')(grunt);
	// 加载任务.
	// grunt.loadNpmTasks('grunt-includes');
	// grunt.loadNpmTasks('grunt-csscomb');
	// grunt.loadNpmTasks('grunt-contrib-less');
	// grunt.loadNpmTasks('grunt-contrib-watch');
	// grunt.loadNpmTasks('grunt-contrib-cssmin');
	// grunt.loadNpmTasks('grunt-contrib-uglify');
	// grunt.loadNpmTasks('grunt-contrib-connect');
	// grunt.loadNpmTasks('grunt-contrib-watch');



	// 默认执行的任务.
	grunt.registerTask('default', ['connect', 'watch', 'less', 'cssmin', 'includes']);
	grunt.registerTask('dev', ['watch', 'less', 'cssmin', 'includes']);

}