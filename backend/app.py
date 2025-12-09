# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from pathlib import Path
from datetime import datetime

app = Flask(__name__)
CORS(app)

DATA_DIR = Path(__file__).parent / "data"
DATA_DIR.mkdir(exist_ok=True)

PUBLIC_KEYS_FILE = DATA_DIR / "public_keys.json"
MESSAGES_FILE = DATA_DIR / "messages.json"


def load_json(path, default):
    if not path.exists():
        return default
    try:
        with path.open("r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default


def save_json(path, data):
    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


@app.route("/api/public-keys", methods=["GET", "POST"])
def public_keys():
    if request.method == "GET":
        data = load_json(PUBLIC_KEYS_FILE, [])
        return jsonify(data)

    # POST
    payload = request.get_json(force=True) or {}
    address = payload.get("address")
    public_key = payload.get("public_key")
    nickname = payload.get("nickname", "")

    if not address or not public_key:
        return jsonify({"error": "address and public_key are required"}), 400

    data = load_json(PUBLIC_KEYS_FILE, [])

    # simple upsert by address
    existing = next((item for item in data if item["address"].lower() == address.lower()), None)
    if existing:
        existing["public_key"] = public_key
        existing["nickname"] = nickname
        existing["updated_at"] = datetime.utcnow().isoformat() + "Z"
    else:
        data.append({
            "address": address,
            "public_key": public_key,
            "nickname": nickname,
            "created_at": datetime.utcnow().isoformat() + "Z",
        })

    save_json(PUBLIC_KEYS_FILE, data)
    return jsonify({"status": "ok"})


@app.route("/api/messages", methods=["GET", "POST"])
def messages():
    if request.method == "GET":
        data = load_json(MESSAGES_FILE, [])
        return jsonify(data)

    payload = request.get_json(force=True) or {}
    sender = payload.get("from")
    recipient = payload.get("to")
    ciphertext = payload.get("ciphertext")

    if not sender or not recipient or not ciphertext:
        return jsonify({"error": "from, to, and ciphertext are required"}), 400

    data = load_json(MESSAGES_FILE, [])
    data.append({
        "from": sender,
        "to": recipient,
        "ciphertext": ciphertext,
        "created_at": datetime.utcnow().isoformat() + "Z",
    })
    save_json(MESSAGES_FILE, data)
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True, port=5001)