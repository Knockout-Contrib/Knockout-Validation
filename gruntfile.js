/*global module:false*/
/*jshint node:true*/
module.exports = function (grunt) {


	function processFileSource(contents, filePath, embedLocales) {
		if (embedLocales && filePath.indexOf('localization/') === 0) {
			var re = /function\(factory\) \{[^]*}(?=\(function\(kv\) \{)/gm;
			var replacement = 'function(factory) {\n    factory(ko.validation);\n}';

			if (!re.test(contents)) {
				grunt.log.warn('Localization file cannot be embedded: ', filePath);
				return '/*Failed to embed localization file: ' + filePath + '*/\n';
			}
			else {
				contents = contents.replace(re, replacement);
			}
		}
		return contents
			.replace(/ko\.validation\./g, 'kv.')
			.replace(/ko\.utils\.arrayForEach/g, 'forEach')
			.replace(/ko\.utils\.extend/g, 'extend')
			.replace(/ko\.utils\.unwrapObservable/g, 'unwrap')
			.replace(/ko\.utils\./g, 'koUtils.');
	}

	function getSourceFiles(includeLocales) {
		var items = [
			"<%= meta.banner %>",
			"src/ko.validation.start.frag",
			"src/configuration.js",
			"src/utils.js",
			"src/api.js",
			"src/rules.js",
			"src/bindingHandlers.js",
			"src/extenders.js",
			"src/localization.js",
			"src/ko.extensions.js"
		];
		if (includeLocales) {
			items.push(["localization/*.js", "!localization/en-US.js"]);
		}
		items.push("src/ko.validation.end.frag");
		return items;
	}


	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		meta: {
			banner_l10n: "/* Localization for Knockout Validation <%= pkg.version %> */",
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
				process: function(contents, filePath) {
					return processFileSource(contents, filePath, false);
				}
			},
			dist: {
				src: getSourceFiles(false),
				dest: "dist/<%= pkg.name %>.js"
			},
			dist_locales: {
				options: {
					process: function(contents, filePath) {
						return processFileSource(contents, filePath, true);
					}
				},
				src: getSourceFiles(true),
				dest: "dist/<%= pkg.name %>-with-locales.js"
			},
			locales: {
				options: {
					process: null,
					banner: "<%= meta.banner_l10n %>\n\n"
				},
				src: ['localization/*.js', '!localization/en-US.js'],
				dest: "dist/locales.js"
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
			},
			dist_locales: {
				files: {
					"dist/<%= pkg.name %>-with-locales.min.js": ["<%= concat.dist_locales.dest %>"]
				}
			},
			locales: {
				options: {
					banner: "<%= meta.banner_l10n %>"
				},
				files: {
					"dist/locales.min.js": ["<%= concat.locales.dest %>"]
				}
			}
		},
		qunit: {
			files: ["test/test-runner.htm"]
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
