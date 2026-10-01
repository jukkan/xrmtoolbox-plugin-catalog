import json
from collections import Counter

with open(r'e:\Dev\jukkan\xrmtoolbox-plugin-catalog\src\data\plugins.json', encoding='utf-8') as f:
    items = json.load(f)['value']

repo_only = [
    'Access Team Studio','Access Team Viewer','ActionGenerator','Advanced Data Manager','Advanced FetchXML Tester','Advanced Plugin Trace Log Finder','Attachments Management','Attributes Creator','Audit History Editor','Bulk Update Entity Change Tracking','Bypass Logic Column Updater','Chart Transfer Tool','Check Lists','Connection updater','CRM Workflow Explorer','CSV Importer','CsvToFilters','Data Import ++ BETA','DateTime Behavior Modifier','DURecordExporter','Email Template Manager','Entites Audit Editor For XrmToolBox','Entity  MetaData editor','Entity Privilege Copy Tool','GT Bulk Record Assigner','GT Solution Importer','GT Users Creator','JSON to Dataverse','Metadata++','MsCrmTools Environment Change Scanner','O365 License Details','One Attribute Bulk Upload','Portal Metadata Translation Manager','Power Automate Run History Viewer','Record URL Generator','Reset UCI Dashboard Defaults','Segment Members Import','Solution Management (err403)','Solution Packager Tool','Theme Customizer','User Audit Summary','Xrm XSD Schema Validation','Xrm.RecordsRestorator.Plugin','XrmToolBox FiddlerAutoResponder','XRTSoft.PowerApps.PowerFind','Your MS Teams - Integrated'
]
repo_only_lower = {n.casefold() for n in repo_only}

status_counts = Counter(item.get('statuscode') for item in items if 'statuscode' in item)
state_counts = Counter(item.get('statecode') for item in items if 'statecode' in item)
validated_counts = Counter(item.get('mctools_validated') for item in items if 'mctools_validated' in item)

print('statuscode distinct values:', dict(status_counts))
print('statecode distinct values:', dict(state_counts))
print('mctools_validated values:', dict(validated_counts))

repo_only_with_status = []
for item in items:
    name = item.get('mctools_name')
    if name and name.casefold() in repo_only_lower:
        repo_only_with_status.append({
            'name': name,
            'statuscode': item.get('statuscode'),
            'statuscode@OData.Community.Display.V1.FormattedValue': item.get('statuscode@OData.Community.Display.V1.FormattedValue'),
            'mctools_validated': item.get('mctools_validated'),
            'statecode': item.get('statecode'),
            'mctools_isopensource': item.get('mctools_isopensource')
        })

print('repo_only_items_with_status', len(repo_only_with_status))
print('sample_repo_only_statuses', repo_only_with_status[:10])

# check whether any statuscode indicates non-public or not active
non_public = [i for i in items if i.get('statuscode') not in (180000000, 180000001, 180000002) or i.get('statecode') not in (0,1)]
print('non_public_count', len(non_public))
print('non_public_sample', [i.get('mctools_name') for i in non_public[:10]])
