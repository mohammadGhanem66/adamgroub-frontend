// Login handler function
function handleLogin(event) {
    console.log("Login button clicked");
    event.preventDefault(); // Prevent form submission default behavior

    const apiUrl = "http://127.0.0.1:8000/api/login";

    // Get input values
    const phone = document.getElementById("phoneNumer").value;
    const password = document.getElementById("password").value;

    // Validate inputs
    if (!phone || !password) {
        Swal.fire({
            title: "Error",
            text: "Phone and password are required!",
            icon: "error"
        });
        return;
    }

    // Send login request to the API
    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ phone, password })
    })
        .then((response) => {
            if (!response.ok) {
                return response.json().then((data) => {
                    throw data; // Throw error for validation or API error handling
                });
            }
            return response.json();
        })
        .then((data) => {
            console.log("Login response:", data);

            // Save token in localStorage
            localStorage.setItem("accessToken", data.access_token);
            localStorage.setItem("role", data.is_admin);
            localStorage.setItem("user", JSON.stringify(data.user)); // Save user data if needed
            window.location.href = "index.html";
            // switch (data.user.role.name) {
            //     case "Admin":
            //         window.location.href = "dashboard.html";
            //         break;
            //     case "Seller":
            //         window.location.href = "index.html";
            //         break;
            //     default:
            //         window.location.href = "login.html";
            //         break;
            // }
        })
        .catch((error) => {
            console.error("Login error:", error);

            Swal.fire({
                title: "Error",
                text: error.message || "Invalid email or password. Please try again.",
                icon: "error"
            });
        });
}

// Attach the function to the login button
document.querySelector('button[name="login"]').addEventListener("click", handleLogin);
