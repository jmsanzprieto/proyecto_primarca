from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # Importar CORSMiddleware
import json
import os

app = FastAPI()

# Configuración de CORS
# Esto permite que cualquier origen (dominio/puerto) pueda hacer solicitudes a tu API.
# En un entorno de producción, deberías ser más restrictivo y especificar los orígenes permitidos.
origins = [
    "*", # Permite cualquier origen. Útil para desarrollo.
    # "http://localhost",
    # "http://localhost:8080",
    # "https://tu-dominio.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # Lista de orígenes permitidos
    allow_credentials=True,      # Permitir el envío de credenciales (cookies, encabezados de autorización)
    allow_methods=["*"],         # Permitir todos los métodos HTTP (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],         # Permitir todos los encabezados HTTP
)
# Ruta al archivo JSON
# Asegúrate de que 'data.json' esté en el mismo directorio que este script
# o proporciona la ruta absoluta/relativa correcta.
JSON_FILE_PATH = "data/data.json"

# Variable para almacenar los datos del JSON
data = {}

# Cargar el contenido del archivo JSON al iniciar la aplicación
@app.on_event("startup")
async def load_data():
    global data
    try:
        with open(JSON_FILE_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
        print(f"Datos cargados exitosamente desde {JSON_FILE_PATH}")
    except FileNotFoundError:
        print(f"Error: El archivo '{JSON_FILE_PATH}' no se encontró.")
        # Opcional: Podrías querer lanzar una excepción o inicializar 'data' de otra forma
        data = {"primarcas": [], "eventos_importantes": [], "metadatos": {}}
    except json.JSONDecodeError:
        print(f"Error: El archivo '{JSON_FILE_PATH}' no es un JSON válido.")
        data = {"primarcas": [], "eventos_importantes": [], "metadatos": {}}


# Endpoint para obtener todos los Primarcas
@app.get("/primarcas")
async def get_primarcas():
    """
    Retorna la lista completa de Primarcas.
    """
    return data.get("primarcas", [])

# Endpoint para obtener un Primarca por su ID
@app.get("/primarcas/{primarca_id}")
async def get_primarca_by_id(primarca_id: int):
    """
    Retorna los datos de un Primarca específico por su ID.
    """
    for primarca in data.get("primarcas", []):
        if primarca.get("id") == primarca_id:
            return primarca
    return {"message": "Primarca no encontrado"}

