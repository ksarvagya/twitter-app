
module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-jasmine');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jasmine: {
            coverage: {
                src: ['resources/js/*.js'],
                options: {
                    specs: [
                        'src/test/test*.js'
                    ],
                    vendor: [
                        'resources/js/lib/angular.min.js',
                        'resources/js/lib/*.js'
                    ],
                    helpers: [
                        'src/test/helper*.js'
                    ],
                    styles: [
                        'resources/css/*.css'
                    ],
                    outfile: '_SpecRunner.html',
                    keepRunner: true,


                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        coverage: 'build/coverage/coverage.json',
                        report: [
                            {
                                type: 'html',
                                options: {
                                    dir: 'build/coverage/html'
                                }
                            },
                            {
                                type: 'text-summary'
                            }
                        ]
                    }
                }

            }
        }
    });
};
