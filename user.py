from flask import Blueprint, request, jsonify
from database import db, User
from flask_jwt_extended import create_access_token
import logging


user_bp = Blueprint('user', __name__)
logger = logging.getLogger("marketplace")

# api for register user
@user_bp.route("/register", methods=["POST"])
def register():
    logger.info("Register API called")
    data = request.get_json()

# validation if there is an empty or not
    if not data:
        logger.warning("Register failed: No input data")
        return jsonify({"error": "No input data provided"}), 400
    
    username=data.get("username")
    password=data.get("password")
    role = data.get("role")
    
# the username and passord are set to required field
    if not username or not password:
        logger.warning("Register failed: Missing username or password")
        return jsonify({"error": "Username and Password required"}), 400
    
    new_user = User(
        username=username,
        password=password,
        role=role
    )
    
# error handling
    try:
        db.session.add(new_user)
        db.session.commit()
        logger.info("User registered successfully: %s", username)
        return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        db.session.rollback()
        logger.exception("User registration failed for username=%s", username)
        return jsonify({"error": "Registration failed"}), 500
    
# api to view all users
@user_bp.route("/all", methods=["GET"])
def get_all_users():

    users = User.query.all()

    output = []

    for u in users:
        output.append({
            "username": u.username,
            "role": u.role
        })

    return jsonify(output)

# api to delete user
@user_bp.route("/delete/<string:username>", methods=["DELETE"])
def delete_user(username):

    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify({"error":"User not found"}),404

    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message":"User deleted successfully"})
    except:
        db.session.rollback()
        return jsonify({"error":"Delete failed"}),500
    
# api for user login
@user_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    
#login validation
    if not data:
        return jsonify({"error": "No input data"}), 400

    username=data.get("username")
    password=data.get("password")
 

#validation
    if not username or not password:
        return jsonify({"error": "Username and Password required"}), 400
    
    user = User.query.filter_by(
        username=username,
        password=password
    ).first()

    if user:
        token = create_access_token(identity={
        "userid": user.userid,
        "role": user.role
    })
        return jsonify({
        "message": "Login successful",
        "token": token,
        "userid": user.userid,
        "role": user.role
    })
    else:
        return jsonify({"message": "Invalid credentials"}),401
    