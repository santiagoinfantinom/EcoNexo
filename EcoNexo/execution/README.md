# Execution

This directory contains **deterministic Python scripts** that perform the actual work.

## Principios
- **Atomicidad**: Cada script debe hacer una cosa bien.
- **Determinismo**: Misma entrada -> Misma salida.
- **Sin Alucinaciones**: No usar LLMs para lógica de negocio crítica aquí dentro si es posible.
- **Input/Output**: Usar argumentos de línea de comandos o archivos en `.tmp/`.

See `../AGENTS.md` for more details on the 3-Layer Architecture.
