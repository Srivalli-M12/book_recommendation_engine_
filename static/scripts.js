document.getElementById("loginBtn").addEventListener("click", () => {
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!username || !password) {
        alert("Please fill out both the username and password fields.");
        return;
    }

    fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(`Welcome back, ${username}! You have logged in successfully.`);
            document.getElementById("login").style.display = "none"; // Hide Login form
            document.getElementById("navbar").style.display = "block"; // Show Navbar
            document.getElementById("content").style.display = "block"; // Show Main Content

            // Display the welcome message in the website body
            const welcomeMessage = document.createElement("div");
            welcomeMessage.id = "welcomeMessage"; // Assign an ID for styling or future reference
            welcomeMessage.style.margin = "20px"; // Add spacing around the message
            welcomeMessage.style.textAlign = "center"; // Center the text
            welcomeMessage.style.fontSize = "1.5em"; // Increase font size for visibility
            welcomeMessage.textContent = `Welcome, ${username}!`; // Personalized message
            document.getElementById("content").appendChild(welcomeMessage); // Add to the body
        } else {
            alert(data.message); // Show error message if login fails
        }
    })
    .catch(error => console.error("Error during login:", error));
});

document.getElementById("signupBtn").addEventListener("click", () => {
    const username = document.getElementById("signupUsername").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

    if (!username || !password) {
        alert("Please fill out both the username and password fields.");
        return;
    }

    fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(`${username}, you have registered successfully! Redirecting to login...`);
            
            // Redirect after 2 seconds and ensure alignment
            setTimeout(() => {
                document.getElementById("signup").style.display = "none"; // Hide Sign-Up form
                document.getElementById("login").style.display = "flex"; // Show Login form with proper alignment
                document.getElementById("login").style.justifyContent = "center"; // Ensure horizontal center
                document.getElementById("login").style.alignItems = "center"; // Ensure vertical center
            }, 2000);
        } else {
            alert(data.message); // Display error message
        }
    })
    .catch(error => console.error("Error during sign-up:", error));
});

document.getElementById("switchToSignUp").addEventListener("click", () => {
    document.getElementById("login").style.display = "none"; // Hide Login form
    document.getElementById("signup").style.display = "flex"; // Show Sign-Up form
});

document.getElementById("switchToLogin").addEventListener("click", () => {
    document.getElementById("signup").style.display = "none"; // Hide Sign-Up form
    document.getElementById("login").style.display = "flex"; // Show Login form
});

// Navigation logic for pages
document.getElementById("homeLink").addEventListener("click", () => {
    document.getElementById("content").innerHTML = `
        <section>
            <h2>Welcome to Book Recommendation Engine</h2>
            <p>Our platform helps you explore, discover, and analyze books in a personalized way. Here's what you can do:</p>
            <ul>
                <li><strong>Book Recommendations:</strong> Get curated book suggestions based on your preferences.</li>
                <li><strong>Book Statistics:</strong> Dive deep into book insights, such as genres, authors, and publishing trends.</li>
                <li><strong>Export Results:</strong> Save your recommendations and statistics as downloadable files.</li>
            </ul>
            <p>Start exploring by navigating to <strong>Book Search</strong> or <strong>Book Statistics</strong> in the menu above.</p>
        </section>
    `;
    document.getElementById("searchFooter").style.display = "block"; // Show footer note on Home page
});

document.getElementById("searchLink").addEventListener("click", () => {
    // Load the Book Search page dynamically
    document.getElementById("content").innerHTML = `
        <section>
            <h2>Book Search</h2>
            <p>Search for books by entering a title, author, or publishing year below:</p>
            <input type="text" id="searchInput" placeholder="Enter title, author, or year">
            <button id="searchBtn">Search</button>
            <div id="results"></div>
        </section>
    `;
    document.getElementById("searchFooter").style.display = "block"; // Show footer note on Search page

    // Add event listener for Search button
    document.getElementById("searchBtn").addEventListener("click", () => {
        const preference = document.getElementById("searchInput").value;
        const resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = "<p>Processing your input...</p>";

        fetch("/recommend", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ preference })
        })
        .then(response => response.json())
        .then(data => {
            resultsDiv.innerHTML = ""; // Clear previous results

            if (data.length === 0) {
                // Show a "No results found" message if no recommendations
                resultsDiv.innerHTML = "<p>No results found. Please try a different input.</p>";
            } else {
                // Display recommendations dynamically
                data.forEach(book => {
                    const bookDiv = document.createElement("div");
                    bookDiv.innerHTML = `
                        <p><strong>Title:</strong> ${book.title}</p>
                        <p><strong>Author:</strong> ${book.author}</p>
                        <p><strong>Year:</strong> ${book.publish_year}</p>
                    `;
                    resultsDiv.appendChild(bookDiv);
                });

                // Add export options dynamically
                const exportOptions = `
                    <p>Do you want to export the results?</p>
                    <button id="exportCSV">Export as CSV</button>
                    <button id="exportPDF">Export as PDF</button>
                `;
                resultsDiv.innerHTML += exportOptions;

                // Add event listeners for Export buttons
                document.getElementById("exportCSV").addEventListener("click", () => {
                    window.location.href = "/export/csv";
                });

                document.getElementById("exportPDF").addEventListener("click", () => {
                    window.location.href = "/export/pdf";
                });
            }
        })
        .catch(error => {
            resultsDiv.innerHTML = `<p>Error fetching recommendations: ${error.message}</p>`;
        });
    });
});

document.getElementById("statisticsLink").addEventListener("click", () => {
    document.getElementById("content").innerHTML = `
        <section>
            <h2>Book Statistics</h2>
            <p>Gain insights into our book database:</p>
            <ul>
                <li>Discover the most common publishing years.</li>
                <li>Explore popular genres and sub-genres.</li>
                <li>Learn about the most frequent authors.</li>
            </ul>
            <button id="viewStatisticsBtn">View Statistics</button>
            <div id="statisticsResult" style="margin-top: 2em;"></div>
        </section>
    `;
    document.getElementById("searchFooter").style.display = "none"; // Hide footer note on Statistics page

    document.getElementById("viewStatisticsBtn").addEventListener("click", () => {
        const statsDiv = document.getElementById("statisticsResult");
        statsDiv.innerHTML = "<p>Generating insights...</p>";
    
        fetch("/visualize")
            .then(response => {
                if (response.ok) {
                    return response.blob(); // Convert the response to a Blob (binary data)
                } else {
                    throw new Error("Failed to generate the graph.");
                }
            })
            .then(blob => {
                const url = URL.createObjectURL(blob); // Create a temporary URL for the image
                const imgElement = document.createElement("img");
                imgElement.src = url; // Set the image source to the graph URL
                imgElement.alt = "Book Statistics Chart";
                imgElement.style.maxWidth = "100%"; // Make it responsive
                imgElement.style.marginTop = "20px";
    
                statsDiv.innerHTML = ""; // Clear previous content
                statsDiv.appendChild(imgElement); // Add the graph image to the statistics section
            })
            .catch(error => {
                statsDiv.innerHTML = `<p>${error.message}</p>`;
            });
    });
});


document.getElementById("guideLink").addEventListener("click", () => {
    document.getElementById("content").innerHTML = `
        <section>
            <h2>How to Use This Tool</h2>
            <p>Welcome to our guide! Here’s how you can make the most out of our platform:</p>
            <ul>
                <li><strong>Book Search:</strong> Navigate to "Book Search" in the menu, enter your preferences, and explore personalized book recommendations.</li>
                <li><strong>Book Statistics:</strong> Visit "Book Statistics" to view insights like genres, authors, and publishing trends.</li>
                <li><strong>Export Options:</strong> After generating results, click on "Export as CSV" or "Export as PDF" to save your data.</li>
                <li><strong>User Details:</strong> Check your activity log and account information in the "User Details" section.</li>
            </ul>
            <p>Feel free to explore and enjoy using the Book Recommendation Engine!</p>
        </section>
    `;
    document.getElementById("searchFooter").style.display = "none"; // Hide footer note on Guide page
});

document.getElementById("userDataLink").addEventListener("click", () => {
    const contentDiv = document.getElementById("content");

    fetch("/user_data")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.message === "No user logged in!") {
                contentDiv.innerHTML = "<p>No user is currently logged in. Please log in to view your details.</p>";
            } else {
                const username = data.username || "N/A";
                const registrationDate = data.registration_date || "Unknown";
                const actions = data.actions && data.actions.length > 0
                    ? data.actions.map(action => `<li>${action.timestamp}: ${action.action}</li>`).join('')
                    : "<li>No actions found</li>";

                contentDiv.innerHTML = `
                    <section>
                        <h2>User Details</h2>
                        <p><strong>Username:</strong> ${username}</p>
                        <p><strong>Account Created:</strong> ${registrationDate}</p>
                    </section>
                `;
            }
        })
        .catch(error => {
            contentDiv.innerHTML = `<p>Error fetching user details: ${error.message}</p>`;
        });
});
document.getElementById("guideLinkFooter").addEventListener("click", (e) => {
    e.preventDefault(); // Prevent default link behavior
    document.getElementById("navbar").style.display = "block"; // Ensure navbar is visible
    document.getElementById("content").innerHTML = `
        <section>
            <h2>How to Use This Tool</h2>
            <p>Welcome to our guide! Here’s how you can make the most out of our platform:</p>
            <ul>
                <li><strong>Book Search:</strong> Navigate to "Book Search" in the menu, enter your preferences, and explore personalized book recommendations.</li>
                <li><strong>Book Statistics:</strong> Visit "Book Statistics" to view insights like genres, authors, and publishing trends.</li>
                <li><strong>Export Options:</strong> After generating results, click on "Export as CSV" or "Export as PDF" to save your data.</li>
                <li><strong>User Details:</strong> Check your activity log and account information in the "User Details" section.</li>
            </ul>
            <p>Feel free to explore and enjoy using the Book Recommendation Engine!</p>
        </section>
    `;
    document.getElementById("searchFooter").style.display = "none"; // Hide footer note during guide view
});
document.getElementById("logoutLink").addEventListener("click", (e) => {
    e.preventDefault(); // Prevent default link behavior

    fetch("/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Logout failed! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data.message); // Log the success message

        // Redirect the user to the home page or show a logout confirmation
        document.getElementById("content").innerHTML = "<p>You have been logged out successfully!</p>";
        // Optionally, hide the navigation links or prompt a login screen
        document.getElementById("navbar").style.display = "none"; // Example: Hides the navigation bar
    })
    .catch(error => {
        document.getElementById("content").innerHTML = `<p>Error: ${error.message}</p>`;
    });
});