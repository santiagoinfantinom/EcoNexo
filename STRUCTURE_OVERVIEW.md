# Estructura y uso del CSV

Este archivo describe `STRUCTURE_FULL.csv` (listado completo de archivos) y da instrucciones rápidas para consultarlo.

- Archivo CSV generado: `STRUCTURE_FULL.csv` (en la raíz del repo).
- Columnas: `path`, `size` (bytes), `mtime` (modification time).

Cómo abrirlo rápidamente:
- En macOS: doble clic en el archivo para abrir en Numbers o Excel.
- Desde terminal: usar `csvtool`, `csvkit` o `awk`/`cut`.

Comandos útiles:
```bash
# ver los 20 archivos más grandes
sort -t, -k2 -nr STRUCTURE_FULL.csv | head -n 20

# contar archivos por extensión
cut -d, -f1 STRUCTURE_FULL.csv | sed 's/.*\.//' | sort | uniq -c | sort -nr | head -n 50
```

Si quieres, puedo:
- Generar `STRUCTURE_FULL.md` con el árbol literal (texto largo).
- Subir `STRUCTURE_FULL.csv` a Google Drive/Notion o convertirlo a XLSX.

