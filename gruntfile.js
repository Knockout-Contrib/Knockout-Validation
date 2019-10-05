/*global module:false*/
/*jshint node:true*/
module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		meta: {
			banner: "/*=============================================================================\n" +
					"	Author:			Eric M. Barnard - @ericmbarnard								\n" +
					"	License:		MIT (http://opensource.org/licenses/mit-license.php)		\n" +
					"																				\n" +
					"	Description:	Validation Library for KnockoutJS							\n" +
					"	Version:		<%= pkg.version %>											\n" +
					"===============================================================================\n*/\n"
		},
		concat: {
			options: {
				separator: ";",
				banner: "<%= meta.banner %>",
				process: function (src) {
					return src
						.replace(/ko\.validation\./g, 'kv.')
						.replace(/ko\.utils\.arrayForEach/g, 'forEach')
						.replace(/ko\.utils\.extend/g, 'extend')
						.replace(/ko\.utils\.unwrapObservable/g, 'unwrap')
						.replace(/ko\.utils\./g, 'koUtils.');
				}
			},
			dist: {
				src: [
					"<%= meta.banner %>",
					"src/ko.validation.start.frag",
					"src/configuration.js",
					"src/utils.js",
					"src/api.js",
					"src/rules.js",
					"src/bindingHandlers.js",
					"src/extenders.js",
					"src/localization.js",
					"src/ko.extensions.js",
					"src/ko.validation.end.frag"
				],
				dest: "dist/<%= pkg.name %>.js"
			}
		},
		uglify: {
			options: {
				banner: "<%= meta.banner %>",
				report: "min",
				sourceMap: true
			},
			dist: {
				files: {
					"dist/<%= pkg.name %>.min.js": ["<%= concat.dist.dest %>"]
				}
			}
		},
		qunit: {
			files: ["test/test-runner-2.3.0.html", "test/test-runner-3.4.2.html", "test/test-runner-3.5.0.html"]
		},
		jshint: {
			files: ["gruntfile.js", "src/**/*.js", "test/*.js", "localization/*.js"],
			options: {
				jshintrc: ".jshintrc",
				reporter: require('jshint-stylish')
			}
		},
		watch: {
			clear: {
				files: ["src/**/*.js", "test/*.js"],
				tasks: ["clear", "test"]
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-qunit");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-clear");

	// Default task.
	grunt.registerTask("default", ["test", "uglify"]);
	grunt.registerTask("test", ["concat", "qunit", "jshint"]);

	grunt.registerTask("compile", ["concat", "qunit", "uglify"]);
};
