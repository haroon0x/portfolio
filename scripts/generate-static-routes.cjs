const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const distPath = path.join(__dirname, '../dist');
const sourcePath = path.join(distPath, 'index.html');
const serverEntryPath = path.join(__dirname, '../dist-ssr/entry-server.js');
const prDataPath = path.join(__dirname, '../public/pr-data.json');
const siteOrigin = 'https://haroon0x.dev';

const routes = [
  {
    path: '',
    pathname: '/',
    title: 'Muhammed Haroon | Independent Engineer & Builder',
    description: 'Muhammed Haroon is an independent engineer building reliable systems and ambitious products.',
    canonical: 'https://haroon0x.dev/',
    schemaType: 'ProfilePage',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  },
  {
    path: 'pull-requests',
    pathname: '/pull-requests',
    title: 'Open-Source Contributions | Muhammed Haroon',
    description: "Explore Muhammed Haroon's open-source contributions across infrastructure, developer tools, and AI systems.",
    canonical: 'https://haroon0x.dev/pull-requests',
    schemaType: 'CollectionPage',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  },
  {
    path: 'blog',
    pathname: '/blog',
    title: 'Writing | Muhammed Haroon',
    description: 'Technical essays and engineering notes from Muhammed Haroon on building reliable systems, open source, and AI products.',
    canonical: 'https://haroon0x.dev/blog',
    schemaType: 'Blog',
    robots: 'noindex, follow',
  },
];

const personSchema = {
  '@type': 'Person',
  '@id': `${siteOrigin}/#person`,
  name: 'Muhammed Haroon',
  alternateName: 'haroon0x',
  url: `${siteOrigin}/`,
  jobTitle: 'Independent Engineer & Builder',
  sameAs: [
    'https://github.com/haroon0x',
    'https://linkedin.com/in/muhammed-haroon-0399962b8',
    'https://x.com/skywalkerr0x',
  ],
  knowsAbout: [
    'Artificial intelligence',
    'Machine learning',
    'Developer tools',
    'Distributed systems',
    'Open-source software',
  ],
};

const websiteSchema = {
  '@type': 'WebSite',
  '@id': `${siteOrigin}/#website`,
  url: `${siteOrigin}/`,
  name: 'Muhammed Haroon',
  description: 'Muhammed Haroon is an independent engineer building reliable systems and ambitious products.',
  publisher: { '@id': `${siteOrigin}/#person` },
  inLanguage: 'en',
};

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function replaceRequired(html, pattern, replacement, label) {
  if (!pattern.test(html)) throw new Error(`Missing ${label} in built index.html`);
  return html.replace(pattern, replacement);
}

function buildStructuredData(route) {
  const page = {
    '@type': route.schemaType,
    '@id': `${route.canonical}#webpage`,
    url: route.canonical,
    name: route.title,
    description: route.description,
    isPartOf: { '@id': `${siteOrigin}/#website` },
    inLanguage: 'en',
  };

  if (route.schemaType === 'ProfilePage') {
    page.mainEntity = { '@id': `${siteOrigin}/#person` };
  } else {
    page.author = { '@id': `${siteOrigin}/#person` };
    page.about = { '@id': `${siteOrigin}/#person` };
  }

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [personSchema, websiteSchema, page],
  }).replaceAll('<', '\\u003c');
}

function buildRouteHtml(source, route, content, prData) {
  const title = escapeHtml(route.title);
  const description = escapeHtml(route.description);
  const canonical = escapeHtml(route.canonical);
  const robots = escapeHtml(route.robots);
  const serializedPRData = route.pathname === '/pull-requests'
    ? JSON.stringify(prData).replaceAll('<', '\\u003c')
    : '';
  let html = source;

  html = replaceRequired(html, /<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`, 'title');
  html = replaceRequired(html, /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta name="description" content="${description}" />`, 'description');
  html = replaceRequired(html, /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${canonical}" />`, 'canonical');
  html = replaceRequired(html, /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i, `<meta name="robots" content="${robots}" />`, 'robots');
  html = replaceRequired(html, /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${title}" />`, 'Open Graph title');
  html = replaceRequired(html, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${description}" />`, 'Open Graph description');
  html = replaceRequired(html, /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${canonical}" />`, 'Open Graph URL');
  html = replaceRequired(html, /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:title" content="${title}" />`, 'Twitter title');
  html = replaceRequired(html, /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:description" content="${description}" />`, 'Twitter description');
  html = replaceRequired(html, /<script\s+id="structured-data"\s+type="application\/ld\+json">[\s\S]*?<\/script>/i, `<script id="structured-data" type="application/ld+json">${buildStructuredData(route)}</script>`, 'structured data');
  html = replaceRequired(html, /<div\s+id="root"><\/div>/i, `<div id="root">${content}</div>`, 'root');
  html = replaceRequired(html, /<script\s+id="pr-data"\s+type="application\/json"><\/script>/i, `<script id="pr-data" type="application/json">${serializedPRData}</script>`, 'pull request data');

  return html;
}

async function main() {
  const { render } = await import(pathToFileURL(serverEntryPath).href);
  const source = fs.readFileSync(sourcePath, 'utf8');
  const prData = JSON.parse(fs.readFileSync(prDataPath, 'utf8'));

  for (const route of routes) {
    const content = render(route.pathname, prData);
    const routeDirectory = route.path ? path.join(distPath, route.path) : distPath;
    fs.mkdirSync(routeDirectory, { recursive: true });
    fs.writeFileSync(path.join(routeDirectory, 'index.html'), buildRouteHtml(source, route, content, prData));
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
