module.exports = function () {
  const permalink =
    process.env.ELEVENTY_ENV !== "production" ? "css/tylergaw.css" : false;

  return {
    permalink,
  };
};
