/*global module:false*/
/*jshint node:true*/
module.exports = function (grunt) {

function expandFiles( files ) {
	return grunt.util._.pluck( grunt.file.expandMapping( files ), "" ).map(function( values ) {
		return values[ 0 ];
	});
}

    //var allI18nFiles = expandFiles( "Localization/*.js" );

	//console.log(allI18nFiles);
	
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
					"Src/ko.validation.end.frag"
				],
				dest: "Dist/<%= pkg.name %>-<%= pkg.version %>.js"
			},
			i18n: {
				options: {
    				banner: "<%= meta.banner %>" + grunt.file.read('Localization/i18n.start.frag'),
					footer: grunt.file.read('Localization/i18n.end.frag'),
					process: function(src, filepath) {
						return 'kvl["' + filepath.replace(/^(?:.*[/\\])?([^/\\]+?).js$/, '$1') + '"] =\n' + src;
					},
				},
			    src: [
				    "Localization/*.js",
				],
				dest: "Dist/<%= pkg.name %>.i18n-<%= pkg.version %>.js"
			},
		},
		uglify: {
			options: {
				banner: "<%= meta.banner %>",
				report: "min",
				sourceMap: true
			},
			dist: {
				files: {
					"Dist/<%= pkg.name %>-<%= pkg.version %>.min.js": ["<%= concat.dist.dest %>"]
				}
			},
			i18n: {
				files: {
					"Dist/<%= pkg.name %>.i18n-<%= pkg.version %>.min.js": ["<%= concat.i18n.dest %>"]
				}
			},
		},
		qunit: {
			files: ["Tests/test-runner.htm"]
		},
		jshint: {
			files: ["gruntfile.js", "Src/**/*.js", "Tests/*.js"],
			options: {
				jshintrc: ".jshintrc",
				reporter: require('jshint-stylish')
			}
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
