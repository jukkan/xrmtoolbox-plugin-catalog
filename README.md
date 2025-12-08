# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/8afc1288-dc6b-41ee-85d6-e9ee544548b6

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/8afc1288-dc6b-41ee-85d6-e9ee544548b6) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

### GitHub Pages (Recommended)

The project is configured to automatically deploy to GitHub Pages on every push to the main branch.

**Initial Setup** (one-time):
1. Go to your repository settings
2. Navigate to "Pages" in the left sidebar
3. Under "Build and deployment" → "Source", select "GitHub Actions"
4. The site will be available at: `https://xrm.jukkan.com`

**Automatic Deployment:**
- Every push to the `main` branch triggers an automatic deployment
- You can also manually trigger deployment from the Actions tab

### Lovable Hosting (Alternative)

You can also deploy via Lovable by opening the [Lovable Project](https://lovable.dev/projects/8afc1288-dc6b-41ee-85d6-e9ee544548b6) and clicking Share → Publish.

### Ubuntu VPS Deployment

For detailed instructions on deploying to your Ubuntu VPS with Nginx, see [DEPLOYMENT.md](./DEPLOYMENT.md).

📖 **Full deployment documentation**: [DEPLOYMENT.md](./DEPLOYMENT.md)

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Plugin Data Management

This catalog automatically syncs with the [XrmToolBox OData feed](https://www.xrmtoolbox.com/_odata/plugins) to keep plugin information up-to-date.

### Automated Updates

- **Daily Refresh**: Plugin data is automatically updated every day at 2 AM UTC via GitHub Actions
- **Manual Refresh**: Trigger an update anytime from the GitHub Actions tab

### Manual Refresh Commands

For development or immediate updates:

```sh
# Quick refresh
npm run refresh-plugins

# Refresh and commit changes
./scripts/refresh.sh --commit
```

📖 For detailed documentation on the refresh system, see [PLUGIN_REFRESH.md](./PLUGIN_REFRESH.md)
