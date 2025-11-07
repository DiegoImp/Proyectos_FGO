"""
Módulo principal de la aplicación Flask para el visualizador de Servants de FGO.

Este módulo se encarga de:
- Iniciar la aplicación Flask.
- Cargar los datos de los servants desde una API externa o un caché local.
- Servir la página principal que muestra la lista de servants.
"""
import json
import requests
from flask import Flask, render_template
from whitenoise import WhiteNoise

# --- Constantes del Módulo ---
# Es una buena práctica definir URLs y nombres de archivo como constantes.
API_URL = "https://api.atlasacademy.io/export/JP/nice_servant_lang_en.json"
CACHE_FILENAME = "datos_servants_completos.json"
REQUEST_TIMEOUT = 1200  # Segundos

app = Flask(__name__)

# Configura WhiteNoise para servir archivos estáticos en producción.
# No afecta el modo debug, pero es crucial para el despliegue.
app.wsgi_app = WhiteNoise(app.wsgi_app, root='static/')


def _procesar_lista_servants(lista_completa):
    """
    Función auxiliar para procesar la lista de servants.
    Extrae solo los campos necesarios para la página principal.
    """
    servants_procesados = []
    for servant in lista_completa:
        # El NP está en una lista, es más seguro verificar que no esté vacía
        np_info = servant.get("noblePhantasms", [])
        np_type = np_info[0].get("card", "unknown") if np_info else "unknown"

        # Usar .get() anidado es más seguro que accesos directos con []
        ascension_faces = servant.get("extraAssets", {}).get(
            "faces", {}).get("ascension", {})
        # Intenta obtener la cara de la ascensión 1, si no existe, intenta con la 0.
        face_url = ascension_faces.get("1") or ascension_faces.get("0")

        norm_class = servant.get("className", "unknown").lower()
        # 4. Comprueba si empieza con "beast"
        if norm_class.startswith(("beast", "uolga", "unbeast")):
            norm_class = "beast"
        if norm_class.startswith("lore"):
            norm_class = "caster"
        servant_data = {
            "collectionNo": servant.get("collectionNo"),
            "name": servant.get("name"),
            "className": norm_class,
            "rarity": servant.get("rarity"),
            "face": face_url,
            "npType": np_type
        }
        servants_procesados.append(servant_data)
    return servants_procesados


def cargar_datos_servants():
    """
    Carga los datos de los servants desde un caché local o la API.
    """
    try:
        with open(CACHE_FILENAME, 'r', encoding='utf-8') as f:
            print(f"Cargando datos desde el caché local '{CACHE_FILENAME}'...")
            # CORRECCIÓN: Usar json.load() para leer el archivo entero.
            datos_completos = json.load(f)
            return datos_completos
    except FileNotFoundError:
        print(
            f"Archivo '{CACHE_FILENAME}' no encontrado. Descargando desde la API...")
        try:
            respuesta = requests.get(API_URL, timeout=REQUEST_TIMEOUT)
            respuesta.raise_for_status()  # Lanza un error si el código no es 200
            datos_completos = respuesta.json()

            with open(CACHE_FILENAME, 'w', encoding='utf-8') as f:
                json.dump(datos_completos, f, ensure_ascii=False, indent=4)
            print(f"Datos guardados en '{CACHE_FILENAME}' para uso futuro.")
            return datos_completos
        except requests.exceptions.RequestException as e:
            print(
                f"ERROR: No se pudo conectar a la API para descargar los datos. {e}")
            return []  # Devuelve una lista vacía si hay un error
    except json.JSONDecodeError:
        print(
            f"ERROR: El archivo '{CACHE_FILENAME}' está corrupto o mal formateado.")
        return []


# --- Cargar datos una sola vez al iniciar la app ---
# NOTA: Ahora cargamos los datos completos y los procesamos después.
# Esto es más flexible si en el futuro necesitas más datos en la plantilla.
TODOS_LOS_SERVANTS = cargar_datos_servants()


@app.route('/')
def pagina_principal():
    """
    Renderiza la página principal con la lista de todos los servants.
    """
    # Procesamos los datos justo antes de enviarlos a la plantilla.
    servants_para_template = _procesar_lista_servants(TODOS_LOS_SERVANTS)
    return render_template('index.html', servants_main_page=servants_para_template)

# --- AÑADIMOS LA NUEVA RUTA ---


@app.route('/calculadora')
def pagina_calculadora():
    """
    Renderiza la página de la calculadora.
    """
    # CAMBIO 2: Pasamos la variable 'page' también aquí.
    return render_template('calculadora.html', page='calculadora')
# --- FIN DE LA NUEVA RUTA ---


if __name__ == '__main__':
    app.run(debug=True)
