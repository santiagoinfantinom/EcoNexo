#!/bin/bash
grep -o "https://images.unsplash.com[^\"]*" src/data/events-2026-real.ts | sort | uniq > urls_to_check.txt
while read url; do
  status=$(curl -s -o /dev/null -I -w "%{http_code}" "$url")
  if [ "$status" == "404" ]; then
    echo "Found 404: $url, replacing..."
    # Using perl to inplace replace the specific URL with the working environment placeholder
    perl -pi -e "s|\Q$url\E|https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop|g" src/data/events-2026-real.ts
  fi
done < urls_to_check.txt
echo "Done checking all images."
