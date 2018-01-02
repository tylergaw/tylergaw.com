const metalsmith = require('metalsmith');
const msIf = require('metalsmith-if');
const browserSync = require('metalsmith-browser-sync');
const inplace = require('metalsmith-in-place');
const layouts = require('metalsmith-layouts');
const handlebars = require('handlebars');
const helpers = require('./handlebars-helpers');

const shouldServe = process.env.SERVE === 'true';

// Register all our helpers at once.
// See ./handlebars-helpers.js for docs.
handlebars.registerHelper(helpers);

metalsmith(__dirname)
  .source('../src')
  .destination('../build')
  .metadata({
    site: {
      url: shouldServe ? '' : 'https://tylergaw.com'
    }
  })
  .use(
    inplace({
      engine: 'handlebars',
      pattern: ['**/*.html'],
      partials: '../partials'
    })
  )
  .use(
    layouts({
      engine: 'handlebars',
      default: 'default.html',
      pattern: ['**/*.html'],
      directory: '../layouts',
      partials: '../partials'
    })
  )
  .use(
    msIf(
      shouldServe,
      browserSync({
        port: 8001,
        server: {
          baseDir: 'build'
        },
        files: ['src/**/*', 'layouts/**/*', 'partials/**/*']
      })
    )
  )
  .build(err => {
    if (err) {
      console.log(err);
    }
  })
