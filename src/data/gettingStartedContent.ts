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
    type: 'warning' as const,
    title: "Don't skip the Unblock step!",
    content: "Windows marks downloaded ZIPs as untrusted. If you skip unblocking, plugins won't load and you'll see confusing errors. Right-click → Properties → Unblock before extracting."
  },
  securityNote: {
    type: 'warning' as const,
    title: 'Security Note',
    content: 'Saved passwords are encrypted but stored locally. For shared machines, use "Do not save password" and authenticate each session. For service accounts, consider Client ID/Secret or Certificate authentication.'
  },
  ideAnalogy: {
    type: 'tip' as const,
    title: 'Think of it as an IDE for Dataverse',
    content: "Just as Visual Studio hosts extensions for different development tasks, XrmToolBox hosts plugins for Dataverse tasks—all sharing the same connection and interface patterns."
  },
};
