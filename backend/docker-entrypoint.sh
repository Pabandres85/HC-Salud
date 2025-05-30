#!/bin/bash

# Esperar a que la base de datos esté disponible y aplicar migraciones
echo "Aplicando migraciones de base de datos..."
until dotnet Backend.dll --migrate;
do
    echo "Base de datos no disponible o error al aplicar migraciones, reintentando..."
    sleep 5
done

# Iniciar la aplicación principal
echo "Migraciones aplicadas. Iniciando la aplicación principal..."
exec dotnet Backend.dll 