#!/bin/bash

# EcoNexo Translation Key Auto-Fixer
# Este script detecta automáticamente claves de traducción faltantes y las agrega

echo "🔍 EcoNexo Translation Key Auto-Fixer"
echo "====================================="

# Función para extraer claves de traducción del código
extract_translation_keys() {
    echo "📝 Extrayendo claves de traducción del código..."
    
    # Buscar todas las llamadas a t() en el código
    grep -r "t(" src/ --include="*.tsx" --include="*.ts" | \
    grep -o 't("[^"]*")' | \
    sed 's/t("//g' | \
    sed 's/")//g' | \
    sort | uniq > /tmp/used_keys.txt
    
    echo "✅ Encontradas $(wc -l < /tmp/used_keys.txt) claves únicas en uso"
}

# Función para extraer claves existentes del diccionario
extract_existing_keys() {
    echo "📚 Extrayendo claves existentes del diccionario..."
    
    # Extraer claves del diccionario español
    grep -A 1000 "es: {" src/lib/i18n.ts | \
    grep -B 1000 "}," | \
    grep -o '^[[:space:]]*[a-zA-Z_][a-zA-Z0-9_]*:' | \
    sed 's/://g' | \
    sed 's/^[[:space:]]*//g' | \
    sort > /tmp/existing_keys.txt
    
    echo "✅ Encontradas $(wc -l < /tmp/existing_keys.txt) claves existentes"
}

# Función para encontrar claves faltantes
find_missing_keys() {
    echo "🔍 Buscando claves faltantes..."
    
    # Encontrar claves que se usan pero no existen
    comm -23 /tmp/used_keys.txt /tmp/existing_keys.txt > /tmp/missing_keys.txt
    
    local missing_count=$(wc -l < /tmp/missing_keys.txt)
    echo "⚠️  Encontradas $missing_count claves faltantes"
    
    if [ $missing_count -gt 0 ]; then
        echo ""
        echo "📋 Claves faltantes:"
        cat /tmp/missing_keys.txt | head -20
        if [ $missing_count -gt 20 ]; then
            echo "... y $((missing_count - 20)) más"
        fi
    fi
}

# Función para generar traducciones automáticas
generate_translations() {
    echo ""
    echo "🤖 Generando traducciones automáticas..."
    
    local missing_file="/tmp/missing_keys.txt"
    
    if [ ! -s "$missing_file" ]; then
        echo "✅ No hay claves faltantes que agregar"
        return
    fi
    
    echo "📝 Agregando claves faltantes al diccionario..."
    
    # Crear archivo temporal con las nuevas claves
    cat > /tmp/new_translations.ts << 'EOF'
    // Auto-generated translations - Add these to your i18n.ts file
    // Spanish (es) translations:
EOF
    
    while IFS= read -r key; do
        if [ -n "$key" ]; then
            # Generar traducción en español (puedes personalizar esta lógica)
            local spanish_translation=$(echo "$key" | sed 's/\([A-Z]\)/ \1/g' | sed 's/^ //' | sed 's/^./\U&/')
            echo "    $key: \"$spanish_translation\"," >> /tmp/new_translations.ts
        fi
    done < "$missing_file"
    
    echo ""
    echo "📄 Nuevas traducciones generadas en /tmp/new_translations.ts"
    echo "📋 Contenido:"
    echo "----------------------------------------"
    cat /tmp/new_translations.ts
    echo "----------------------------------------"
    echo ""
    echo "💡 Para aplicar automáticamente, ejecuta:"
    echo "   ./auto-fix-translations.sh --apply"
}

# Función para aplicar las traducciones automáticamente
apply_translations() {
    echo "🚀 Aplicando traducciones automáticamente..."
    
    local missing_file="/tmp/missing_keys.txt"
    
    if [ ! -s "$missing_file" ]; then
        echo "✅ No hay claves faltantes que aplicar"
        return
    fi
    
    # Crear backup del archivo original
    cp src/lib/i18n.ts src/lib/i18n.ts.backup
    echo "💾 Backup creado: src/lib/i18n.ts.backup"
    
    # Agregar las nuevas claves al diccionario español
    echo "📝 Agregando claves al diccionario español..."
    
    # Encontrar la línea donde termina el diccionario español
    local spanish_end_line=$(grep -n "}," src/lib/i18n.ts | head -1 | cut -d: -f1)
    
    # Crear archivo temporal con las nuevas claves
    local temp_file="/tmp/i18n_with_new_keys.ts"
    
    # Copiar hasta la línea anterior al cierre del diccionario español
    head -n $((spanish_end_line - 1)) src/lib/i18n.ts > "$temp_file"
    
    # Agregar las nuevas claves
    echo "    // Auto-generated translations" >> "$temp_file"
    while IFS= read -r key; do
        if [ -n "$key" ]; then
            local spanish_translation=$(echo "$key" | sed 's/\([A-Z]\)/ \1/g' | sed 's/^ //' | sed 's/^./\U&/')
            echo "    $key: \"$spanish_translation\"," >> "$temp_file"
        fi
    done < "$missing_file"
    
    # Agregar el cierre del diccionario y el resto del archivo
    echo "  }," >> "$temp_file"
    tail -n +$((spanish_end_line + 1)) src/lib/i18n.ts >> "$temp_file"
    
    # Reemplazar el archivo original
    mv "$temp_file" src/lib/i18n.ts
    
    echo "✅ Traducciones aplicadas exitosamente"
    echo "🔄 Reiniciando servidor de desarrollo..."
    
    # Reiniciar el servidor
    pkill -f "next dev" 2>/dev/null || true
    sleep 2
    npm run dev &
    
    echo "✅ Servidor reiniciado. Las advertencias de traducción deberían desaparecer."
}

# Función para limpiar archivos temporales
cleanup() {
    rm -f /tmp/used_keys.txt /tmp/existing_keys.txt /tmp/missing_keys.txt /tmp/new_translations.ts
}

# Función principal
main() {
    case "${1:-}" in
        "--apply")
            extract_translation_keys
            extract_existing_keys
            find_missing_keys
            apply_translations
            ;;
        "--clean")
            cleanup
            echo "🧹 Archivos temporales limpiados"
            ;;
        *)
            extract_translation_keys
            extract_existing_keys
            find_missing_keys
            generate_translations
            echo ""
            echo "💡 Opciones disponibles:"
            echo "   $0              - Solo mostrar claves faltantes"
            echo "   $0 --apply      - Aplicar traducciones automáticamente"
            echo "   $0 --clean      - Limpiar archivos temporales"
            ;;
    esac
}

# Ejecutar función principal
main "$@"
