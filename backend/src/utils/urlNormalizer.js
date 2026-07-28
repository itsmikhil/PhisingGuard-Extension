const normalizeUrl = (url) => {
  if (!url) {
    return "";
  }

  try {
    const parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol.toLowerCase();
    const hostname = parsedUrl.hostname.toLowerCase();
    const port = parsedUrl.port ? `:${parsedUrl.port}` : "";
    const pathname = parsedUrl.pathname === "/" ? "" : parsedUrl.pathname;
    const search = parsedUrl.search || "";

    return `${protocol}//${hostname}${port}${pathname}${search}`;
  } catch (error) {
    return url.trim().toLowerCase();
  }
};

module.exports = {
  normalizeUrl,
};
