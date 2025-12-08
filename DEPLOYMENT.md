# Deployment Guide

This document covers all deployment options for the XrmToolBox Plugin Catalog.

## GitHub Pages (Recommended)

### Initial Setup

1. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click "Settings" tab
   - Click "Pages" in the left sidebar
   - Under "Build and deployment" → "Source", select **"GitHub Actions"**
   - Save the settings

2. **Trigger Initial Deployment**:
   - The deployment workflow will run automatically on the next push to `main`
   - Or manually trigger it:
     - Go to "Actions" tab
     - Select "Deploy to GitHub Pages"
     - Click "Run workflow"

3. **Access Your Site**:
   - Your site will be available at: `https://xrm.jukkan.com`
   - The URL will be shown in the workflow run output

### Automatic Deployments

The site automatically deploys when:
- Code is pushed to the `main` branch
- Plugin data is refreshed by the automated workflow
- You manually trigger the "Deploy to GitHub Pages" workflow

### How It Works

1. The `.github/workflows/deploy-pages.yml` workflow runs
2. Dependencies are installed with `npm ci`
3. Production build is created with `npm run build`
4. Built files from `./dist` are uploaded
5. Site is deployed to GitHub Pages

### Build Configuration

The Vite configuration (`vite.config.ts`) includes:
```typescript
base: "/"
```

This ensures all asset paths are correct for the custom domain (xrm.jukkan.com).

## Ubuntu VPS Deployment (Alternative)

If you prefer to host on your Hetzner VPS with Nginx:

### Prerequisites

- Ubuntu VPS with Nginx installed
- Node.js 20+ installed
- Git installed
- Domain name (optional)

### Deployment Steps

1. **Clone the repository on your VPS**:
```bash
ssh user@your-vps-ip
cd /var/www
sudo git clone https://github.com/jukkan/xrmtoolbox-plugin-catalog.git
cd xrmtoolbox-plugin-catalog
```

2. **Install dependencies and build**:
```bash
npm ci
npm run build
```

3. **Configure Nginx**:
Create a new site configuration:
```bash
sudo nano /etc/nginx/sites-available/xrmtoolbox-catalog
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;  # or your VPS IP

    root /var/www/xrmtoolbox-plugin-catalog/dist;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

4. **Enable the site**:
```bash
sudo ln -s /etc/nginx/sites-available/xrmtoolbox-catalog /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

5. **Set up SSL with Let's Encrypt** (recommended):
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Automatic Updates on VPS

Create a deployment script (`/var/www/xrmtoolbox-plugin-catalog/deploy.sh`):
```bash
#!/bin/bash
cd /var/www/xrmtoolbox-plugin-catalog
git pull origin main
npm ci
npm run build
echo "Deployment complete!"
```

Make it executable:
```bash
chmod +x deploy.sh
```

#### Option 1: Manual Deployment
```bash
sudo /var/www/xrmtoolbox-plugin-catalog/deploy.sh
```

#### Option 2: Webhook-Based Deployment

Install webhook handler:
```bash
sudo npm install -g webhook
```

Create webhook configuration (`/etc/webhook.conf`):
```json
[
  {
    "id": "deploy-catalog",
    "execute-command": "/var/www/xrmtoolbox-plugin-catalog/deploy.sh",
    "command-working-directory": "/var/www/xrmtoolbox-plugin-catalog",
    "response-message": "Deploying catalog...",
    "trigger-rule": {
      "match": {
        "type": "payload-hash-sha1",
        "secret": "your-webhook-secret",
        "parameter": {
          "source": "header",
          "name": "X-Hub-Signature"
        }
      }
    }
  }
]
```

Then configure GitHub webhook in repository settings.

## Lovable Hosting

For quick previews and development:

1. Go to [Lovable Project](https://lovable.dev/projects/8afc1288-dc6b-41ee-85d6-e9ee544548b6)
2. Click "Share" → "Publish"
3. Site will be available at Lovable's provided URL

**Note**: Lovable is convenient for development but GitHub Pages or VPS hosting is recommended for production.

## Comparison

| Feature | GitHub Pages | VPS | Lovable |
|---------|--------------|-----|---------|
| Cost | Free | VPS cost | Free tier available |
| Setup Complexity | Easy | Medium | Very Easy |
| Custom Domain | Yes (free) | Yes | Yes (paid) |
| SSL/HTTPS | Automatic | Manual setup | Automatic |
| Automatic Deployment | Yes | Requires setup | Yes |
| Build Time | ~2-3 min | Instant (after build) | ~1-2 min |
| Recommended For | Production | Full control needed | Development |

## Recommended Approach

1. **Development**: Use Lovable or local dev server (`npm run dev`)
2. **Staging/Preview**: Use GitHub Pages from feature branches
3. **Production**: Use GitHub Pages (simplest) or VPS (more control)

## Monitoring Deployments

### GitHub Pages
- View deployment status in the "Actions" tab
- Each deployment shows build logs and deploy time
- Failed deployments will send notifications (configure in Settings)

### VPS
- Check Nginx logs: `sudo tail -f /var/log/nginx/access.log`
- Monitor deployment script output
- Set up monitoring with tools like Uptime Robot or Pingdom

## Troubleshooting

### GitHub Pages: 404 Errors
- Ensure the base URL in `vite.config.ts` matches your repository name
- Check that "GitHub Actions" is selected as the source in repository settings

### VPS: Assets Not Loading
- Verify Nginx root path is correct
- Check file permissions: `sudo chown -R www-data:www-data /var/www/xrmtoolbox-plugin-catalog/dist`

### Build Failures
- Check Node.js version: `node --version` (should be 20+)
- Clear cache: `rm -rf node_modules package-lock.json && npm install`
- Review build logs in GitHub Actions or local terminal
