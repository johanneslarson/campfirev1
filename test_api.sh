#!/bin/bash

echo "Testing backend API..."
echo "-----------------------"

echo "Testing /api/artists endpoint..."
curl -s http://localhost:8081/api/artists > artists.json
if [ $? -eq 0 ]; then
    echo "  Success! Found $(grep -o name artists.json | wc -l) artist(s)"
    echo "  Artists: $(grep -o 'name":"[^"]*' artists.json | sed 's/name":"//')"
else
    echo "  ERROR: Failed to fetch artists"
fi

echo "Testing /api/tracks endpoint..."
curl -s http://localhost:8081/api/tracks > tracks.json
if [ $? -eq 0 ]; then
    echo "  Success! Found $(grep -o title tracks.json | wc -l) track(s)"
fi

echo "Testing /api/communities endpoint..."
curl -s http://localhost:8081/api/communities > communities.json
if [ $? -eq 0 ]; then
    echo "  Success! Found $(grep -o name communities.json | wc -l) communit(ies)"
    echo "  Communities: $(grep -o 'name":"[^"]*' communities.json | sed 's/name":"//')"
fi

echo "-----------------------"
echo "Done!" 