#!/bin/bash

# Iniciar la aplicación
echo "Iniciando la aplicación..."

# Agregar un pequeño retardo para asegurar que la BD esté completamente lista
echo "Esperando 5 segundos para asegurar que la BD esté lista..."
sleep 5

exec dotnet Backend.dll 