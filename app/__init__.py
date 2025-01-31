from flask import Flask, render_template

def create_app(template_folder=None, static_folder=None):
    app = Flask(__name__, template_folder=template_folder, static_folder=static_folder)

    # Define the home route to render index.html
    @app.route('/')
    def home():
        return render_template('index.html')

    # Import and register the blueprint
    from .leagueMain import main
    app.register_blueprint(main)

    return app

# Allow running the app directly for local testing
if __name__ == "__main__":
    app = create_app(template_folder='templates', static_folder='static')
    app.run(debug=True)
