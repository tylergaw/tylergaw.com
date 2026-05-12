import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import pluginRSS from "@11ty/eleventy-plugin-rss";
import pluginWebc from "@11ty/eleventy-plugin-webc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("America/New_York");

export default function (conf) {
  conf.addPlugin(pluginRSS);
  conf.addPlugin(pluginWebc, {
    components: "src/_components/**/*.webc",
  });

  conf.addFilter("groupByYear", (posts) => {
    const grouped = new Map();
    for (const post of posts) {
      const year = dayjs(post.data.date).year();
      if (!grouped.has(year)) grouped.set(year, []);
      grouped.get(year).push(post);
    }
    return [...grouped].map(([year, posts]) => ({ year, posts }));
  });

  conf.addFilter("dateFormat", (dateStr, format) => {
    return dayjs(dateStr).format(format);
  });

  conf.addFilter("getRSSDate", (dateStr) => {
    // Parse the date string in UTC and set to noon
    // This prevents the date from shifting to the previous day in feed readers
    let date = dayjs.utc(dateStr).hour(12).toISOString().split(".");

    // Remove milliseconds (RFC 3339 requirement)
    date.pop();

    return date.join("") + "Z";
  });

  conf.addPassthroughCopy("src/manifest.webmanifest");
  conf.addPassthroughCopy("src/keybase.txt");
  conf.addPassthroughCopy("src/robots.txt");
  conf.addPassthroughCopy("src/humans.txt");
  conf.addPassthroughCopy("src/llms.txt");
  conf.addPassthroughCopy("src/rss.xml");
  conf.addPassthroughCopy("src/.well-known");
  conf.addPassthroughCopy("src/fonts");
  conf.addPassthroughCopy("src/images");
  conf.addPassthroughCopy("src/css");
  conf.addPassthroughCopy("src/js");

  conf.addCollection("posts", (collections) => {
    return collections
      .getFilteredByTag("post")
      .sort((a, b) => b.date - a.date)
      .map((post) => {
        const date = dayjs(post.data.date);
        post.data.date = date.format("YYYY-MM-DD");
        post.data.dateHuman = date.format("MMMM D, YYYY");
        return post;
      });
  });

  conf.setServerOptions({
    domDiff: false,
  });

  return {
    dir: {
      input: "src",
      output: "dist",
    },
    markdownTemplateEngine: false,
  };
}
