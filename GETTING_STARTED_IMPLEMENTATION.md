# Getting Started Page Implementation

## Overview

Add a "Getting Started" intro page to help newcomers understand what XrmToolBox is, how to install it, and how to get plugins.

## 1. Create the Page Component

Create `src/pages/GettingStartedPage.tsx`:

### Content Structure (tabbed sections):

- **What is it?** - Overview, stats (380+ plugins, free, since 2012), "IDE for Dataverse" analogy
- **Why use it?** - 6 benefit cards (Advanced Queries, Bulk Operations, Data Migration, Beyond Standard UI, Plugin Development, Schema Management) + Popular Use Cases list
- **Installation** - 4 numbered steps with warning callout about Unblock step
- **Getting Plugins** - 4 numbered steps + Essential Starter Pack + Pro Tips
- **Connections** - 4 numbered steps + Managing Connection Files tips + Security Note
- **FAQ** - Expandable accordion with 6 common questions

### UI Components needed:

- `TabNavigation` - Horizontal pill buttons to switch sections
- `NumberedStep` - Circle number + title + description
- `CalloutBox` - Variants: warning (red), tip (amber), info (blue), success (green)
- `ExpandableFaq` - Click to expand/collapse answers
- `BenefitCard` - Icon + title + description grid

### Styling:

- Match the store view aesthetic (rounded-2xl cards, slate-50 background, blue-500 accents)
- Sticky header with "Back to Store" button
- Footer CTA banner driving to plugin store
- Mobile responsive (stack cards, horizontal scroll on tabs)

## 2. Add Routing

In your router config, add:

```tsx
<Route path="/getting-started" element={<GettingStartedPage />} />
```

## 3. Add Navigation Link

Add a "Getting Started" link to the main store navigation:

- In store header/nav bar: "Getting Started" or "New to XrmToolBox?" link
- Optional: Add a banner on store home for first-time visitors

## 4. Content Data

Create `src/data/gettingStartedContent.ts` with this content:

```typescript
// Tab sections
export const sections = [
  { id: 'what', label: 'What is it?', icon: '🧰' },
  { id: 'why', label: 'Why use it?', icon: '⚡' },
  { id: 'install', label: 'Installation', icon: '📥' },
  { id: 'plugins', label: 'Getting Plugins', icon: '🔌' },
  { id: 'connect', label: 'Connections', icon: '🔗' },
  { id: 'faq', label: 'FAQ', icon: '❓' },
];

// Benefits for "Why use it?" section
export const benefits = [
  { 
    icon: '🔍', 
    title: 'Advanced Queries', 
    desc: 'Build complex FetchXML with OR conditions, joins, and aggregates that the standard designer can\'t handle' 
  },
  { 
    icon: '📦', 
    title: 'Bulk Operations', 
    desc: 'Import, export, update, or delete thousands of records efficiently' 
  },
  { 
    icon: '🔄', 
    title: 'Data Migration', 
    desc: 'Move configuration data, reference data, and test data between environments' 
  },
  { 
    icon: '🛠️', 
    title: 'Beyond Standard UI', 
    desc: 'Access features not exposed in Power Platform maker tools' 
  },
  { 
    icon: '⚙️', 
    title: 'Plugin Development', 
    desc: 'Register, debug, and profile server-side plugins and workflows' 
  },
  { 
    icon: '📊', 
    title: 'Schema Management', 
    desc: 'Bulk edit attributes, compare environments, document your model' 
  },
];

// Popular use cases
export const useCases = [
  'Build views with OR conditions and complex filters',
  'Generate early-bound classes for .NET development',
  'Move reference data between dev/test/prod',
  'Compare solution components across environments',
  'Debug plugin execution with profiler',
  'Bulk update thousands of records safely',
];

// Installation steps
export const installSteps = [
  { 
    num: 1, 
    title: 'Download from xrmtoolbox.com', 
    detail: 'Click the green download button to get the ZIP file' 
  },
  { 
    num: 2, 
    title: 'Unblock the ZIP file', 
    detail: 'Right-click → Properties → Check "Unblock" → Apply (Windows security requirement)' 
  },
  { 
    num: 3, 
    title: 'Extract to a folder', 
    detail: 'Right-click → Extract All. Choose a permanent location (not Downloads)' 
  },
  { 
    num: 4, 
    title: 'Run XrmToolBox.exe', 
    detail: 'Double-click to launch. Pin to taskbar for quick access' 
  },
];

// Plugin installation steps
export const pluginSteps = [
  { 
    num: 1, 
    title: 'Open Tool Library', 
    detail: 'Configuration menu → Tool Library, or click the plugins icon' 
  },
  { 
    num: 2, 
    title: 'Search or browse', 
    detail: 'Filter by name, author, category, or MVP-created tools' 
  },
  { 
    num: 3, 
    title: 'Select and install', 
    detail: 'Check the tools you want, click Install. They\'re ready immediately' 
  },
  { 
    num: 4, 
    title: 'Keep updated', 
    detail: 'Tool Library shows available updates. Enable auto-check in settings' 
  },
];

// Connection steps
export const connectionSteps = [
  { 
    num: 1, 
    title: 'Click Connect', 
    detail: 'Bottom-left corner of the main window' 
  },
  { 
    num: 2, 
    title: 'Create new connection', 
    detail: 'Use Connection Wizard for guided setup, or Microsoft Login Control' 
  },
  { 
    num: 3, 
    title: 'Enter environment URL', 
    detail: 'Get this from Power Platform Admin Center → Environments → Your env → Environment URL' 
  },
  { 
    num: 4, 
    title: 'Authenticate', 
    detail: 'Sign in with your Microsoft 365 credentials. Optionally save password (encrypted)' 
  },
];

// Essential starter plugins - use NuGet IDs for linking
export const starterPlugins = [
  { name: 'FetchXML Builder', author: 'Jonas Rapp', nugetId: 'Cinteros.XrmToolBox.FetchXMLBuilder' },
  { name: 'Plugin Registration Tool', author: 'Microsoft', nugetId: 'Microsoft.CrmSdk.XrmTooling.PluginRegistrationTool' },
  { name: 'Early Bound Generator', author: 'Daryl LaBar', nugetId: 'DLaB.Xrm.EarlyBoundGenerator' },
  { name: 'Bulk Data Updater', author: 'Jonas Rapp', nugetId: 'Cinteros.XrmToolBox.BulkDataUpdater' },
  { name: 'SQL 4 CDS', author: 'Mark Carrington', nugetId: 'MarkMpn.SQL4CDS' },
  { name: 'Metadata Browser', author: 'Tanguy Touzard', nugetId: 'MsCrmTools.MetadataBrowser' },
];

// Pro tips for plugin section
export const pluginProTips = [
  'Filter by "MVP" to find tools built by Microsoft MVPs—usually high quality',
  'Star your favorites for quick access from the home screen',
  'Check "Open Source" filter to find tools you can contribute to',
  'Sort by "Most Downloaded" to find proven, popular tools',
];

// Connection file management tips
export const connectionTips = [
  { label: 'By project', desc: 'Keep project-specific connections in a file alongside your repo' },
  { label: 'By client', desc: 'Separate files per client for consultants' },
  { label: 'Cloud sync', desc: 'Store in OneDrive to access from any machine' },
];

// FAQs
export const faqs = [
  { 
    question: 'Who created XrmToolBox?', 
    answer: 'Tanguy Touzard (MVP) created and maintains XrmToolBox. The plugin ecosystem is built by hundreds of community contributors.' 
  },
  { 
    question: 'Is it free?', 
    answer: 'Yes, completely free. Some individual plugins may have premium features, but XrmToolBox itself and most plugins are free.' 
  },
  { 
    question: 'Does it work with Power Platform?', 
    answer: 'Yes! XrmToolBox works with Dataverse, which underpins Dynamics 365 CE, Power Apps, and Power Platform environments.' 
  },
  { 
    question: 'Where are settings stored?', 
    answer: 'In the storage folder alongside the executable. This includes connections, plugin DLLs, and logs. You can find shortcuts in Settings → Paths.' 
  },
  { 
    question: 'Can I use it on multiple PCs?', 
    answer: 'Yes. Store your connection files in OneDrive or a shared location, then import them on any PC.' 
  },
  { 
    question: 'How do I report plugin issues?', 
    answer: 'Each plugin has its own GitHub repository. Use the plugin\'s "Open GitHub" option to report issues to the correct maintainer.' 
  },
];

// External resource links
export const resourceLinks = [
  { label: 'XrmToolBox Official Site', url: 'https://www.xrmtoolbox.com', icon: '🌐' },
  { label: 'Official Documentation', url: 'https://www.xrmtoolbox.com/documentation/', icon: '📖' },
  { label: 'GitHub Repository', url: 'https://github.com/MscrmTools/XrmToolBox', icon: '💻' },
];

// Callout content
export const callouts = {
  unblockWarning: {
    type: 'warning',
    title: "Don't skip the Unblock step!",
    content: "Windows marks downloaded ZIPs as untrusted. If you skip unblocking, plugins won't load and you'll see confusing errors. Right-click → Properties → Unblock before extracting."
  },
  securityNote: {
    type: 'warning',
    title: 'Security Note',
    content: 'Saved passwords are encrypted but stored locally. For shared machines, use "Do not save password" and authenticate each session. For service accounts, consider Client ID/Secret or Certificate authentication.'
  },
  ideAnalogy: {
    type: 'tip',
    title: 'Think of it as an IDE for Dataverse',
    content: "Just as Visual Studio hosts extensions for different development tasks, XrmToolBox hosts plugins for Dataverse tasks—all sharing the same connection and interface patterns."
  },
};
```

## 5. CalloutBox Component Variants

- `warning` - Red background (red-50 border red-200), ⚠️ icon
- `tip` - Amber background (amber-50 border amber-200), 💡 icon  
- `info` - Blue background (blue-50 border blue-200), ℹ️ icon
- `success` - Green background (green-50 border green-200), ✓ icon

## 6. Key Stats Display

Show prominently in "What is it?" section:
- **380+** available plugins (pull actual count from plugins.json)
- **Free** open source core
- **2012** community since

## 7. External Links

Links should open in new tab (`target="_blank" rel="noopener noreferrer"`):
- https://www.xrmtoolbox.com - Official site
- https://www.xrmtoolbox.com/documentation/ - Docs
- https://github.com/MscrmTools/XrmToolBox - GitHub

## 8. SEO Meta Tags

```tsx
// Use react-helmet or your meta tag solution
<title>Getting Started with XrmToolBox - Plugin Catalog</title>
<meta name="description" content="Learn how to install XrmToolBox, connect to Dataverse, and discover 380+ plugins for Microsoft Power Platform and Dynamics 365." />
```

## 9. File Structure

```
src/
├── pages/
│   └── GettingStartedPage.tsx
├── components/
│   └── getting-started/
│       ├── TabNavigation.tsx
│       ├── NumberedStep.tsx
│       ├── CalloutBox.tsx
│       ├── ExpandableFaq.tsx
│       ├── BenefitCard.tsx
│       └── StarterPackGrid.tsx
├── data/
│   └── gettingStartedContent.ts
```

## 10. Testing Checklist

- [ ] All 6 tabs render correctly
- [ ] Tab state persists (or resets appropriately)  
- [ ] FAQ accordion expands/collapses
- [ ] External links open in new tab
- [ ] Starter Pack plugins link to correct store pages (`/plugin/:nugetId`)
- [ ] Mobile: tabs are horizontally scrollable
- [ ] Mobile: numbered steps are readable
- [ ] "Back to Store" navigation works
- [ ] Footer CTA links to store home
- [ ] Plugin count stat pulls from actual data
