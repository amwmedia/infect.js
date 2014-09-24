module.exports = function(grunt) {
	'use strict';

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '// <%= pkg.name %>.js v<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>) //\n'
			},
			build: {
				src: '<%= pkg.name %>.js',
				dest: '<%= pkg.name %>.min.js'
			}
		},
		watch: {
			scripts: {
				files: ['infect.js', 'test/*.js'],
				tasks: ['uglify', 'qunit']
			}
		},
		qunit: {
			all: ['test/**/*.html']
		}
	});

	// Load the plugin that provides tasks.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Default task(s).
	grunt.registerTask('default', ['uglify', 'qunit', 'watch']);

};