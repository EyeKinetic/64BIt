# Auto-commit and push script
# Run this script to automatically sync your changes to GitHub every 60 seconds.

Write-Host "Started auto-sync script. Press Ctrl+C to stop." -ForegroundColor Green

while ($true) {
    # Check if there are any changes
    $status = git status --porcelain
    
    if (![string]::IsNullOrWhiteSpace($status)) {
        Write-Host "Changes detected. Committing and pushing..." -ForegroundColor Yellow
        git add .
        
        $date = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        git commit -m "Auto-commit at $date"
        git push origin main
        
        Write-Host "Sync complete at $date" -ForegroundColor Green
    }
    
    # Wait for 60 seconds before checking again
    Start-Sleep -Seconds 60
}
