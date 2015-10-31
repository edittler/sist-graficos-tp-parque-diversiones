module.exports = function (grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			files: ['Gruntfile.js', 'js/**/*.js'],
			options: {
				jshintrc: true
			}
		},
		concat: {
			options: {},
			system: {
				// the files to concatenate
				src: [
					'js/system/controller/**/*.js',
					'js/system/core/**/*.js',
					'js/system/curve/**/*.js',
					'js/system/buffer/**/*.js',
					'js/system/shader/**/*.js',
					'js/system/geometry/**/*.js',
					'js/system/material/**/*.js',
					'js/system/model/Model.js',
					'js/system/model/PrimitiveModel.js',
					'js/system/model/ComplexModel.js',
					'js/system/camera/**/*.js',
					'js/system/goodies/**/*.js'
				],
				// the location of the resulting JS file
				dest: 'scripts/system.js'
			},
			tp: {
				// the files to concatenate
				src: ['js/tp/**/*.js', 'js/app.js'],
				// the location of the resulting JS file
				dest: 'scripts/tp.js'
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			system: {
				files: {
					'scripts/system.min.js': ['<%= concat.system.dest %>']
				}
			},
			tp: {
				files: {
					'scripts/tp.min.js': ['<%= concat.tp.dest %>']
				}
			}
		},
		clean: ['build'],
		copy: {
			main: {
				files: [
					{
						expand: true,
						src: [
							'css/**',
							'scripts/libs/**',
							'scripts/*.min.js',
							'index.html'
						],
						dest: 'build'
					}
				],
			}
		},
		replace: {
			index: {
				src: ['build/index.html'],
				overwrite: true,
				replacements: [
					{
						from: 'system.js',
						to: 'system.min.js'
					},
					{
						from: 'tp.js',
						to: 'tp.min.js'
					},
					{
						from: '<script src="//localhost:35729/livereload.js" defer></script>',
						to: ''
					}
				]
			}
		},
		connect: {
			server: {
				options: {
					port: 8000,
					base: './'
				}
			}
		},
		watch: {
			options: {
				livereload: true,
			},
			files: ['index.html', '<%= jshint.files %>'],
			tasks: ['jshint', 'concat']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-text-replace');

	grunt.registerTask('dev', ['jshint', 'concat', 'connect', 'watch']);
	grunt.registerTask('build', ['clean', 'jshint', 'concat', 'uglify', 'copy', 'replace']);
	grunt.registerTask('default', ['dev']);

};
