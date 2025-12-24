# Script to remove all console.log statements from JavaScript/JSX files
# Bu script tum console.log, console.warn, console.error, console.info, console.debug ifadelerini siler

$rootPath = "c:\Users\msı\Desktop\Freelance\Elite Travel\elite-travel\src"
$backupPath = "c:\Users\msı\Desktop\Freelance\Elite Travel\console-logs-backup"

# Backup klasoru olustur
if (-not (Test-Path $backupPath)) {
    New-Item -ItemType Directory -Path $backupPath | Out-Null
    Write-Host "[OK] Backup klasoru olusturuldu: $backupPath" -ForegroundColor Green
}

    # Tum JS ve JSX dosyalarini bul
$files = Get-ChildItem -Path $rootPath -Recurse -Include *.js,*.jsx

$totalFiles = 0
$totalRemoved = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Backup al
    $relativePath = $file.FullName.Replace($rootPath, "")
    $backupFile = Join-Path $backupPath $relativePath
    $backupDir = Split-Path $backupFile -Parent
    
    if (-not (Test-Path $backupDir)) {
        New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    }
    
    Copy-Item $file.FullName $backupFile -Force
    
    # Console statement sayisini say
    $beforeCount = ([regex]::Matches($content, "console\.(log|warn|error|info|debug)")).Count
    
    if ($beforeCount -gt 0) {
        # Regex pattern: console.log(...), console.error(...), etc.
        # Tek satır console statements
        $content = $content -replace "console\.(log|warn|error|info|debug)\([^)]*\);?[\r\n]*", ""
        
        # Cok satirli console statements (parantez icinde birden fazla satir)
        $content = $content -replace "console\.(log|warn|error|info|debug)\([^)]*(\([^)]*\))*[^)]*\);?[\r\n]*", ""
        
        # Geriye kalan bos satirlari temizle (3'ten fazla bos satir varsa 2'ye indir)
        $content = $content -replace "(\r?\n){4,}", "`n`n"
        
        # Dosyayi kaydet
        Set-Content $file.FullName -Value $content -NoNewline
        
        $afterCount = ([regex]::Matches($content, "console\.(log|warn|error|info|debug)")).Count
        $removed = $beforeCount - $afterCount
        
        if ($removed -gt 0) {
            $totalFiles++
            $totalRemoved += $removed
            Write-Host "[CLEAN] $($file.Name): $removed console statement silindi" -ForegroundColor Yellow
        }
    }
}

Write-Host "`n[OK] Islem tamamlandi!" -ForegroundColor Green
Write-Host "[INFO] Toplam $totalFiles dosya guncellendi" -ForegroundColor Cyan
Write-Host "[INFO] Toplam $totalRemoved console statement silindi" -ForegroundColor Cyan
Write-Host "[INFO] Backup klasoru: $backupPath" -ForegroundColor Cyan
