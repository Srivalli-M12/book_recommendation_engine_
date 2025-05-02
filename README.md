
# book_recommendation_engine_
### Description
The **book_recommendation_engine_** is a full-stack web application that allows users to explore, discover, and analyze books based on their preferences. It fetches real-time book data from the **Open Library API**, processes the information, and delivers tailored recommendations. Users can also **export recommendations** as CSV/PDF files and visualize book statistics dynamically.

### Features
- **Personalized Book Recommendations** based on title, author, or publication year.
- **Live Data Scraping** from Open Library API for up-to-date book listings.
- **Data Cleaning & Categorization** to ensure high-quality results.
- **Interactive Statistics Visualization** using graphs and trends.
- **Export Options** (CSV & PDF) for convenient data storage.
- **User Authentication** (Signup & Login) with session tracking.

### Tech Stack
#### Front-End
- **HTML** – Structure of the web pages.
- **CSS** – Styling for an intuitive UI experience.
- **JavaScript** – Dynamic user interactions and API calls.

#### Back-End
- **Python (Flask)** – Manages routes, authentication, and recommendation logic.
- **SQLite** – Stores user authentication and activity data.

#### Middleware
- **Flask** – Connects the front-end with the back-end and processes requests.

### API Usage
- **Open Library API** – Fetches book data dynamically based on user queries.

### Project Structure
```plaintext
book_recommendation_engine_/
│── static/
│   ├── styles.css    # Front-end styling
│   ├── scripts.js    # JavaScript interactions
│── templates/
│   ├── index.html    # Main UI page
│── scraper.py        # Fetches books from Open Library API
│── processor.py      # Cleans and categorizes book data
│── recommendation_engine.py  # Matches recommendations with user preferences
│── main.py          # Flask server handling API routes and authentication
│── users.db         # SQLite database (User authentication)
```
### Installation & Setup
#### Step 1: Clone the Repository
```bash
git clone https://github.com/SrivalliMannem/book_recommendation_engine_.git
cd book_recommendation_engine_
```
#### Step 2: Set Up Virtual Environment (Optional)
```bash
python -m venv env
source env/bin/activate  # (Mac/Linux)
env\Scripts\activate  # (Windows)
```
#### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```
#### Step 4: Run the Application
```bash
python main.py
```

### License
This project is open-source and available under the **MIT License**.

### Acknowledgments
A big thank you to all the contributors, developers, and the **Open Library API** for providing accessible book data. 

### Contact
For any queries, suggestions, or collaborations, feel free to reach out:[GitHub](https://github.com/SrivalliMannem)



