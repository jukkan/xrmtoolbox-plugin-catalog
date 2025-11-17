# Plugin Data Refresh System

This document describes the automated system for refreshing the plugin catalog data from the XrmToolBox OData feed.

## Data Source

The plugin data is sourced from the public XrmToolBox Power Pages OData endpoint:
```
https://www.xrmtoolbox.com/_odata/plugins
```

This endpoint requires no authentication and returns plugin information in OData JSON format.

## System Components

### 1. Refresh Script (`scripts/refresh-plugins.js`)

A Node.js script that:
- Fetches the latest plugin data from the OData endpoint
- Validates the response structure
- Updates `src/data/plugins.json` with proper formatting
- Displays statistics about the plugins

**Usage:**
```bash
npm run refresh-plugins
```

### 2. Admin Wrapper Script (`scripts/refresh.sh`)

A convenient bash script for administrators that:
- Runs the refresh script
- Detects changes in the plugin data
- Optionally commits changes to git

**Usage:**
```bash
# Refresh only (no commit)
./scripts/refresh.sh

# Refresh and commit changes
./scripts/refresh.sh --commit
```

### 3. GitHub Actions Workflow (`.github/workflows/refresh-plugins.yml`)

Automated workflow that:
- **Runs daily** at 2 AM UTC (scheduled via cron)
- **Can be triggered manually** from the GitHub Actions tab
- Automatically commits and pushes changes if plugin data is updated
- Only creates commits when actual changes are detected
- Has write permissions to commit changes back to the repository

**Manual Trigger:**
1. Go to your GitHub repository
2. Click on the "Actions" tab
3. Select "Refresh Plugin Data" workflow
4. Click "Run workflow"
5. Optionally provide a reason for the refresh
6. Click the green "Run workflow" button

## Deployment Scenarios

### Development (Lovable Hosting)

For on-demand refresh during development:

```bash
# Quick refresh
npm run refresh-plugins

# Or use the admin script
./scripts/refresh.sh --commit
git push
```

### Production (Ubuntu VPS with Nginx)

#### Option 1: Manual Refresh via GitHub Actions (Recommended)

1. Trigger the workflow manually from GitHub Actions
2. Changes are automatically deployed via your CI/CD pipeline

#### Option 2: Scheduled Refresh (Already Configured)

The GitHub Action runs automatically every day at 2 AM UTC. No additional setup needed.

#### Option 3: Direct VPS Execution

If you want to run the refresh directly on the VPS:

```bash
# SSH into your VPS
ssh user@your-vps-ip

# Navigate to your project directory
cd /path/to/xrmtoolbox-plugin-catalog

# Run the refresh
npm run refresh-plugins

# Or use the admin script
./scripts/refresh.sh --commit

# Push changes (if not auto-deploying from git)
git push
```

#### Option 4: VPS Cron Job (Alternative to GitHub Actions)

If you prefer to run the refresh directly on your VPS, add a cron job:

```bash
# Edit crontab
crontab -e

# Add this line to run daily at 2 AM local time:
0 2 * * * cd /path/to/xrmtoolbox-plugin-catalog && npm run refresh-plugins && git add src/data/plugins.json && git commit -m "chore: daily plugin refresh" && git push

# Or use the admin script:
0 2 * * * cd /path/to/xrmtoolbox-plugin-catalog && ./scripts/refresh.sh --commit && git push
```

## How It Works

### Automated Daily Updates

1. **GitHub Action triggers** at 2 AM UTC daily
2. **Script fetches** data from OData endpoint
3. **Data is validated** and formatted
4. **If changes detected**:
   - File is updated
   - Changes are committed
   - Commit is pushed to repository
5. **If no changes**: Workflow completes with no commit

### Manual Updates

1. **Admin triggers** refresh (via GitHub Actions UI or local script)
2. **Same process** as automated updates
3. **Option to review** changes before committing (when using `./scripts/refresh.sh`)

## Monitoring

### GitHub Actions

- View workflow runs in the "Actions" tab of your repository
- Each run shows:
  - Success/failure status
  - Whether changes were detected
  - Number of plugins fetched
  - Commit details (if changes were made)

### Local Testing

Test the refresh script locally:

```bash
# Dry run (no commit)
npm run refresh-plugins

# Check for changes
git status

# Review changes
git diff src/data/plugins.json
```

## Troubleshooting

### Script fails to fetch data

**Possible causes:**
- Network connectivity issues
- OData endpoint is temporarily down
- Rate limiting or access restrictions

**Solutions:**
- Check network connectivity: `curl https://www.xrmtoolbox.com/_odata/plugins`
- Wait a few minutes and try again
- Check GitHub Actions logs for detailed error messages

### No changes detected but data seems outdated

**Possible causes:**
- The OData feed itself hasn't been updated
- The data is already current

**Solutions:**
- Verify the OData endpoint directly in a browser
- Check the `mctools_latestreleasedate` fields in the JSON
- Compare with the XrmToolBox official website

### Commit conflicts

**Possible causes:**
- Local changes conflict with automated commits
- Multiple refresh operations running simultaneously

**Solutions:**
```bash
# Pull latest changes
git pull

# Re-run refresh
npm run refresh-plugins
```

## Benefits of This System

1. **Always Up-to-Date**: Plugin catalog automatically stays current
2. **No Manual Work**: Scheduled daily updates require no intervention
3. **Flexible**: On-demand refresh when you need it
4. **Transparent**: All updates are tracked in git history
5. **Reliable**: Redundant options (GitHub Actions + VPS cron if needed)
6. **Efficient**: Only commits when actual changes occur

## File Locations

- **Plugin Data**: `src/data/plugins.json`
- **Refresh Script**: `scripts/refresh-plugins.js`
- **Admin Script**: `scripts/refresh.sh`
- **GitHub Workflow**: `.github/workflows/refresh-plugins.yml`
- **Documentation**: `PLUGIN_REFRESH.md` (this file)
