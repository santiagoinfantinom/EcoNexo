# EcoNexo Makefile

# Usage:
#   make supabase-link PROJECT_REF=abcd1234
#   make supabase-apply
#   make supabase-rollback

SUPABASE?=supabase

supabase-link:
	$(SUPABASE) link --project-ref $(PROJECT_REF)

supabase-apply:
	$(SUPABASE) db execute --file supabase/schema.sql

supabase-rollback:
	$(SUPABASE) db execute --file supabase/rollback.sql
