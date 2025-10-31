import json
import requests
from flask import Flask, render_template, jsonify
from whitenoise import WhiteNoise

app = Flask(__name__)
app.wsgi_app = WhiteNoise(app.wsgi_app)
# --- Cargar datos una sola vez al iniciar la app ---


def cargar_datos_servants():
    """
    Carga los datos de los servants.
    Primero intenta leerlos de un archivo local 'datos_servants.json'.
    Si no existe, los descarga de la API, los guarda localmente y luego los devuelve.
    """
    nombre_archivo = "datos_servants_basic.json"
    try:
        with open(nombre_archivo, 'r', encoding='utf-8') as f:
            print(
                f"Cargando datos desde el archivo local '{nombre_archivo}'...")
            return json.load(f)
    except FileNotFoundError:
        print(
            f"Archivo '{nombre_archivo}' no encontrado. Descargando desde la API...")
        url_basic = "https://api.atlasacademy.io/export/NA/basic_servant.json"
        try:
            respuesta = requests.get(url_basic)
            respuesta.raise_for_status()  # Error si el código no es 200
            datos = respuesta.json()

            with open(nombre_archivo, 'w', encoding='utf-8') as f:
                json.dump(datos, f, ensure_ascii=False, indent=4)
            print(f"Datos guardados en '{nombre_archivo}' para uso futuro.")
            return datos
        except requests.exceptions.RequestException as e:
            print(
                f"ERROR: No se pudo conectar a la API para descargar los datos. {e}")
            return []  # Devuelve una lista vacía si hay un error


TODOS_LOS_SERVANTS = cargar_datos_servants()


@app.route('/')
def pagina_principal():
    # ¡Y listo! Le pasamos la lista COMPLETA directamente.
    # El HTML se encargará de buscar las llaves que necesita.
    return render_template('index.html', servants_main_page=TODOS_LOS_SERVANTS)


if __name__ == '__main__':
    app.run(debug=True)
