const fs = require('fs');
const path = require('path');

const prUrls = [
  "https://github.com/openclaw/openclaw/pull/36310",
  "https://github.com/kubeflow/docs-agent/pull/101",
  "https://github.com/kubeflow/docs-agent/pull/50",
  "https://github.com/kubeflow/docs-agent/pull/35",
  "https://github.com/kubeflow/docs-agent/pull/33",
  "https://github.com/kubeflow/docs-agent/pull/30",
  "https://github.com/kubeflow/pipelines/pull/12746",
  "https://github.com/mem0ai/mem0/pull/3471",
  "https://github.com/mem0ai/mem0/pull/3487",
  "https://github.com/meta-llama/synthetic-data-kit/pull/78",
  "https://github.com/OWASP-BLT/BLT/pull/4803",
  "https://github.com/google-deepmind/optax/pull/1519",
  "https://github.com/google-deepmind/optax/pull/1520",
  "https://github.com/kubeflow/katib/pull/2604",
  "https://github.com/kubeflow/katib/pull/2607",
  "https://github.com/kubeflow/katib/pull/2608",
  "https://github.com/kubeflow/docs-agent/pull/6",
  "https://github.com/kubeflow/sdk/pull/251",
  "https://github.com/kubeflow/docs-agent/pull/27",
  "https://github.com/kubeflow/pipelines/pull/12730",
  "https://github.com/kubeflow/docs-agent/pull/8",
  "https://github.com/gemma-facet/cloud-services/pull/82",
  "https://github.com/gemma-facet/synthetic-data-kit/pull/1",
  "https://github.com/gemma-facet/synthetic-data-kit/pull/2",
  "https://github.com/sktime/sktime/pull/7795",
];

const topRepos = [
  "gemma-facet/cloud-services",
  "gemma-facet/synthetic-data-kit",
  "sktime/sktime",
  "kubeflow/docs-agent",
  "kubeflow/pipelines",
  "kubeflow/katib",
  "kubeflow/sdk",
  "mem0ai/mem0",
  "google-deepmind/optax",
  "meta-llama/synthetic-data-kit",
  "OWASP-BLT/BLT",
];

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const headers = {
  'Accept': 'application/vnd.github.v3+json'
};

if (GITHUB_TOKEN) {
  headers['Authorization'] = `token ${GITHUB_TOKEN}`;
}

async function fetchPRs() {
  console.log('Fetching PRs...');
  if (GITHUB_TOKEN) {
    console.log('✓ Using GitHub token for higher rate limits');
  }
  
  const prs = await Promise.all(
    prUrls.map(async (url, index) => {
      try {
        // Add delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 150));

        const urlParts = url.split('/');
        const owner = urlParts[3];
        const repo = urlParts[4];
        const prNumber = urlParts[6];
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`;

        const response = await fetch(apiUrl, { headers });

        if (!response.ok) {
          console.error(`Failed to fetch ${url}: ${response.status}`);
          return null;
        }

        const data = await response.json();

        // Try to fetch languages
        let languages = [];
        if (data.head && data.head.repo && data.head.repo.languages_url) {
          try {
            const langResponse = await fetch(data.head.repo.languages_url, { headers });

            if (langResponse.ok) {
              const langData = await langResponse.json();
              languages = Object.keys(langData).slice(0, 3);
            }
          } catch (e) {
            // Ignore language fetch errors
          }
        }

        const pr = {
          title: data.title,
          repo: `${owner}/${repo}`,
          url: data.html_url,
          description: (data.body?.slice(0, 120) || 'No description provided') + '...',
          status: data.merged ? "Merged" : (data.state === "open" ? "Open" : "Closed"),
          date: new Date(data.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
          additions: data.additions || 0,
          deletions: data.deletions || 0,
          languages,
          isTopRepo: topRepos.includes(`${owner}/${repo}`)
        };

        console.log(`✓ ${pr.repo} #${prNumber} (${pr.status})`);
        return pr;
      } catch (error) {
        console.error(`✗ Error fetching ${url}:`, error.message);
        return null;
      }
    })
  );

  const validPRs = prs.filter(pr => pr !== null);
  
  // Sort: top repos first, then by status
  validPRs.sort((a, b) => {
    if (a.isTopRepo && !b.isTopRepo) return -1;
    if (!a.isTopRepo && b.isTopRepo) return 1;
    
    const statusOrder = { "Open": 0, "Merged": 1, "Closed": 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  const output = {
    prs: validPRs,
    topRepos: topRepos.filter(repo => validPRs.some(pr => pr.repo === repo)),
    lastUpdated: new Date().toISOString(),
    total: validPRs.length,
    open: validPRs.filter(pr => pr.status === "Open").length,
    merged: validPRs.filter(pr => pr.status === "Merged").length
  };

  const outputPath = path.join(__dirname, '../public/pr-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  
  console.log(`\n✓ Saved ${validPRs.length} PRs to ${outputPath}`);
  console.log(`  Open: ${output.open}, Merged: ${output.merged}`);
  console.log(`  Last updated: ${output.lastUpdated}`);
}

fetchPRs().catch(console.error);
