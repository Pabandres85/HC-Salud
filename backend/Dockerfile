# ==========================================
# BACKEND Dockerfile optimizado
# ==========================================

# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# CRÍTICO: Copiar solo .csproj primero para cache de dependencias
COPY Backend.csproj .

# Restaurar dependencias (se cachea si .csproj no cambia)
RUN dotnet restore

# Copiar todo el código fuente
COPY . .

# Build
RUN dotnet build -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish -c Release -o /app/publish --no-restore

# Runtime stage  
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final

# ⬇️ AGREGAR ESTA LÍNEA AQUÍ ⬇️
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar solo los archivos publicados (NO duplicar)
COPY --from=publish /app/publish .

# Copiar script de entrada
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

EXPOSE 5000
ENTRYPOINT ["/docker-entrypoint.sh"]


