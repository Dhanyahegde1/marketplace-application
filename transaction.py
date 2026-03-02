from flask import Blueprint, request, jsonify
from database import db, Transaction, Resource
from flask import Blueprint
from database import User

transaction_bp = Blueprint('transaction', __name__)


#api to purchase resources
@transaction_bp.route("/purchase", methods=["POST"])
def purchase():
    data = request.get_json()

#validate purchase resources
    if not data:
        return jsonify({"error": "No input data"}), 400

    required_fields = ["userid", "rid"]

    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400

    resource = Resource.query.get(data["rid"])

    if not resource:
        return jsonify({"error": "Resource not found"}), 404

    existing = Transaction.query.filter_by(
        userid=data["userid"],
        rid=data["rid"]
    ).first()

    if existing:
        return jsonify({"error": "Resource already purchased"}), 400
    transaction = Transaction(
        userid=data["userid"],
        rid=data["rid"]
    )

# error handling
    try:
        db.session.add(transaction)
        db.session.commit()
        return jsonify({"message": "Purchase successful"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Purchase failed"}), 500

#api for purchase history
@transaction_bp.route("/purchase-history/<int:userid>", methods=["GET"])
def purchase_history(userid):
    transactions = Transaction.query.filter_by(userid=userid).all()
# validate history
    if not transactions:
        return jsonify({"message": "No purchases found"}), 404

    history = []

    for t in transactions:
        resource = Resource.query.get(t.rid)

        history.append({
            "transaction_id": t.tid,
            "resource_name": resource.name,
            "category": resource.category,
            "price": resource.price
        })

    return jsonify(history)

@transaction_bp.route("/all-transactions", methods=["GET"])
def all_transactions():

    transactions = Transaction.query.all()

    output = []

    for t in transactions:

        user = User.query.get(t.userid)
        resource = Resource.query.get(t.rid)

        output.append({
            "tid": t.tid,
            "username": user.username if user else "Unknown",
            "userid": t.userid,
            "resource_name": resource.name if resource else "Deleted",
            "rid": t.rid,
            "category": resource.category if resource else "-",
            "price": resource.price if resource else "-"
        })

    return jsonify(output)