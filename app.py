"""
Módulo principal de la aplicación Flask para el visualizador de Servants de FGO.

Este módulo se encarga de:
- Iniciar la aplicación Flask.
- Cargar los datos de los servants desde una API externa o un caché local.
- Servir la página principal que muestra la lista de servants.
"""
import os
# import json
from flask import Flask, render_template
from whitenoise import WhiteNoise
from dotenv import load_dotenv

# Cargamos las variables de entorno desde el archivo .env
load_dotenv()


# --- Constantes del Módulo ---
# Es una buena práctica definir URLs y nombres de archivo como constantes.

REQUEST_TIMEOUT = 1200  # Segundos

app = Flask(__name__)

# Configura WhiteNoise para servir archivos estáticos en producción.
# No afecta el modo debug, pero es crucial para el despliegue.
app.wsgi_app = WhiteNoise(app.wsgi_app, root='static/')


@app.context_processor
def inject_supabase_keys():
    """
    Inyecta las claves de Supabase (leídas de las variables de entorno de Render)
    en el contexto de TODAS las plantillas Jinja2.
    """
    return dict(
        SUPABASE_URL=os.environ.get('SUPABASE_URL'),
        SUPABASE_ANON_KEY=os.environ.get('SUPABASE_ANON_KEY')
    )


# --- Cargar datos una sola vez al iniciar la app ---
# NOTA: Ahora cargamos los datos completos y los procesamos después.
# Esto es más flexible si en el futuro necesitas más datos en la plantilla.


@app.route('/')
def pagina_principal():
    """
    Renderiza la página principal con la lista de todos los servants.
    """
    # Procesamos los datos justo antes de enviarlos a la plantilla.
    return render_template('index.html', page='index')


@app.route('/calculadora')
def pagina_calculadora():
    """
    Renderiza la página de la calculadora.
    """
    # CAMBIO 2: Pasamos la variable 'page' también aquí.
    return render_template('calculadora.html', page='calculadora')


@app.route('/fgodle')
def pagina_fgodle():
    """
    Renderiza la página de la calculadora.
    """
    # CAMBIO 2: Pasamos la variable 'page' también aquí.
    return render_template('fgodle.html', page='fgodle')


@app.route('/mis-servants')
def pagina_mis_servants():
    """
    Renderiza la página de la calculadora.
    """
    # CAMBIO 2: Pasamos la variable 'page' también aquí.
    return render_template('mis-servants.html', page='mis-servants')


@app.route('/tierlist')
def pagina_tierlist():
    """
    Renderiza la página de la calculadora.
    """
    # CAMBIO 2: Pasamos la variable 'page' también aquí.
    return render_template('tierlist.html', page='tierlist')


if __name__ == '__main__':
    app.run(debug=True)
