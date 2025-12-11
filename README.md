# XrmToolBox Plugin Catalog

A modern, user-friendly web interface for browsing and discovering [XrmToolBox](https://www.xrmtoolbox.com/) plugins.

**Live Site**: [xrm.jukkan.com](https://xrm.jukkan.com)

<img width="1463" height="1182" alt="image" src="https://github.com/user-attachments/assets/ddea30de-ddff-4524-9288-84bea5200d2d" />

## What is this?

This is an independent, modern UI layer built on top of the XrmToolBox plugin catalog. It provides a clean, searchable interface to explore the hundreds of plugins available for XrmToolBox, making it easier to discover tools for your Microsoft Dynamics 365 / Dataverse development needs. Built by [Jukka Niiiranen](https://jukkan.com/), using AI coding tools like Claude Code and Lovable.

**Important**: XrmToolBox is a separate project maintained by the XrmToolBox community and the original creator, Tanguy Touzard. This web catalog simply presents the plugin data from the official XrmToolBox OData feed in a modern, accessible format. For the official XrmToolBox application repo, please visit [github.com/MscrmTools/XrmToolBox](https://github.com/MscrmTools/XrmToolBox)

## Features

- **Real-time Search**: Instantly filter through all available plugins
- **Detailed Plugin Information**: View descriptions, authors, downloads, and version history
- **Automatic Updates**: Plugin data automatically syncs daily from the official XrmToolBox feed
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Built with modern web technologies for a smooth user experience

## How it Works

The application fetches plugin data from the [XrmToolBox OData endpoint](https://www.xrmtoolbox.com/_odata/plugins) and presents it through a React-based single-page application. The data is automatically refreshed daily via GitHub Actions to ensure the catalog stays up-to-date.

### Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui (built on Radix UI)
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Data Fetching**: TanStack Query
- **Deployment**: GitHub Pages

## Local Development

Want to run the catalog locally or contribute improvements?

### Prerequisites

- Node.js 20+ and npm

### Setup

```bash
# Clone the repository
git clone https://github.com/jukkan/xrmtoolbox-plugin-catalog.git

# Navigate to the project directory
cd xrmtoolbox-plugin-catalog

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Refresh Plugin Data

```bash
# Fetch the latest plugin data from XrmToolBox
npm run refresh-plugins
```

## Deployment

The site is automatically deployed to [xrm.jukkan.com](https://xrm.jukkan.com) via GitHub Pages whenever changes are pushed to the main branch.

## Plugin Data

Plugin information is sourced from the official XrmToolBox OData feed and updated automatically:

- **Daily Refresh**: Plugin data syncs every day at 2 AM UTC via GitHub Actions
- **Manual Refresh**: Can be triggered anytime from the GitHub Actions tab

For more details about the data refresh system, see [PLUGIN_REFRESH.md](./PLUGIN_REFRESH.md).

## Feedback, Issues, Contributing

Found a bug? Have a suggestion? Want to see a new feature? Want to build it?

Please open an issue on GitHub: [github.com/jukkan/xrmtoolbox-plugin-catalog/issues](https://github.com/jukkan/xrmtoolbox-plugin-catalog/issues)

## License

This project is open source and available under the MIT License.

## Acknowledgments

- **XrmToolBox**: The amazing tool that makes Dynamics 365 / Dataverse development easier. Visit [www.xrmtoolbox.com](https://www.xrmtoolbox.com/) to download the application.
- **XrmToolBox Community**: All the plugin developers who contribute to the XrmToolBox ecosystem.
- **shadcn/ui**: For the beautiful, accessible UI components.

---

**Disclaimer**: This web catalog is not officially affiliated with XrmToolBox. It is an independent project that provides an alternative interface to browse the publicly available XrmToolBox plugin data. For official XrmToolBox support and downloads, please visit [www.xrmtoolbox.com](https://www.xrmtoolbox.com/).
