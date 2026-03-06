# PR Data Automation

This project automatically fetches and displays your GitHub pull requests.

## How it works

1. **GitHub Actions Workflow** (`.github/workflows/fetch-prs.yml`):
   - Runs automatically **daily at 6 AM UTC**
   - Also runs on every push to `main`
   - Can be triggered manually via GitHub Actions UI

2. **Fetch Script** (`scripts/fetch-prs.cjs`):
   - Fetches all configured PRs from GitHub API
   - Uses the built-in `GITHUB_TOKEN` for higher rate limits
   - Saves data to `public/pr-data.json`

3. **Frontend** (`src/pages/PullRequests.tsx`):
   - Loads PR data from the static JSON file
   - No API calls on client side - super fast!

## Manual Updates

### Run locally:
```bash
npm run fetch-prs
```

### Run with custom GitHub token:
```bash
GITHUB_TOKEN=your_token npm run fetch-prs
```

### Trigger workflow manually on GitHub:
1. Go to Actions → Fetch PRs
2. Click "Run workflow"
3. Select branch and click "Run workflow"

## Adding new PRs

Edit `prUrls` array in `scripts/fetch-prs.cjs`:
```javascript
const prUrls = [
  "https://github.com/owner/repo/pull/123",
  // add more...
];
```

Then run the workflow or script to update.

## Configuration

- **Schedule**: Edit cron in `.github/workflows/fetch-prs.yml`
- **PRs to fetch**: Edit `prUrls` in `scripts/fetch-prs.cjs`
- **Top repos**: Edit `topRepos` in `scripts/fetch-prs.cjs`
