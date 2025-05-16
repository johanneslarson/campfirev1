#!/bin/bash

# Create static directory structure
mkdir -p public/static/tracks
mkdir -p public/static/artists

# Copy track files from artist-metadata-tracks to public/static/tracks
cp -r artist-metadata-tracks/* public/static/tracks/

# Copy any artist images from backend/assets/artists to public/static/artists (if they exist)
if [ -d "backend/assets/artists" ]; then
  cp -r backend/assets/artists/* public/static/artists/
fi

echo "Static files setup complete!" 