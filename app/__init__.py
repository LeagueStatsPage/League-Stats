from flask import Flask

def create_app(template_folder=None, static_folder=None):
    app = Flask(__name__, template_folder=template_folder, static_folder=static_folder)

    @app.route('/')
    def index():
        return "Hello, World!"

    from app.leagueMain import main
    app.register_blueprint(main)

    return app

if __name__ == "__main__":
    app = create_app(template_folder='templates', static_folder='static')
    app.run(debug=True)
