import sqlite3

# Connect to the database
conn = sqlite3.connect("users.db")
cursor = conn.cursor()

'''# Add the created_at column
cursor.execute("ALTER TABLE users ADD COLUMN created_at DATETIME;")
conn.commit()

print("created_at column added successfully!")'''

# Update the existing rows with CURRENT_TIMESTAMP
cursor.execute("UPDATE users SET created_at = datetime('now');")
conn.commit()

print("created_at column updated with timestamps!")

# Verify the schema and contents
cursor.execute("PRAGMA table_info(users);")
columns = cursor.fetchall()
for column in columns:
    print(column)

cursor.execute("SELECT * FROM users;")
rows = cursor.fetchall()
for row in rows:
    print(row)

conn.close()