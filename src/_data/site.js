const getSiteUrl = () => {
  if (process.env.ELEVENTY_ENV === "local") {
    return "http://localhost:8080";
  }

  if (process.env.ELEVENTY_ENV === "production") {
    return process.env.CONTEXT === "production"
      ? process.env.URL
      : process.env.DEPLOY_PRIME_URL;
  }
};

module.exports = {
  environment: process.env.ELEVENTY_ENV,
  year: new Date().getFullYear(),
  url: getSiteUrl(),
  versions: [
    "2018–2020",
    "2014–2018",
    "2011–2014",
    "2009–2011",
    "2007–2009",
    "2006–2007",
  ],
};
