from . import create_app

app = create_app(template_folder='templates', static_folder='static')

if __name__ == "__main__":
    app.run(debug=True)
