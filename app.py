import json
import requests
from flask import Flask, render_template, jsonify


app = Flask(__name__)

# --- Cargar datos una sola vez al iniciar la app ---

# 1 (saber)
# 2 (archer)
# 3 (lancer)
# 4 (rider)
# 5 (caster)
# 6 (assassin)
# 7 (berserker)
# 8 (shielder)
# 9 (ruler)
# 10 (alterEgo)
# 11 (avenger)
# 17 (loreGrandCaster)
# 20 (beastII)
# 22 (beastI)
# 23 (moonCancer)
# 24 (beastIIIR)
# 25 (foreigner)
# 26 (beastIIIL)
# 28 (pretender)
# 29 (beastIV)
# 33 (beast)


def cargar_datos_servants():
    """Descarga los datos de los servants desde la API de Atlas Academy."""
    url_basic = "https://api.atlasacademy.io/export/NA/basic_servant.json"
    print(f"Descargando datos desde: {url_basic}")
    try:
        respuesta = requests.get(url_basic)
        respuesta.raise_for_status()  # Esto generará un error si el código no es 200
        print("¡Descarga exitosa!")
        return respuesta.json()
    except requests.exceptions.RequestException as e:
        print(f"ERROR: No se pudo conectar a la API. {e}")
        return []  # Devuelve una lista vacía si hay un error


TODOS_LOS_SERVANTS = cargar_datos_servants()


@app.route('/')
def pagina_principal():
    # ¡Y listo! Le pasamos la lista COMPLETA directamente.
    # El HTML se encargará de buscar las llaves que necesita.
    return render_template('main_page.html', servants_main_page=TODOS_LOS_SERVANTS)


if __name__ == '__main__':
    app.run(debug=True)
