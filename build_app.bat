@echo off
setlocal

echo ================================
echo 正在构建言道学外语APP
echo ================================

set NODE_PATH="C:\Users\ZhuanZ\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\vm\tools\node\node.exe"
set NPM_PATH="C:\Users\ZhuanZ\AppData\Roaming\npm\node_modules\npm\bin\npm-cli.js"

echo.
echo 1/3: 执行 npm run build...
%NODE_PATH% %NPM_PATH% run build

if %errorlevel% neq 0 (
    echo ❌ 构建失败！
    pause
    exit /b %errorlevel%
)

echo ✅ 构建成功！

echo.
echo 2/3: 执行 npx cap copy...
%NODE_PATH% %NPM_PATH% exec cap copy

if %errorlevel% neq 0 (
    echo ❌ Capacitor复制失败！
    pause
    exit /b %errorlevel%
)

echo ✅ Capacitor复制成功！

echo.
echo 3/3: 构建APK...
cd android
call gradlew assembleRelease

if %errorlevel% neq 0 (
    echo ❌ APK构建失败！
    pause
    exit /b %errorlevel%
)

echo ✅ APK构建成功！
echo.
echo ================================
echo APK文件位置：
echo android\app\build\outputs\apk\release\app-release.apk
echo ================================

pause