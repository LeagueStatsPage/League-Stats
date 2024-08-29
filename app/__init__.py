from flask import Flask

def create_app(template_folder = None, static_folder = None):
    app = Flask(__name__, template_folder = template_folder, static_folder = static_folder)
    
    from app.leagueMain import main
    app.register_blueprint(main)
    
    return app