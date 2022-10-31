/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://dev-sr.vercel.app/',
  generateRobotsTxt: true, // (optional)
  // ...other options
}