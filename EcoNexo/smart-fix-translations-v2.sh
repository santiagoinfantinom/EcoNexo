#!/bin/bash

# EcoNexo Smart Translation Key Auto-Fixer v2
# Este script detecta automáticamente claves de traducción faltantes y las agrega con traducciones inteligentes
# Versión mejorada que filtra claves inválidas

echo "🧠 EcoNexo Smart Translation Key Auto-Fixer v2"
echo "=============================================="

# Función para validar si una clave es válida como identificador JavaScript
is_valid_key() {
    local key="$1"
    
    # Verificar que la clave no esté vacía
    if [ -z "$key" ]; then
        return 1
    fi
    
    # Verificar que no contenga caracteres especiales problemáticos
    if [[ "$key" =~ [^a-zA-Z0-9_] ]]; then
        return 1
    fi
    
    # Verificar que no empiece con número
    if [[ "$key" =~ ^[0-9] ]]; then
        return 1
    fi
    
    return 0
}

# Función para generar traducciones inteligentes
smart_translate() {
    local key="$1"
    
    # Diccionario de traducciones específicas
    case "$key" in
        "createEvent") echo "Crear Evento" ;;
        "ecoTips") echo "Consejos Ecológicos" ;;
        "ecoTipCategoryFinance") echo "Finanzas" ;;
        "ecoTipBankTitle") echo "Banco Verde" ;;
        "ecoTipBankDescription") echo "Elige bancos que invierten en proyectos sostenibles" ;;
        "ecoTipCategoryTransport") echo "Transporte" ;;
        "ecoTipTransportTitle") echo "Transporte Sostenible" ;;
        "ecoTipTransportDescription") echo "Usa transporte público, bicicleta o camina" ;;
        "ecoTipCategoryFood") echo "Alimentación" ;;
        "ecoTipVegetarianTitle") echo "Dieta Vegetariana" ;;
        "ecoTipVegetarianDescription") echo "Reduce el consumo de carne para ayudar al planeta" ;;
        "ecoTipCategoryEnergy") echo "Energía" ;;
        "ecoTipEnergyTitle") echo "Ahorro Energético" ;;
        "ecoTipEnergyDescription") echo "Usa electrodomésticos eficientes y energía renovable" ;;
        "ecoTipCategoryWaste") echo "Residuos" ;;
        "ecoTipWasteTitle") echo "Reducir Residuos" ;;
        "ecoTipWasteDescription") echo "Reduce, reutiliza y recicla" ;;
        "ecoTipCategoryWater") echo "Agua" ;;
        "ecoTipWaterTitle") echo "Ahorro de Agua" ;;
        "ecoTipWaterDescription") echo "Usa agua de manera responsable" ;;
        "urbanReforestationBerlin") echo "Reforestación Urbana Berlín" ;;
        "urbanReforestationDesc") echo "Plantamos árboles en espacios urbanos para mejorar la calidad del aire" ;;
        "treesPlanted") echo "árboles plantados" ;;
        "seineRiverCleanup") echo "Limpieza del Sena" ;;
        "seineRiverCleanupDesc") echo "Limpiamos el río Sena para proteger la vida acuática" ;;
        "wasteCollected") echo "residuos recolectados" ;;
        "communityGardensMadrid") echo "Jardines Comunitarios Madrid" ;;
        "communityGardensDesc") echo "Creamos jardines comunitarios para promover la agricultura urbana" ;;
        "communityGardensActive") echo "jardines comunitarios activos" ;;
        "address") echo "Dirección" ;;
        "addressPh") echo "Ingresa tu dirección" ;;
        "all") echo "Todos" ;;
        "anyDistance") echo "Cualquier distancia" ;;
        "applicationDeadline") echo "Fecha límite de aplicación" ;;
        "applicationSent") echo "Aplicación enviada" ;;
        "apply") echo "Aplicar" ;;
        "applyBtn") echo "Aplicar" ;;
        "applyForJob") echo "Aplicar al trabajo" ;;
        "availability") echo "Disponibilidad" ;;
        "availabilityPh") echo "Tu disponibilidad" ;;
        "backToMap") echo "Volver al mapa" ;;
        "backToProject") echo "Volver al proyecto" ;;
        "beVolunteer") echo "Ser voluntario" ;;
        "benefitsPlaceholder") echo "Beneficios del trabajo" ;;
        "calendar") echo "Calendario" ;;
        "capacity") echo "Capacidad" ;;
        "capacityPh") echo "Capacidad del evento" ;;
        "categories") echo "Categorías" ;;
        "category") echo "Categoría" ;;
        "centerOnLocation") echo "Centrar en ubicación" ;;
        "chatRule1") echo "Respeta a todos los participantes" ;;
        "chatRule2") echo "Mantén las conversaciones relevantes" ;;
        "chatRule3") echo "No compartas información personal" ;;
        "chatRule4") echo "Usa un lenguaje apropiado" ;;
        "chatRule5") echo "No hagas spam" ;;
        "chatRule6") echo "Sé constructivo en tus comentarios" ;;
        "chatRule7") echo "Reporta contenido inapropiado" ;;
        "chatRule8") echo "Disfruta y aprende" ;;
        "chatRules") echo "Reglas del Chat" ;;
        "chatRulesFooter") echo "Siguiendo estas reglas creamos una comunidad positiva" ;;
        "chatRulesIntro") echo "Para mantener un ambiente positivo, por favor sigue estas reglas:" ;;
        "chatRulesTitle") echo "Reglas de la Comunidad" ;;
        "chats") echo "Chats" ;;
        "cityLabel") echo "Ciudad" ;;
        "cityPh") echo "Selecciona tu ciudad" ;;
        "clearFilters") echo "Limpiar filtros" ;;
        "clickToUpload") echo "Haz clic para subir" ;;
        "communityChat") echo "Chat Comunitario" ;;
        "companyName") echo "Nombre de la empresa" ;;
        "companyNamePlaceholder") echo "Nombre de tu empresa" ;;
        "conductGuidelines") echo "Pautas de Conducta" ;;
        "conductGuidelinesText") echo "Mantén un ambiente respetuoso y constructivo" ;;
        "contactEmail") echo "Email de contacto" ;;
        "contactEmailPlaceholder") echo "email@empresa.com" ;;
        "contractLabel") echo "Tipo de contrato" ;;
        "contract_contract") echo "Contrato" ;;
        "contract_full_time") echo "Tiempo completo" ;;
        "contract_internship") echo "Prácticas" ;;
        "contract_part_time") echo "Medio tiempo" ;;
        "countryPh") echo "Selecciona tu país" ;;
        "createJobOffer") echo "Crear Oferta de Trabajo" ;;
        "createdEvent") echo "Evento creado" ;;
        "currentTopic") echo "Tema actual" ;;
        "cvLink") echo "Enlace al CV" ;;
        "description") echo "Descripción" ;;
        "discoverLatestInitiatives") echo "Descubre las últimas iniciativas" ;;
        "donatePaypal") echo "Donar con PayPal" ;;
        "donateStripe") echo "Donar con Stripe" ;;
        "easy") echo "Fácil" ;;
        "ecoTipsDescription") echo "Consejos prácticos para vivir de manera más sostenible" ;;
        "eventsNearYou") echo "Eventos cerca de ti" ;;
        "existingEvents") echo "Eventos existentes" ;;
        "experienceEntry") echo "Nivel inicial" ;;
        "experienceExpert") echo "Experto" ;;
        "experienceLevel") echo "Nivel de experiencia" ;;
        "experienceMid") echo "Intermedio" ;;
        "experienceSenior") echo "Senior" ;;
        "expertiseAreas") echo "Áreas de experiencia" ;;
        "expertiseAreasPlaceholder") echo "Tus áreas de experiencia" ;;
        "filters") echo "Filtros" ;;
        "findLocalEvents") echo "Encuentra eventos locales" ;;
        "goal") echo "Objetivo" ;;
        "hard") echo "Difícil" ;;
        "highImpact") echo "Alto impacto" ;;
        "id") echo "ID" ;;
        "image") echo "Imagen" ;;
        "impact") echo "Impacto" ;;
        "jobCreated") echo "Trabajo creado" ;;
        "jobDescription") echo "Descripción del trabajo" ;;
        "jobDescriptionPlaceholder") echo "Describe las responsabilidades del puesto" ;;
        "jobLocation") echo "Ubicación del trabajo" ;;
        "jobLocationPlaceholder") echo "¿Dónde está ubicado el trabajo?" ;;
        "jobPostingConditions") echo "Condiciones de publicación" ;;
        "jobPostingInfo") echo "Información de publicación" ;;
        "jobTitle") echo "Título del trabajo" ;;
        "jobTitlePlaceholder") echo "Título del puesto" ;;
        "jobType") echo "Tipo de trabajo" ;;
        "jobTypeContract") echo "Por contrato" ;;
        "jobTypeFullTime") echo "Tiempo completo" ;;
        "jobTypeHybrid") echo "Híbrido" ;;
        "jobTypeInternship") echo "Prácticas" ;;
        "jobTypePartTime") echo "Medio tiempo" ;;
        "jobTypeRemote") echo "Remoto" ;;
        "join") echo "Unirse" ;;
        "joinActiveConversations") echo "Únete a conversaciones activas" ;;
        "list") echo "Lista" ;;
        "localRecords") echo "Registros locales" ;;
        "lowImpact") echo "Bajo impacto" ;;
        "mainCategory") echo "Categoría principal" ;;
        "maxDistance") echo "Distancia máxima" ;;
        "medium") echo "Medio" ;;
        "mediumImpact") echo "Medio impacto" ;;
        "minExperience") echo "Experiencia mínima" ;;
        "minSalary") echo "Salario mínimo" ;;
        "month") echo "mes" ;;
        "motivationLetter") echo "Carta de motivación" ;;
        "motivations") echo "Motivaciones" ;;
        "motivationsPlaceholder") echo "¿Por qué quieres este trabajo?" ;;
        "name") echo "Nombre" ;;
        "newProjects") echo "Nuevos proyectos" ;;
        "noParticipatedEvents") echo "No has participado en eventos" ;;
        "noVolunteersYet") echo "Aún no hay voluntarios" ;;
        "notes") echo "Notas" ;;
        "notesPh") echo "Notas adicionales" ;;
        "onlineUsers") echo "Usuarios en línea" ;;
        "onlyAvailableSpots") echo "Solo cupos disponibles" ;;
        "onlyPdfFiles") echo "Solo archivos PDF" ;;
        "optional") echo "Opcional" ;;
        "optionalCategories") echo "Categorías opcionales" ;;
        "orContinueWith") echo "O continuar con" ;;
        "pdfOnly") echo "Solo PDF" ;;
        "popularDiscussions") echo "Discusiones populares" ;;
        "progressReached") echo "Progreso alcanzado" ;;
        "publishJob") echo "Publicar trabajo" ;;
        "raised") echo "recaudado" ;;
        "reached") echo "alcanzado" ;;
        "recommendations") echo "Recomendaciones" ;;
        "remoteOnly") echo "Solo remoto" ;;
        "removeFile") echo "Eliminar archivo" ;;
        "required") echo "Requerido" ;;
        "requiredSkills") echo "Habilidades requeridas" ;;
        "requiredSkillsPlaceholder") echo "Habilidades necesarias para el puesto" ;;
        "results") echo "Resultados" ;;
        "salaryRange") echo "Rango salarial" ;;
        "salaryRangePlaceholder") echo "Rango de salario ofrecido" ;;
        "satellite") echo "Satélite" ;;
        "save") echo "Guardar" ;;
        "saveBtn") echo "Guardar" ;;
        "saveDraft") echo "Guardar borrador" ;;
        "saved") echo "Guardado" ;;
        "search") echo "Buscar" ;;
        "searchProjects") echo "Buscar proyectos" ;;
        "send") echo "Enviar" ;;
        "sendApplication") echo "Enviar aplicación" ;;
        "sendLoginLink") echo "Enviar enlace de inicio de sesión" ;;
        "sendMessage") echo "Enviar mensaje" ;;
        "sendVerificationLink") echo "Enviar enlace de verificación" ;;
        "terrain") echo "Terreno" ;;
        "title") echo "Título" ;;
        "titlePh") echo "Título del evento" ;;
        "topicForums") echo "Foros por tema" ;;
        "typeMessage") echo "Escribe un mensaje" ;;
        "user") echo "Usuario" ;;
        "viewDetails") echo "Ver detalles" ;;
        "viewEvent") echo "Ver evento" ;;
        "volunteersPageTitle") echo "Página de Voluntarios" ;;
        "yearsExp") echo "años de experiencia" ;;
        "yourEmail") echo "Tu email" ;;
        "yourName") echo "Tu nombre" ;;
        *)
            # Traducción automática para claves no específicas
            echo "$key" | sed 's/\([A-Z]\)/ \1/g' | sed 's/^ //' | sed 's/^./\U&/' | sed 's/Ph$/ (placeholder)/' | sed 's/Btn$/ (botón)/'
            ;;
    esac
}

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

# Función para encontrar claves faltantes válidas
find_missing_keys() {
    echo "🔍 Buscando claves faltantes válidas..."
    
    # Encontrar claves que se usan pero no existen
    comm -23 /tmp/used_keys.txt /tmp/existing_keys.txt > /tmp/all_missing_keys.txt
    
    # Filtrar solo las claves válidas
    > /tmp/missing_keys.txt
    while IFS= read -r key; do
        if is_valid_key "$key"; then
            echo "$key" >> /tmp/missing_keys.txt
        fi
    done < /tmp/all_missing_keys.txt
    
    local all_missing=$(wc -l < /tmp/all_missing_keys.txt)
    local valid_missing=$(wc -l < /tmp/missing_keys.txt)
    local invalid_missing=$((all_missing - valid_missing))
    
    echo "⚠️  Encontradas $all_missing claves faltantes totales"
    echo "✅ De las cuales $valid_missing son válidas para agregar"
    if [ $invalid_missing -gt 0 ]; then
        echo "❌ Y $invalid_missing son inválidas (ignoradas)"
    fi
    
    if [ $valid_missing -gt 0 ]; then
        echo ""
        echo "📋 Primeras 20 claves válidas faltantes:"
        head -20 /tmp/missing_keys.txt
        if [ $valid_missing -gt 20 ]; then
            echo "... y $((valid_missing - 20)) más"
        fi
    fi
}

# Función para aplicar las traducciones automáticamente
apply_translations() {
    echo "🚀 Aplicando traducciones inteligentes..."
    
    local missing_file="/tmp/missing_keys.txt"
    
    if [ ! -s "$missing_file" ]; then
        echo "✅ No hay claves válidas faltantes que aplicar"
        return
    fi
    
    # Crear backup del archivo original
    cp src/lib/i18n.ts src/lib/i18n.ts.backup
    echo "💾 Backup creado: src/lib/i18n.ts.backup"
    
    # Encontrar la línea donde termina el diccionario español
    local spanish_end_line=$(grep -n "}," src/lib/i18n.ts | head -1 | cut -d: -f1)
    
    # Crear archivo temporal con las nuevas claves
    local temp_file="/tmp/i18n_with_new_keys.ts"
    
    # Copiar hasta la línea anterior al cierre del diccionario español
    head -n $((spanish_end_line - 1)) src/lib/i18n.ts > "$temp_file"
    
    # Agregar las nuevas claves con traducciones inteligentes
    echo "    // Traducciones automáticas generadas $(date)" >> "$temp_file"
    while IFS= read -r key; do
        if [ -n "$key" ]; then
            local translation=$(smart_translate "$key")
            echo "    $key: \"$translation\"," >> "$temp_file"
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
    rm -f /tmp/used_keys.txt /tmp/existing_keys.txt /tmp/missing_keys.txt /tmp/all_missing_keys.txt
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
