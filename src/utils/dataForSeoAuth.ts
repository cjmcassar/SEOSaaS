export function getAuthHeader() {
  const auth = `${process.env.DATA_FOR_SEO_LOGIN}:${process.env.DATA_FOR_SEO_PASS}`;
  return "Basic " + Buffer.from(auth).toString("base64");
}
