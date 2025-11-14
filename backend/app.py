import os
import json
import random
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename

# --- Config ---
UPLOAD_FOLDER = "uploads"
METADATA_FILE = "metadata.json"
ALLOWED_EXTENSIONS = {"pdf", "docx", "jpg", "png"}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = Flask(__name__)
CORS(app)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def load_metadata():
    """Load contract metadata from JSON file"""
    if os.path.exists(METADATA_FILE):
        try:
            with open(METADATA_FILE, 'r') as f:
                return json.load(f)
        except json.JSONDecodeError:
            return {}
    return {}

def save_metadata(metadata):
    """Save contract metadata to JSON file"""
    with open(METADATA_FILE, 'w') as f:
        json.dump(metadata, f, indent=2)

def generate_privacy_rating():
    """Generate a random privacy rating from 1-10"""
    return random.randint(1, 10)

def get_or_create_file_metadata(filename):
    """Get metadata for a file, creating it if it doesn't exist (thread-safe)"""
    metadata = load_metadata()

    if filename in metadata:
        return metadata[filename]

    # Generate new metadata
    file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    if not os.path.exists(file_path):
        return None

    stats = os.stat(file_path)
    privacy_rating = generate_privacy_rating()
    upload_date = datetime.fromtimestamp(stats.st_mtime).strftime("%m/%d/%Y")

    file_metadata = {
        "filename": filename,
        "uploadDate": upload_date,
        "uploadTimestamp": stats.st_mtime,
        "privacyRating": privacy_rating,
        "archived": False
    }

    # Save immediately to avoid race conditions
    metadata[filename] = file_metadata
    save_metadata(metadata)

    return file_metadata

@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        save_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(save_path)

        # Generate and save metadata
        metadata = load_metadata()
        privacy_rating = generate_privacy_rating()

        metadata[filename] = {
            "filename": filename,
            "uploadDate": datetime.now().strftime("%m/%d/%Y"),
            "uploadTimestamp": datetime.now().timestamp(),
            "privacyRating": privacy_rating,
            "archived": False
        }

        save_metadata(metadata)

        return jsonify({
            "message": f"{filename} uploaded successfully",
            "savedFileName": filename,
            "privacyRating": privacy_rating
        })

    return jsonify({"error": "File type not allowed"}), 400

@app.route("/uploads", methods=["GET"])
def list_uploads():
    """List all uploaded files with metadata"""
    try:
        files = []
        upload_path = app.config["UPLOAD_FOLDER"]

        # Get 'archived' query param (default to showing only archived)
        show_archived_only = request.args.get('archived', 'true').lower() == 'true'

        if not os.path.exists(upload_path):
            return jsonify({"files": []})

        for filename in os.listdir(upload_path):
            file_path = os.path.join(upload_path, filename)

            # Skip directories
            if not os.path.isfile(file_path):
                continue

            # Get or create metadata (thread-safe)
            file_metadata = get_or_create_file_metadata(filename)
            if not file_metadata:
                continue

            # Filter by archived status
            is_archived = file_metadata.get("archived", False)
            if show_archived_only and not is_archived:
                continue

            stats = os.stat(file_path)

            files.append({
                "filename": filename,
                "uploadDate": file_metadata["uploadDate"],
                "uploadTimestamp": file_metadata["uploadTimestamp"],
                "size": stats.st_size,
                "privacyRating": file_metadata["privacyRating"],
                "archived": is_archived
            })

        # Sort by upload date (most recent first)
        files.sort(key=lambda x: x["uploadTimestamp"], reverse=True)

        return jsonify({"files": files})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/upload/<filename>", methods=["GET"])
def get_file_metadata(filename):
    """Get metadata for a specific file"""
    safe_name = secure_filename(filename)

    file_metadata = get_or_create_file_metadata(safe_name)

    if not file_metadata:
        return jsonify({"error": "File not found"}), 404

    return jsonify(file_metadata)

@app.route("/upload/<filename>/archive", methods=["PATCH"])
def archive_file(filename):
    """Mark a file as archived"""
    safe_name = secure_filename(filename)

    metadata = load_metadata()

    if safe_name not in metadata:
        # File exists but no metadata - create it first
        file_metadata = get_or_create_file_metadata(safe_name)
        if not file_metadata:
            return jsonify({"error": "File not found"}), 404
        metadata = load_metadata()

    # Mark as archived
    metadata[safe_name]["archived"] = True
    save_metadata(metadata)

    return jsonify({
        "message": "File archived successfully",
        "filename": safe_name,
        "archived": True
    })

@app.route("/upload/<filename>", methods=["DELETE"])
def delete_file(filename):
    safe_name = secure_filename(filename)
    file_path = os.path.join(app.config["UPLOAD_FOLDER"], safe_name)

    if os.path.exists(file_path):
        os.remove(file_path)

        # Remove from metadata
        metadata = load_metadata()
        if safe_name in metadata:
            del metadata[safe_name]
            save_metadata(metadata)

        return jsonify({"message": f"{safe_name} deleted successfully"})
    else:
        return jsonify({"error": "File not found"}), 404


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)


