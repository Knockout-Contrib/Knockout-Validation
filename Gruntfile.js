/*global module:false*/
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
					"===============================================================================\n*/\n"
		},
		concat: {
			options: {
				separator: ";",
				banner: "<%= meta.banner %>",
				process: function (src, filepath) {
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
					"Src/ko.validation.start.frag",
					"Src/configuration.js",
					"Src/utils.js",
					"Src/api.js",
					"Src/rules.js",
					"Src/bindingHandlers.js",
					"Src/extenders.js",
					"Src/localization.js",
					"Src/ko.extensions.js",
					"Src/ko.validation.end.frag",
				],
				dest: "Dist/<%= pkg.name %>.js"
			}
		},
		uglify: {
			options: {
				banner: "<%= meta.banner %>",
				report: "min"
			},
			dist: {
				files: {
					"Dist/<%= pkg.name %>.min.js": ["<%= concat.dist.dest %>"]
				}
			}
		},
		qunit: {
			files: ["Tests/test-runner.htm"]
		},
		jshint: {
			files: ["Src/**/*.js", "Tests/*.js"],
			options: grunt.file.readJSON(".jshintrc"),
		},
		watch: {
			clear: {
				files: ["Src/**/*.js", "Tests/*.js"],
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
