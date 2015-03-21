'use strict';

var path = require('path');


module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // configurable paths
  var config = {
    app: '.',
    dist: 'dist'
  };

  grunt.initConfig({
    config: config,
    express: {
      options: {
        port: 9000,
        hostname: '*'
      },
      livereload: {
        options: {
          server: path.resolve('./server/index'),
          livereload: true,
          serverreload: true,
          bases: [path.resolve('./public'), path.resolve('./bower_components')]
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= express.options.port %>'
      }
    }
  });

  grunt.registerTask('serve', [
      'express:livereload',
      'open',
      'watch'
  ]);
};