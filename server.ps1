$port = 3001
$root = $PSScriptRoot
if (-not $root) { $root = Get-Location }

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:${port}/")
$listener.Prefixes.Add("http://127.0.0.1:${port}/")
$listener.Start()

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  ComexAudit - Servidor HTTP Local Ativo" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Acesse: http://localhost:$port" -ForegroundColor Green
Write-Host ""
Write-Host "  Pressione Ctrl+C para encerrar." -ForegroundColor Yellow
Write-Host ""

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
    ".ttf"  = "font/ttf"
    ".map"  = "application/json"
}

try {
    while ($listener.IsListening) {
        try {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response

            $urlPath = $request.Url.LocalPath
            if ($urlPath -eq "/") { $urlPath = "/index.html" }

            $filePath = Join-Path $root $urlPath.TrimStart("/").Replace("/", "\")

            if (Test-Path $filePath -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
                
                $response.ContentType = $contentType
                $response.StatusCode = 200
                
                # Add CORS headers
                $response.Headers.Add("Access-Control-Allow-Origin", "*")
                
                $fileBytes = [System.IO.File]::ReadAllBytes($filePath)
                $response.ContentLength64 = $fileBytes.Length
                $response.OutputStream.Write($fileBytes, 0, $fileBytes.Length)
                
                Write-Host "[$(Get-Date -Format 'HH:mm:ss')] 200 $urlPath" -ForegroundColor Green
            } else {
                $response.StatusCode = 404
                $msg = [System.Text.Encoding]::UTF8.GetBytes("404 - Arquivo nao encontrado: $urlPath")
                $response.ContentLength64 = $msg.Length
                $response.OutputStream.Write($msg, 0, $msg.Length)
                Write-Host "[$(Get-Date -Format 'HH:mm:ss')] 404 $urlPath" -ForegroundColor Red
            }
        } catch {
            Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Erro ao processar requisicao: $_" -ForegroundColor Yellow
        } finally {
            if ($null -ne $response) {
                try { $response.OutputStream.Close() } catch {}
            }
        }
    }
} finally {
    $listener.Stop()
    Write-Host "Servidor encerrado." -ForegroundColor Yellow
}
