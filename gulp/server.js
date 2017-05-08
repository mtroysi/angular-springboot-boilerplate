'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');

var util = require('util');
var proxyMiddleware = require('http-proxy-middleware');


function browserSyncInit(baseDir, browser, proxyServer) {
  browser = browser === undefined ? 'default' : browser;

  var routes = null;
  if(baseDir === conf.paths.src || (util.isArray(baseDir) && baseDir.indexOf(conf.paths.src) !== -1)) {
    routes = {
      '/bower_components': 'bower_components',
      '/': conf.paths.src
    };
  }

  var server = {
    baseDir: baseDir,
    routes: routes
  };

  /*
   * You can add a proxy to your backend by uncommenting the line below.
   * You just have to configure a context which will we redirected and the target url.
   * Example: $http.get('/users') requests will be automatically proxified.
   *
   * For more details and option, https://github.com/chimurai/http-proxy-middleware/blob/v0.9.0/README.md
   */
   server.middleware = [];
   server.middleware.push(proxyMiddleware('/api', {target: proxyServer ? proxyServer : 'http://localhost:8080', changeOrigin: true}));


  browserSync.instance = browserSync.init({
    startPath: '/',
    server: server,
    browser: browser,
    open: 'external',
    host: 'localhost',
    port: 3000
  });
}

browserSync.use(browserSyncSpa({
  selector: '[ng-app]'// Only needed for angular apps
}));

gulp.task('serve', ['watch'], function () {
  browserSyncInit([path.join(conf.paths.tmp, '/serve'), conf.paths.src], undefined, conf.proxyServer.local);
});

