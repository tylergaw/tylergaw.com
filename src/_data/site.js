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

export default function () {
  return {
    environment: process.env.ELEVENTY_ENV,
    year: new Date().getFullYear(),
    url: getSiteUrl(),
  };
}
