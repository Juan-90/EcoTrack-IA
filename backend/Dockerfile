FROM python:3.11-slim

# Dependências para o SQLite
RUN apt-get update && apt-get install -y sqlite3 libsqlite3-dev && rm -rf /var/lib/apt/lists/*

WORKDIR /app_root

# Copia os requisitos da raiz do backend
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia todo o conteúdo da pasta backend para /app_root
COPY . .

# Cria a pasta do banco de dados onde o engine do SQLAlchemy espera
RUN mkdir -p /app_root/app/infrastructure/database && chmod 777 /app_root/app/infrastructure/database

EXPOSE 5000

# Executamos o uvicorn apontando para o módulo app.main
# O primeiro 'app' é a pasta, o segundo 'app' é o arquivo main.py
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5000"]
