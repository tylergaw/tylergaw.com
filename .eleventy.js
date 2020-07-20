const CleanCSS = require("clean-css");

module.exports = function (conf) {
  conf.addFilter("cssmin", (code) => new CleanCSS({}).minify(code).styles);

  conf.setTemplateFormats([
    "njk",
    "gif",
    "jpg",
    "png",
    "webp",
    "svg",
    "woff2",
    "ico",
    "js",
  ]);
  conf.addPassthroughCopy("./src/manifest.webmanifest");
  conf.addPassthroughCopy("./src/keybase.txt");
  conf.addPassthroughCopy("./src/rss.xml");

  conf.addWatchTarget("./src/**/*.css");

  return {
    dir: {
      input: "src",
      output: "dist",
    },
  };
};
