from flask import Blueprint, request, jsonify
from database import db, Resource
import logging

resource_bp = Blueprint("resources", __name__, url_prefix="/resources")
logger = logging.getLogger("marketplace")

# api to add resources
@resource_bp.route("/add-resource", methods=["POST"])
def add_resource():
    data = request.get_json()

#validation for adding resources
    if not data:
        return jsonify({"error": "No input data"}), 400

    required_fields = ["name", "category", "price"]

    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400

    # price should be number
    if not isinstance(data.get("price"), (int, float)):
        return jsonify({"error": "Price must be number"}), 400
    
    resource = Resource(
        name=data["name"],
        category=data["category"],
        price=data["price"]
    )

# error handling
    try:
        db.session.add(resource)
        db.session.commit()
        return jsonify({"message": "Resource added successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to add resource"}), 500
   

#api to view resources
@resource_bp.route("/resources", methods=["GET"])
def view_resources():
    resources = Resource.query.all()

    output = []

    for r in resources:
        output.append({
            "rid": r.rid,
            "name": r.name,
            "category": r.category,
            "price": r.price
        })

    return jsonify(output)

#api to search resources
@resource_bp.route("/search/<string:category>", methods=["GET"])
def search(category):
    resources = Resource.query.filter_by(category=category).all()

    output = []

    for r in resources:
        output.append({
            "rid": r.rid,
            "name": r.name,
            "price": r.price
        })

    return jsonify(output)

#api to delete resources
@resource_bp.route("/delete-resource/<int:rid>", methods=["DELETE"])
def delete_resource(rid):
    resource = Resource.query.get(rid)

    if not resource:
        return jsonify({
            "success": False,
            "message": "Resource not found"
        }), 404

    try:
        db.session.delete(resource)
        db.session.commit()
        return jsonify({
            "success": True,
            "message": "Resource deleted successfully"
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "message": "Delete failed"
        }), 500
