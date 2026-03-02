from flask import Flask
from flask import request, jsonify
from database import db
from user import user_bp
from resources import resource_bp
from transaction import transaction_bp
from flask import render_template
from flask_jwt_extended import JWTManager
import logging
from logger_config import setup_logger
from flask import request

app = Flask(__name__)

#adding jwtt tokens
app.config["JWT_SECRET_KEY"] = "super-secret-key"
jwt = JWTManager(app)

# adding loggers
logger = setup_logger()
logger.info("Application started")
@app.before_request
def log_request():
    logger.info("Request received")


@app.before_request
def log_request():
    logger.info(
        "Incoming request: %s %s | IP=%s",
        request.method,
        request.path,
        request.remote_addr
    )


@app.errorhandler(Exception)
def handle_exception(e):
    logger.exception("Unhandled exception occurred")
    return {"error": "Internal Server Error"}, 500

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///marketplace.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Register Blueprints
app.register_blueprint(user_bp,url_prefix="/user")
app.register_blueprint(resource_bp,url_prefix="/resources")
app.register_blueprint(transaction_bp,url_prefix="/transaction")

with app.app_context():
    db.create_all()

@app.route("/")
def home():
    return render_template("login.html")

@app.route("/register-page")
def register_page():
    return render_template("register.html")

@app.route("/admin")
def admin():
    return render_template("admin.html")


@app.route("/seller")
def seller():
    return render_template("seller-dashboard.html")

@app.route("/buyer")
def buyer():
    return render_template("buyer_dashboard.html")

#error handling
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Route not found"}), 404


@app.errorhandler(500)
def server_error(error):
    return jsonify({"error": "Internal server error"}), 500


if __name__ == "__main__":
    print("Starting Flask server...")
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True,
        use_reloader=False
    )
    # NO app.run() here