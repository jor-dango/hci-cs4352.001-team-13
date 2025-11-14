#!/bin/bash
# Script to clear all uploaded files and metadata

echo "🗑️  Clearing all uploaded files and metadata..."

# Remove all files in uploads directory (keep the directory)
rm -f uploads/*

# Remove metadata file
rm -f metadata.json

echo "✅ All test data cleared!"
echo ""
echo "Files in uploads/:"
ls -la uploads/ || echo "  (empty)"
echo ""
echo "Metadata file:"
ls -la metadata.json 2>/dev/null || echo "  (not found)"
