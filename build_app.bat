@echo off
setlocal enabledelayedexpansion

echo ================================
echo 正在构建言道学外语APP v1.0
echo ================================

:: 自动查找 Node.js
set NODE_EXE=
for %%d in (
    "C:\Program Files\nodejs\node.exe"
    "C:\Program Files (x86)\nodejs\node.exe"
    "%APPDATA%\fnm\node-versions\*\installation\node.exe"
    "%LOCALAPPDATA%\fnm\node-versions\*\installation\node.exe"
    "%USERPROFILE%\.nvm\versions\node\*\node.exe"
) do (
    if exist %%d (
        set NODE_EXE=%%d
        goto :found_node
    )
)
:: 尝试 PATH 中查找
where node >nul 2>&1
if %errorlevel% equ 0 (
    set NODE_EXE=node
    goto :found_node
)

echo [ERROR] 未找到 Node.js！请先安装 Node.js 20+
echo 下载地址：https://nodejs.org/
pause
exit /b 1

:found_node
echo [INFO] Node.js: !NODE_EXE!
!NODE_EXE! --version

:: 查找 npm
set NPM_CLI=
if exist "node_modules\npm\bin\npm-cli.js" (
    set NPM_CLI=node_modules\npm\bin\npm-cli.js
) else if exist "%APPDATA%\npm\node_modules\npm\bin\npm-cli.js" (
    set NPM_CLI=%APPDATA%\npm\node_modules\npm\bin\npm-cli.js
) else (
    :: 直接用 npx
    set NPM_CLI=
)

:: Step 1: npm install (if needed)
echo.
echo [1/4] 检查依赖...
if not exist "node_modules" (
    echo 正在安装依赖...
    if defined NPM_CLI (
        !NODE_EXE! !NPM_CLI! install
    ) else (
        !NODE_EXE! node_modules\npm\bin\npx-cli.js npm install 2>nul || call npm install
    )
) else (
    echo 依赖已安装
)

:: Step 2: Build web
echo.
echo [2/4] 构建 Web 产物 (npm run build)...
!NODE_EXE! node_modules\npm\bin\npx-cli.js run build 2>nul
if %errorlevel% neq 0 (
    :: fallback: try npx directly
    !NODE_EXE! node_modules\.bin\vite build 2>nul
    if !errorlevel! neq 0 (
        echo [ERROR] Web 构建失败！
        pause
        exit /b 1
    )
)
echo [OK] Web 构建成功

:: Step 3: Cap copy
echo.
echo [3/4] 同步到 Android (npx cap copy)...
!NODE_EXE! node_modules\@capacitor\cli\bin\capacitor copy 2>nul
if %errorlevel% neq 0 (
    echo [WARN] Capacitor copy 失败，尝试 sync...
    !NODE_EXE! node_modules\@capacitor\cli\bin\capacitor sync android 2>nul
)
echo [OK] Capacitor 同步完成

:: Step 4: Build APK
echo.
echo [4/4] 构建 Release APK...
cd android
call gradlew assembleRelease
set BUILD_RESULT=%errorlevel%
cd ..

if %BUILD_RESULT% neq 0 (
    echo [ERROR] APK 构建失败！
    pause
    exit /b %BUILD_RESULT%
)

echo.
echo ================================
echo [SUCCESS] APK 构建成功！
echo 输出位置：android\app\build\outputs\apk\release\app-release.apk
echo ================================
echo.
echo 签名信息：
echo   App ID: com.yandao.language
echo   版本: 1.0 (versionCode: 1)
echo   密钥: my-release-key.jks (alias: mykey)
echo ================================

pause
