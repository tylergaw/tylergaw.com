const CleanCSS = require("clean-css");
const dayjs = require("dayjs");
const timezone = require("dayjs/plugin/timezone");
const pluginRSS = require("@11ty/eleventy-plugin-rss");

dayjs.extend(timezone);
dayjs.tz.setDefault("America/New_York");

module.exports = function (conf) {
  conf.addPlugin(pluginRSS);

  conf.addFilter("cssmin", (code) => new CleanCSS({}).minify(code).styles);

  conf.addFilter("dateFormat", (dateStr, format) => {
    return dayjs(dateStr).format(format);
  });

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
        const date = dayjs(post.data.date);
        const year = date.year();
        const prevPost = accum[i - 1];
        let addYearData = !prevPost ? true : false;

        if (prevPost) {
          const prevPostYear = dayjs(prevPost.data.date).year();

          if (year !== prevPostYear) {
            addYearData = true;
          }
        }

        // Override/add data to post object
        post.data.year = addYearData ? year : null;
        post.data.date = date.format("YYYY-MM-DD");
        post.data.dateHuman = date.format("MMMM D, YYYY");

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
