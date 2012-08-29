/*global module:false*/
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        meta: {
            version: '1.0.2',
            banner: '/*\n' + 
                    '===============================================================================\n' +
                    '    Author:     Eric M. Barnard - @ericmbarnard                                \n' +
                    '    License:    MIT (http://opensource.org/licenses/mit-license.php)           \n' +
                    '                                                                               \n' +
                    '    Description: Validation Library for KnockoutJS                             \n' +
                    '===============================================================================\n' +
                    '*/'
        },
        lint: {
            files: ['grunt.js']
        },
        qunit: {
            files: ['Tests/test-runner.htm']
        },
        concat: {
            dist: {
                src: ['<banner:meta.banner>', '<file_strip_banner:Src/knockout.validation.js>'],
                dest: 'Dist/knockout.validation.js'
            }
        },
        min: {
            dist: {
                src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
                dest: 'dist/knockout.validation.min.js'
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                browser: true
            },
            globals: {
                jQuery: false
            }
        },
        uglify: {}
    });

    // Default task.
    grunt.registerTask('default', 'lint qunit concat min');

};
