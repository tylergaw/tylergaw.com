const metalsmith = require("metalsmith");
const msIf = require("metalsmith-if");
const browserSync = require("metalsmith-browser-sync");
const inplace = require("metalsmith-in-place");
const layouts = require("metalsmith-layouts");
const postcss = require("metalsmith-postcss");

const handlebars = require("handlebars");
const helpers = require("./handlebars-helpers");

const shouldServe = process.env.SERVE === "true";
const watch = process.env.WATCH === "true";

let browserSyncOpts = {
  port: 8001,
  server: {
    baseDir: "build"
  }
};

if (watch) {
  browserSyncOpts.files = ["src/**/*", "layouts/**/*", "partials/**/*"];
}

// Register all our helpers at once.
// See ./handlebars-helpers.js for docs.
handlebars.registerHelper(helpers);

metalsmith(__dirname)
  .source("../src")
  .destination("../build")
  .metadata({
    site: {
      url: shouldServe ? "" : "https://tylergaw.com"
    },
    year: new Date().getFullYear()
  })
  .use(
    postcss({
      plugins: {
        "postcss-import": {},
        "postcss-nesting": {}
      }
    })
  )
  .ignore("**/modules/*.css")
  .use(
    inplace({
      engine: "handlebars",
      pattern: ["**/*.html"],
      partials: "../partials"
    })
  )
  .use(
    inplace({
      engine: "handlebars",
      pattern: ["**/*.css"],
      partials: "../src/css"
    })
  )
  .use(
    layouts({
      engine: "handlebars",
      default: "default.html",
      pattern: ["**/*.html"],
      directory: "../layouts",
      partials: "../partials"
    })
  )
  .ignore("**/tylergaw-critical.css")
  .use(msIf(shouldServe, browserSync(browserSyncOpts)))
  .build((err) => {
    if (err) {
      console.log(err);
    }
  });
