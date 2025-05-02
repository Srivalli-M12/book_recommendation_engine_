def recommend_books(data, preference):
    recommendations = []
    for book in data:
        # Match user input with title, author, or publish year
        if preference.lower() in book['title'].lower() or \
           preference.lower() in book['author'].lower() or \
           preference in str(book['publish_year']):
            recommendations.append(book)
    return recommendations