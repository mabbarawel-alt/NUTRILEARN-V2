$port = 8080
$path = $PSScriptRoot
if (-not $path) { $path = (Get-Location).Path }

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
    Write-Host "=========================================="
    Write-Host " NutriLearn Web Server is Running!"
    Write-Host " URL: http://localhost:$port/index.html"
    Write-Host "=========================================="
    
    # Open default browser
    Start-Process "http://localhost:$port/index.html"
} catch {
    Write-Host "Error starting listener: $_"
    # Fallback directly open file in browser
    Start-Process (Join-Path $path "index.html")
    exit 1
}

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".webp" = "image/webp"
    ".ico"  = "image/x-icon"
    ".mp4"  = "video/mp4"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $localPath = [System.Uri]::UnescapeDataString($request.Url.LocalPath.TrimStart('/'))
        if ([string]::IsNullOrWhiteSpace($localPath)) {
            $localPath = "index.html"
        }

        $filePath = [System.IO.Path]::GetFullPath((Join-Path $path $localPath))

        # Block path traversal and private files (database, source, secrets, git)
        $isOutside = -not $filePath.StartsWith([System.IO.Path]::GetFullPath($path), [System.StringComparison]::OrdinalIgnoreCase)
        $leaf = [System.IO.Path]::GetFileName($filePath).ToLower()
        $isPrivate = $localPath.StartsWith('.') -or $localPath -match '(^|[\\/])\.' -or
                     $leaf -eq 'local_db.json' -or
                     @('.py', '.ps1', '.bat', '.sql', '.yaml', '.txt', '.md') -contains [System.IO.Path]::GetExtension($leaf)

        if (-not $isOutside -and -not $isPrivate -and (Test-Path $filePath -PathType Leaf)) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $ct = $mimeTypes[$ext]
            if (-not $ct) { $ct = "application/octet-stream" }
            $response.ContentType = $ct
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.ContentLength64 = $msg.Length
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }
        $response.Close()
    } catch {
        # Continue loop on aborted client connections
    }
}
