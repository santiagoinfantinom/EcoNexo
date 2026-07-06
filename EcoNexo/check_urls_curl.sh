#!/bin/bash
grep -o "https://images.unsplash.com[^\"]*" src/data/events-2026-real.ts | sort | uniq > urls.txt
while read url; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  if [ "$status" != "200" ]; then
    echo "BROKEN ($status): $url"
  fi
done < urls.txt
