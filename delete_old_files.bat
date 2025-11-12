@echo off
REM Script to delete old/unused files from AutoPilot-IDE repository
REM Run this script from the repository root directory

echo ==========================================
echo AutoPilot-IDE Cleanup Script (Windows)
echo ==========================================
echo.
echo This script will delete 7 old/unused files (~170KB)
echo.

REM Check if we're in a git repository
if not exist ".git" (
    echo Error: Not in a git repository!
    echo Please run this script from the AutoPilot-IDE root directory
    pause
    exit /b 1
)

echo Files to be deleted:
echo   1. index-hybrid.html (21KB)
echo   2. index-modular.html (21KB)
echo   3. index-old-wrong.html (21KB)
echo   4. index-old.html (73KB)
echo   5. CODEBASE_ANALYSIS.md (11KB)
echo   6. CURRENT_STATUS.md (10KB)
echo   7. PROJECT_SUMMARY.txt (13KB)
echo.

set /p CONFIRM="Do you want to proceed with deletion? (Y/N): "
if /i not "%CONFIRM%"=="Y" (
    echo Aborted.
    pause
    exit /b 1
)

echo.
echo Deleting files...

REM Delete old HTML files
git rm index-hybrid.html 2>nul && echo [OK] Deleted index-hybrid.html || echo [SKIP] index-hybrid.html not found
git rm index-modular.html 2>nul && echo [OK] Deleted index-modular.html || echo [SKIP] index-modular.html not found
git rm index-old-wrong.html 2>nul && echo [OK] Deleted index-old-wrong.html || echo [SKIP] index-old-wrong.html not found
git rm index-old.html 2>nul && echo [OK] Deleted index-old.html || echo [SKIP] index-old.html not found

REM Delete outdated documentation
git rm CODEBASE_ANALYSIS.md 2>nul && echo [OK] Deleted CODEBASE_ANALYSIS.md || echo [SKIP] CODEBASE_ANALYSIS.md not found
git rm CURRENT_STATUS.md 2>nul && echo [OK] Deleted CURRENT_STATUS.md || echo [SKIP] CURRENT_STATUS.md not found
git rm PROJECT_SUMMARY.txt 2>nul && echo [OK] Deleted PROJECT_SUMMARY.txt || echo [SKIP] PROJECT_SUMMARY.txt not found

REM Delete cleanup documentation
git rm CLEANUP_PLAN.md 2>nul && echo [OK] Deleted CLEANUP_PLAN.md || echo [SKIP] CLEANUP_PLAN.md not found

REM Delete cleanup scripts
git rm delete_old_files.sh 2>nul && echo [OK] Deleted delete_old_files.sh || echo [SKIP] delete_old_files.sh not found
git rm delete_old_files.bat 2>nul && echo [OK] Deleted delete_old_files.bat || echo [SKIP] delete_old_files.bat not found

echo.
echo Committing changes...
git commit -m "chore: remove old/unused files (7 files, ~170KB)" -m "Removed:" -m "- index-hybrid.html (old hybrid version)" -m "- index-modular.html (old modular version)" -m "- index-old-wrong.html (duplicate file)" -m "- index-old.html (very old monolithic version)" -m "- CODEBASE_ANALYSIS.md (outdated analysis)" -m "- CURRENT_STATUS.md (outdated status)" -m "- PROJECT_SUMMARY.txt (outdated summary)" -m "- CLEANUP_PLAN.md (cleanup documentation)" -m "- delete_old_files.sh (cleanup script)" -m "- delete_old_files.bat (this cleanup script)" -m "" -m "All outdated files removed. Repository now contains only active, functional files."

echo.
echo ==========================================
echo Cleanup Complete!
echo ==========================================
echo.
echo Changes have been committed locally.
echo To push to remote, run:
echo   git push origin test
echo.
pause
