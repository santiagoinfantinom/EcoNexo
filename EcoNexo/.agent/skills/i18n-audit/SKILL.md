---
name: i18n-audit
description: Scans codebase for hardcoded text and verifies translation key consistency across all languages (EN, ES, DE, FR, IT, PL, NL). Use before releases, when adding translations, or auditing internationalization coverage.
---

# i18n Audit

Automated internationalization auditing for EcoNexo.

## When to Use

- Before releases to ensure translation completeness
- After adding new UI text to find missing translations
- Auditing translation coverage across languages
- Finding hardcoded strings that should be translated

## Supported Languages

EcoNexo supports: `en`, `es`, `de`, `fr`, `it`, `pl`, `nl`

## Workflow

1. **Find hardcoded strings** - Run `scripts/find_hardcoded.py`
2. **Check key consistency** - Run `scripts/check_keys.py`
3. **Generate report** - Review output and fix issues
4. **Update translations** - Add missing keys to `src/lib/i18n.ts`

## Scripts

- `scripts/find_hardcoded.py` - Finds potential hardcoded strings in TSX/JSX
- `scripts/check_keys.py` - Verifies all locales have the same keys

## Patterns to Detect

### Hardcoded Strings (Bad)
```tsx
<h1>Welcome to EcoNexo</h1>
<button>Submit</button>
```

### Translated Strings (Good)
```tsx
<h1>{t('welcome')}</h1>
<button>{t('submit')}</button>
```

## i18n File Structure

The i18n configuration is in `src/lib/i18n.ts`:

```typescript
const translations = {
  en: {
    welcome: "Welcome to EcoNexo",
    submit: "Submit",
    // ...
  },
  es: {
    welcome: "Bienvenido a EcoNexo",
    submit: "Enviar",
    // ...
  },
  // ... other languages
}
```

## Common Issues

1. **Missing keys** - Key exists in `en` but not in `es`
2. **Hardcoded text** - Literal strings instead of `t()` calls
3. **Untranslated placeholders** - `TODO` or empty strings
4. **Inconsistent formatting** - Different placeholder styles
