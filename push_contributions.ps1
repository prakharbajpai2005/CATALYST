$files = (git diff --name-only) + (git ls-files --others --exclude-standard)

foreach ($file in $files) {
    Write-Host "Committing $file..."
    git add $file
    git commit -m "feat: update $file"
}

Write-Host "Pushing changes..."
git push
