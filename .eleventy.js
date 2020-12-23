const CleanCSS = require("clean-css");
const dayjs = require("dayjs");

module.exports = function (conf) {
  conf.addFilter("cssmin", (code) => new CleanCSS({}).minify(code).styles);

  conf.setTemplateFormats([
    "njk",
    "md",
    "gif",
    "jpg",
    "png",
    "avif",
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

  conf.addCollection("posts", (collections) => {
    const posts = collections
      .getFilteredByTag("post")
      .sort((a, b) => b.date - a.date)
      .reduce((accum, post, i) => {
        const year = dayjs(post.data.date).year();
        const prevPost = accum[i - 1];
        let addYearData = !prevPost ? true : false;

        if (prevPost) {
          const prevPostYear = dayjs(prevPost.data.date).year();

          if (year !== prevPostYear) {
            addYearData = true;
          }
        }

        if (addYearData) {
          post.data.year = year;
        }

        return accum.concat(post);
      }, []);

    return posts;
  });

  return {
    dir: {
      input: "src",
      output: "dist",
    },
    markdownTemplateEngine: false,
  };
};
