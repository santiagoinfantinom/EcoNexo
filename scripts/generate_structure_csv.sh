#!/usr/bin/env bash
# Genera STRUCTURE_FULL.csv con lista de archivos, tamaño y mtime
set -euo pipefail
OUT="STRUCTURE_FULL.csv"
echo "path,size,mtime" > "$OUT"

# Excluir .git
find . -type f ! -path "./.git/*" -print0 | while IFS= read -r -d '' f; do
  # obtener tamaño y mtime (compatibilidad macOS/linux)
  size=""
  mtime=""
  if stat -f "%z" "$f" >/dev/null 2>&1; then
    size=$(stat -f "%z" "$f")
    mtime=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M:%S" "$f")
  else
    size=$(stat -c%s "$f" 2>/dev/null || echo "")
    mtime=$(stat -c %y "$f" 2>/dev/null || echo "")
  fi
  # remover prefijo ./ si existe
  path=${f#./}
  # escapar comillas
  path_esc=$(echo "$path" | sed 's/"/""/g')
  echo "\"$path_esc\",$size,\"$mtime\"" >> "$OUT"
done

echo "Generated $OUT"
