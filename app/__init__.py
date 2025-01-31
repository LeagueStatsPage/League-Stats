from flask import Flask, render_template

def create_app(template_folder=None, static_folder=None):
    app = Flask(__name__, template_folder=template_folder, static_folder=static_folder)

    @app.route('/')
    def home():
        return render_template('index.html')

    # Import and register the blueprint
    from .leagueMain import main
    app.register_blueprint(main)

    return app

