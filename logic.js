// Elements
const inputTxt = document.getElementById("input");
const image = document.getElementById("img");
const button = document.getElementById("btn");
const downloadBtn = document.querySelector(".download-btn");

// Asynchronous function to query your backend API
async function query(data) {
    try {
        const start = Date.now();  // Start the time measurement
        console.log("Starting backend request...");

        const response = await fetch("https://ai-image-generator-vkm5.onrender.com/api/query", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(data),
        });

        const end = Date.now();  // End the time measurement
        console.log(`Backend responded in ${(end - start) / 1000} seconds`);

        if (!response.ok) {
            const error = await response.text();
            console.error("Error response object:", response);
            console.error("Error from Backend API:", error);
            alert("Something went wrong: " + error);
            return;
        }

        const result = await response.blob();
        return result;
    } catch (err) {
        console.error("Fetch error:", err);
        alert("An error occurred: " + err.message);
    }
}

// Event listener for download button
downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.href = image.src;
    link.download = "generated-image.png";
    link.click();
});

// Event listener for button click
button.addEventListener("click", async () => {
    const prompt = inputTxt.value.trim(); // Get user input and trim spaces

    if (!prompt) {
        alert("Please enter a valid text prompt.");
        return;
    }

    // Display loading GIF
    image.src = "/loading.gif";  // Set the loading GIF
    image.style.display = "block"; // Ensure the image container is visible
    button.disabled = true;

    // Call the query function and measure the time
    const response = await query({ inputs: prompt });

    // Handle response
    if (response) {
        const objectURL = URL.createObjectURL(response);
        image.src = objectURL;
        image.style.display = "block"; // Make the image visible
        downloadBtn.style.display = "block";  // Show download button
    }

    // Reset button state
    button.disabled = false;
});
