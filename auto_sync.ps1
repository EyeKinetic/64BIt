# Auto-sync script
# Commits and pushes changes every 60 seconds

Write-Host "Started auto-sync script." -ForegroundColor Green

while ($true) {
    # Check for changes
    $status = git status --porcelain
    
    if (![string]::IsNullOrWhiteSpace($status)) {
        Write-Host "Changes detected. Committing and pushing..." -ForegroundColor Yellow
        git add .
        
        $date = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        git commit -m "Auto-commit at $date"
        git push origin main
        
        Write-Host "Sync complete at $date" -ForegroundColor Green
    }
    
    # Wait 60 seconds
    Start-Sleep -Seconds 60
}
