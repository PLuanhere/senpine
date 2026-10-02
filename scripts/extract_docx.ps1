Add-Type -AssemblyName System.IO.Compression.FileSystem

function Extract-DocxText($docxPath, $outPath) {
    Write-Host "Extracting $docxPath ..."
    $zip = [System.IO.Compression.ZipFile]::OpenRead($docxPath)
    $entry = $zip.GetEntry("word/document.xml")
    if ($entry -ne $null) {
        $stream = $entry.Open()
        $reader = New-Object System.IO.StreamReader($stream)
        $content = $reader.ReadToEnd()
        $reader.Close()
        $stream.Close()
        
        # Remove XML tags and extract text cleanly
        # Replace w:p with newlines
        $content = $content -replace '<w:p[ >]', "`n<w:p>"
        $content = $content -replace '<[^>]+>', ''
        $content = [System.Web.HttpUtility]::HtmlDecode($content)
        
        [System.IO.File]::WriteAllText($outPath, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Saved to $outPath"
    } else {
        Write-Host "No word/document.xml found in $docxPath"
    }
    $zip.Dispose()
}

Add-Type -AssemblyName System.Web
Extract-DocxText "d:\WEB\SenPine\Requirements.docx" "d:\WEB\SenPine\docs\requirements_extracted.txt"
Extract-DocxText "d:\WEB\SenPine\Details.docx" "d:\WEB\SenPine\docs\details_extracted.txt"
