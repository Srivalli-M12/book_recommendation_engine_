import requests

def scrape_books(url, max_pages=5):
    books = []
    log_file = "scraper_errors.log"  # Error log file

    for page in range(1, max_pages + 1):  # Fetch data for multiple pages
        try:
            paginated_url = f"{url}&page={page}"  # Appending page parameter
            response = requests.get(paginated_url, timeout=10)
            response.raise_for_status()
            data = response.json()

            for book in data.get('docs', []):
                title = book.get('title', 'No Title')
                author_names = book.get('author_name', ['Unknown Author'])
                first_publish_year = book.get('first_publish_year', 'Unknown Year')

                books.append({
                    'title': title,
                    'author': ', '.join(author_names),
                    'publish_year': first_publish_year
                })
        except requests.exceptions.RequestException as e:
            with open(log_file, "a") as log:
                log.write(f"Page {page}: {e}\n")  # Log error to file

    return books