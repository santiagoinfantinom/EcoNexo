# EcoNexo Makefile

# Usage:
#   make supabase-link PROJECT_REF=abcd1234
#   make supabase-apply
#   make supabase-rollback

SUPABASE?=supabase

supabase-link:
	$(SUPABASE) link --project-ref $(PROJECT_REF)

supabase-apply:
	$(SUPABASE) db push --yes

supabase-rollback:
	@echo "Rollback por CLI no soporta archivos arbitrarios en esta versión."
	@echo "Abre supabase/rollback.sql en el SQL Editor y ejecútalo para revertir los datos demo."

supabase-repair:
	$(SUPABASE) migration repair --status reverted $(VERSION)

supabase-pull:
	$(SUPABASE) db pull
