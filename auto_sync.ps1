# Hey! I'm your friendly auto-sync bot 🤖
# Just run me in the background and I'll make sure all your hard work 
# gets safely pushed to GitHub every 60 seconds without you lifting a finger!

Write-Host "Started auto-sync script. Just leave me running and press Ctrl+C if you need me to stop." -ForegroundColor Green

while ($true) {
    # Let's peek and see if you changed anything...
    $status = git status --porcelain
    
    if (![string]::IsNullOrWhiteSpace($status)) {
        Write-Host "Ooh, I see some changes! Committing and pushing them up now..." -ForegroundColor Yellow
        git add .
        
        $date = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        git commit -m "Auto-commit at $date. You're doing great!"
        git push origin main
        
        Write-Host "All synced up safely at $date! 😎" -ForegroundColor Green
    }
    
    # I'll take a quick 60-second nap before checking again
    Start-Sleep -Seconds 60
}
