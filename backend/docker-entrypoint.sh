#!/bin/bash

set -e

# Esperar a que la base de datos esté disponible
echo "Esperando a que la base de datos esté disponible..."

# Usar herramientas de PostgreSQL en lugar de SQL Server
until nc -z db 5432; do
    echo "Base de datos no disponible, reintentando en 5 segundos..."
    sleep 5
done
echo "Base de datos disponible."

# Aplicar migraciones usando la aplicación
echo "Aplicando migraciones de base de datos usando la aplicación..."
until dotnet Backend.dll --migrate;
do
    echo "Error al aplicar migraciones con la aplicación, reintentando en 5 segundos..."
    sleep 5
done
echo "Migraciones aplicadas."

# Iniciar la aplicación principal
echo "Iniciando la aplicación principal..."
exec dotnet Backend.dll