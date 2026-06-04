$nodeExe = "C:\Users\ZhuanZ\.workbuddy\binaries\node\versions\20.18.0.installing.67876.__extract_temp__\node-v20.18.0-win-x64\node.exe"
$npmCli = "C:\Users\ZhuanZ\.workbuddy\binaries\node\versions\20.18.0.installing.67876.__extract_temp__\node-v20.18.0-win-x64\node_modules\npm\bin\npm-cli.js"

Set-Location "c:\Users\ZhuanZ\Downloads\youdao-main (1)\youdao-main"

Write-Host "Installing dependencies..."
& $nodeExe $npmCli install

Write-Host "Starting Vite dev server..."
& $nodeExe $npmCli run dev
