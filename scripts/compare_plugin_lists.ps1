$repoPath = 'e:\Dev\jukkan\xrmtoolbox-plugin-catalog\src\data\plugins.json'
$repo = Get-Content -Raw $repoPath | ConvertFrom-Json
$repoNames = @($repo.value | ForEach-Object { $_.mctools_name } | Where-Object { $_ -and $_.Trim() })

$siteUrl = 'https://www.xrmtoolbox.com/plugins/'
$siteContent = (Invoke-WebRequest -Uri $siteUrl -UseBasicParsing).Content
$siteHeaderMatch = [regex]::Match($siteContent, '\b\d+\s+tools? so far\b', 'IgnoreCase')

$rows = [regex]::Matches($siteContent, '(?s)<tr class="pluginRow"[^>]*>.*?</tr>')
$siteNames = New-Object System.Collections.Generic.List[string]
foreach ($row in $rows) {
    $m = [regex]::Match($row.Value, '(?s)<td class="searchable"><a[^>]*>(.*?)</a></td>')
    if ($m.Success) {
        $name = [System.Text.RegularExpressions.Regex]::Replace($m.Groups[1].Value, '<.*?>', '')
        $name = [System.Net.WebUtility]::HtmlDecode($name).Trim()
        if ($name) { $siteNames.Add($name) }
    }
}

$repoSet = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
foreach ($n in $repoNames) { [void]$repoSet.Add($n) }
$siteSet = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
foreach ($n in $siteNames) { [void]$siteSet.Add($n) }

$repoOnly = @($repoSet | Where-Object { -not $siteSet.Contains($_) } | Sort-Object)
$siteOnly = @($siteSet | Where-Object { -not $repoSet.Contains($_) } | Sort-Object)

"site_header_count=$($siteHeaderMatch.Value)"
"repo_count=$($repoNames.Count)"
"site_count=$($siteNames.Count)"
"common_count=$($repoSet.Count - $repoOnly.Count)"
"repo_only_count=$($repoOnly.Count)"
"site_only_count=$($siteOnly.Count)"
"repo_only_sample=$($repoOnly[0..([Math]::Min(20, $repoOnly.Count - 1))] -join '; ')"
"site_only_sample=$($siteOnly[0..([Math]::Min(20, $siteOnly.Count - 1))] -join '; ')"
"repo_only_names=$($repoOnly -join '; ')"
"site_only_names=$($siteOnly -join '; ')"
