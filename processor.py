from collections import defaultdict

def clean_and_format_data(data):
    cleaned_data = []
    seen_books = set()  # To keep track of unique books

    for book in data:
        # Deduplication: Use a tuple of title and author to identify duplicates
        unique_key = (book['title'].lower(), book['author'].lower())
        if unique_key not in seen_books and book['publish_year'] != 'Unknown Year' and book['publish_year'] >= 1900:
            cleaned_data.append(book)
            seen_books.add(unique_key)  # Mark book as seen

    return cleaned_data

def categorize_books(data):
    categories = defaultdict(list)  # Default dictionary for flexible appending
    science_subcategories = {
        'Physics': ['physics', 'quantum', 'relativity', 'mechanics'],
        'Biology': ['biology', 'genetics', 'ecosystem', 'organism'],
        'Chemistry': ['chemistry', 'molecule', 'compound', 'reaction'],
        'Earth Science': ['geology', 'earth', 'environment', 'climate'],
        'Astronomy': ['astronomy', 'stars', 'planets', 'cosmos', 'space'],
    }

    for book in data:
        subcategory_found = False
        for subcategory, keywords in science_subcategories.items():
            if any(keyword in book['title'].lower() for keyword in keywords):
                categories[subcategory].append(book)
                subcategory_found = True
                break
        
        if not subcategory_found:
            categories['General Science'].append(book)  # Default category for science books that don't fit any subcategories

    return categories