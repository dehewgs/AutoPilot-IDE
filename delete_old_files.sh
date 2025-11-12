#!/bin/bash
# Script to delete old/unused files from AutoPilot-IDE repository
# Run this script from the repository root directory

echo "=========================================="
echo "AutoPilot-IDE Cleanup Script"
echo "=========================================="
echo ""
echo "This script will delete 7 old/unused files (~170KB)"
echo ""

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "Error: Not in a git repository!"
    echo "Please run this script from the AutoPilot-IDE root directory"
    exit 1
fi

# Check if we're on the test branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "test" ]; then
    echo "Warning: You're on branch '$CURRENT_BRANCH', not 'test'"
    read -p "Do you want to switch to 'test' branch? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git checkout test
    else
        echo "Aborted."
        exit 1
    fi
fi

echo "Files to be deleted:"
echo "  1. index-hybrid.html (21KB)"
echo "  2. index-modular.html (21KB)"
echo "  3. index-old-wrong.html (21KB)"
echo "  4. index-old.html (73KB)"
echo "  5. CODEBASE_ANALYSIS.md (11KB)"
echo "  6. CURRENT_STATUS.md (10KB)"
echo "  7. PROJECT_SUMMARY.txt (13KB)"
echo ""

read -p "Do you want to proceed with deletion? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
fi

echo ""
echo "Deleting files..."

# Delete old HTML files
git rm index-hybrid.html 2>/dev/null && echo "✓ Deleted index-hybrid.html" || echo "✗ index-hybrid.html not found"
git rm index-modular.html 2>/dev/null && echo "✓ Deleted index-modular.html" || echo "✗ index-modular.html not found"
git rm index-old-wrong.html 2>/dev/null && echo "✓ Deleted index-old-wrong.html" || echo "✗ index-old-wrong.html not found"
git rm index-old.html 2>/dev/null && echo "✓ Deleted index-old.html" || echo "✗ index-old.html not found"

# Delete outdated documentation
git rm CODEBASE_ANALYSIS.md 2>/dev/null && echo "✓ Deleted CODEBASE_ANALYSIS.md" || echo "✗ CODEBASE_ANALYSIS.md not found"
git rm CURRENT_STATUS.md 2>/dev/null && echo "✓ Deleted CURRENT_STATUS.md" || echo "✗ CURRENT_STATUS.md not found"
git rm PROJECT_SUMMARY.txt 2>/dev/null && echo "✓ Deleted PROJECT_SUMMARY.txt" || echo "✗ PROJECT_SUMMARY.txt not found"

# Delete the cleanup plan (no longer needed after cleanup)
git rm CLEANUP_PLAN.md 2>/dev/null && echo "✓ Deleted CLEANUP_PLAN.md" || echo "✗ CLEANUP_PLAN.md not found"

# Delete this script itself
git rm delete_old_files.sh 2>/dev/null && echo "✓ Deleted delete_old_files.sh" || echo "✗ delete_old_files.sh not found"

echo ""
echo "Committing changes..."
git commit -m "chore: remove old/unused files (7 files, ~170KB)

Removed:
- index-hybrid.html (old hybrid version)
- index-modular.html (old modular version)
- index-old-wrong.html (duplicate file)
- index-old.html (very old monolithic version)
- CODEBASE_ANALYSIS.md (outdated analysis)
- CURRENT_STATUS.md (outdated status)
- PROJECT_SUMMARY.txt (outdated summary)
- CLEANUP_PLAN.md (cleanup documentation)
- delete_old_files.sh (this cleanup script)

All outdated files removed. Repository now contains only active, functional files."

echo ""
echo "=========================================="
echo "Cleanup Complete!"
echo "=========================================="
echo ""
echo "Changes have been committed locally."
echo "To push to remote, run:"
echo "  git push origin test"
echo ""
