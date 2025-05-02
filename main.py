from flask import Flask, render_template, request, jsonify
from scraper import scrape_books
from processor import clean_and_format_data
from recommendation_engine import recommend_books
import sqlite3
import csv
import os
import datetime

app = Flask(__name__)
app.secret_key = "your_very_secure_secret_key"

DB_PATH = "users.db"


def init_db():
    print("Initializing database...")  # Debug message
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()
    print("Database initialized successfully!")  # Debug message
init_db()

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/signup", methods=["POST"])
def signup():
    username = request.form.get("username")
    password = request.form.get("password")
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Explicitly storing created_at in local time (IST)
        cursor.execute("INSERT INTO users (username, password, created_at) VALUES (?, ?, datetime('now', 'localtime'))", (username, password))

        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": "User registered successfully!"})
    except sqlite3.IntegrityError:
        return jsonify({"success": False, "message": "Username already exists!"})
    
@app.route("/login", methods=["POST"])
def login():
    username = request.form.get("username")
    password = request.form.get("password")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ? AND password = ?", (username, password))
    user = cursor.fetchone()
    conn.close()
    if user:
        session["username"] = username  # Ensure this is set properly
        return jsonify({"success": True, "message": "Login successful!"})
    return jsonify({"success": False, "message": "Invalid credentials!"})

@app.route("/recommend", methods=["POST"])
def recommend():
    preference = request.json.get("preference")
    books = scrape_books("https://openlibrary.org/search.json?q=science", max_pages=3)
    cleaned_data = clean_and_format_data(books)
    recommendations = recommend_books(cleaned_data, preference)

    # Update last_recommendations with current results only
    global last_recommendations
    last_recommendations = recommendations  # Store only the current recommendations
    return jsonify(recommendations)

from flask import send_file
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

@app.route("/export/<format>")
def export(format):
    # Ensure there are recommendations to export
    if not last_recommendations:
        return jsonify({"message": "No recommendations available to export!"}), 400

    if format == "pdf":
        file_path = "static/books.pdf"
        try:
            # Create a PDF with ReportLab
            pdf_canvas = canvas.Canvas(file_path, pagesize=letter)
            pdf_canvas.setFont("Helvetica", 12)

            # Write each book's details in the PDF
            text_y_position = 750  # Start position on the page
            for book in last_recommendations:
                pdf_canvas.drawString(50, text_y_position, f"Title: {book['title']}")
                pdf_canvas.drawString(50, text_y_position - 20, f"Author: {book['author']}")
                pdf_canvas.drawString(50, text_y_position - 40, f"Year: {book['publish_year']}")
                text_y_position -= 80  # Move to the next line

                # Add a new page if necessary
                if text_y_position < 50:
                    pdf_canvas.showPage()
                    pdf_canvas.setFont("Helvetica", 12)
                    text_y_position = 750

            pdf_canvas.save()  # Save the PDF
            return send_file(file_path, as_attachment=True)  # Serve the PDF for download
        except Exception as e:
            return jsonify({"message": f"Error exporting PDF: {str(e)}"}), 500

    elif format == "csv":
        file_path = "static/books.csv"
        try:
            with open(file_path, "w", newline="", encoding="utf-8") as file:  # Use UTF-8 encoding
                writer = csv.DictWriter(file, fieldnames=["title", "author", "publish_year"])
                writer.writeheader()
                writer.writerows(last_recommendations)  # Write only current recommendations
            return send_file(file_path, as_attachment=True)
        except Exception as e:
            return jsonify({"message": f"Error exporting CSV: {str(e)}"}), 500

    return jsonify({"message": "Unsupported format!"}), 400
from flask import Response
import io
import matplotlib.pyplot as plt

@app.route("/visualize", methods=["GET"])
def visualize():
    # Example data for the graph
    years = [2000, 2001, 2002, 2003]
    counts = [10, 15, 7, 20]

    # Generate the plot
    plt.figure(figsize=(10, 6))
    plt.bar(years, counts, color="skyblue")
    plt.xlabel("Publishing Year")
    plt.ylabel("Number of Books")
    plt.title("Publishing Trends Over the Years")

    # Save the plot to a bytes buffer instead of a file
    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    buf.seek(0)
    plt.close()

    # Return the graph as a response
    return Response(buf, mimetype="image/png")

from flask import session

@app.route("/user_data", methods=["GET"])
def user_data():
    try:
        username = session.get("username")
        print(f"Session username: {username}")  # Debug message
        
        if not username:
            raise ValueError("No user is logged in.")

        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT username, created_at FROM users WHERE username = ?", (username,))
        user = cursor.fetchone()
        conn.close()

        print(f"Fetched user: {user}")  # Debugging output

        if not user:
            raise ValueError("User not found in the database.")

        user_info = {
            "username": user[0],
            "registration_date": user[1] if user[1] else "Timestamp not available"
        }
        return jsonify(user_info)

    except ValueError as ve:
        print(f"ValueError: {ve}")
        return jsonify({"message": str(ve)}), 403
    except Exception as e:
        print(f"Exception: {e}")
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500
    
def get_current_user():
    username = session.get("username")
    if username:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT username, created_at FROM users WHERE username = ?", (username,))
        user = cursor.fetchone()
        conn.close()

        if user:
            return {"username": user[0], "registration_date": user[1]}

    return None

@app.route("/logout", methods=["POST"])
def logout():
    session.pop("username", None)  # Remove the username from the session
    return jsonify({"message": "Logged out successfully!"})

if __name__ == "__main__":
    if not os.path.exists("static"):
        os.makedirs("static")
    app.run(debug=True)