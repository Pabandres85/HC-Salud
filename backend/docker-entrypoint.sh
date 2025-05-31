#!/bin/bash

set -e

# Esperar a que la base de datos esté disponible
echo "Esperando a que la base de datos esté disponible..."
/opt/mssql-tools/bin/sqlcmd -S db -U sa -P $SA_PASSWORD -Q "SELECT 1" || \
while [ $? -ne 0 ]
do
    echo "Base de datos no disponible, reintentando en 5 segundos..."
    sleep 5
    /opt/mssql-tools/bin/sqlcmd -S db -U sa -P $SA_PASSWORD -Q "SELECT 1" || true
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