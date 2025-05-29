# Imagen base de Python
FROM python:3.10-slim

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos del servicio
COPY . .

# Instalar dependencias necesarias
RUN pip install --no-cache-dir flask

# Exponer el puerto
EXPOSE 7000

# Comando para ejecutar el servidor Flask
CMD ["python", "app.py"]
