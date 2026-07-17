const fs = require('fs');
const path = require('path');

const GITHUB_AUTHOR = process.env.GITHUB_AUTHOR || 'haroon0x';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const outputPath = path.join(__dirname, '../public/pr-data.json');
const excludedRepositoryOwners = new Set([
  GITHUB_AUTHOR.toLowerCase(),
  'isap31',
  'tempest2023',
  'ivanrj7j',
]);

const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
};

if (GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
}

function isExcludedRepository(repo) {
  return excludedRepositoryOwners.has(repo.split('/')[0]?.toLowerCase());
}

function withAllowedRepositoriesOnly(data) {
  const prs = (data.prs ?? []).filter((pr) => !isExcludedRepository(pr.repo));

  return {
    ...data,
    prs,
    total: prs.length,
    open: prs.filter((pr) => pr.status === 'Open').length,
    merged: prs.filter((pr) => pr.status === 'Merged').length,
  };
}

function isAllowedSearchResult(item) {
  const segments = new URL(item.repository_url).pathname.split('/').filter(Boolean);
  return segments[0] === 'repos' && !excludedRepositoryOwners.has(segments[1]?.toLowerCase());
}

function readExistingData() {
  try {
    if (fs.existsSync(outputPath)) {
      return JSON.parse(fs.readFileSync(outputPath, 'utf8'));
    }
  } catch (error) {
    console.error('Failed to read existing pr-data.json:', error.message);
  }

  return null;
}

function retainExistingData(data, message) {
  console.error(message);
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
}

async function githubRequest(url) {
  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`GitHub request failed with ${response.status}: ${url}`);
  }

  return response.json();
}

async function discoverPullRequests() {
  const items = [];

  for (let page = 1; page <= 10; page += 1) {
    const query = encodeURIComponent(`type:pr author:${GITHUB_AUTHOR}`);
    const url = `https://api.github.com/search/issues?q=${query}&sort=created&order=desc&per_page=100&page=${page}`;
    const data = await githubRequest(url);
    items.push(...data.items.filter((item) => item.pull_request?.url && isAllowedSearchResult(item)));

    if (data.items.length < 100 || page * 100 >= Math.min(data.total_count, 1000)) {
      break;
    }
  }

  return items;
}

function summarizeDescription(body) {
  const fallback = 'No description provided.';
  if (!body) return fallback;

  const normalized = body.replace(/\s+/g, ' ').trim();
  if (!normalized) return fallback;
  return normalized.length > 180 ? `${normalized.slice(0, 177)}...` : normalized;
}

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

async function runInBatches(items, size, worker) {
  const results = [];

  for (let index = 0; index < items.length; index += size) {
    const batch = items.slice(index, index + size);
    results.push(...await Promise.all(batch.map(worker)));
  }

  return results;
}

async function fetchPRs() {
  console.log(`Discovering public pull requests authored by ${GITHUB_AUTHOR}...`);
  if (GITHUB_TOKEN) console.log('Using GitHub token for authenticated requests.');

  const storedData = readExistingData();
  const existingData = storedData ? withAllowedRepositoriesOnly(storedData) : null;
  const cachedByUrl = new Map((existingData?.prs ?? []).map((pr) => [pr.url, pr]));
  let discovered;

  try {
    discovered = await discoverPullRequests();
  } catch (error) {
    if (existingData) {
      retainExistingData(existingData, `${error.message}. Retaining cached PR data.`);
      return;
    }
    throw error;
  }

  if (discovered.length === 0) {
    if (existingData) {
      retainExistingData(existingData, 'GitHub returned no pull requests. Retaining cached PR data.');
      return;
    }
    throw new Error(`No public pull requests found for ${GITHUB_AUTHOR}.`);
  }

  const languageRequests = new Map();
  const getLanguages = (url) => {
    if (!url) return Promise.resolve([]);
    if (!languageRequests.has(url)) {
      languageRequests.set(
        url,
        githubRequest(url)
          .then((languages) => Object.keys(languages).slice(0, 3))
          .catch(() => []),
      );
    }
    return languageRequests.get(url);
  };

  const prs = await runInBatches(discovered, 8, async (item) => {
    try {
      const data = await githubRequest(item.pull_request.url);
      const languages = await getLanguages(data.base?.repo?.languages_url);
      const pr = {
        title: data.title,
        repo: data.base.repo.full_name,
        url: data.html_url,
        description: summarizeDescription(data.body),
        status: data.merged_at ? 'Merged' : data.state === 'open' ? 'Open' : 'Closed',
        date: formatDate(data.created_at),
        additions: data.additions ?? 0,
        deletions: data.deletions ?? 0,
        languages,
      };

      console.log(`Fetched ${pr.repo} #${data.number} (${pr.status})`);
      return pr;
    } catch (error) {
      const cached = cachedByUrl.get(item.html_url);
      if (cached) {
        console.error(`${error.message}. Using cached entry for ${item.html_url}.`);
        return cached;
      }
      console.error(`${error.message}. Skipping ${item.html_url}.`);
      return null;
    }
  });

  const fetchedPRs = prs.filter(Boolean);

  if (fetchedPRs.length !== discovered.length) {
    if (existingData) {
      retainExistingData(existingData, `Fetched ${fetchedPRs.length} of ${discovered.length} pull requests. Retaining cached PR data.`);
      return;
    }
    throw new Error(`Fetched ${fetchedPRs.length} of ${discovered.length} pull requests.`);
  }

  const validPRs = fetchedPRs.filter((pr) => !isExcludedRepository(pr.repo));

  const output = {
    prs: validPRs,
    lastUpdated: new Date().toISOString(),
    total: validPRs.length,
    open: validPRs.filter((pr) => pr.status === 'Open').length,
    merged: validPRs.filter((pr) => pr.status === 'Merged').length,
  };

  if (storedData) {
    const previous = { ...storedData, lastUpdated: '' };
    const current = { ...output, lastUpdated: '' };
    if (JSON.stringify(previous) === JSON.stringify(current)) {
      console.log('No changes detected.');
      return;
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`Saved ${output.total} pull requests to ${outputPath}.`);
  console.log(`Open: ${output.open}, merged: ${output.merged}.`);
}

fetchPRs().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
