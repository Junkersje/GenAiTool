let currentTheme = "Teenager"; // Default theme

// Function to toggle between themes
document.getElementById("theme-toggle-btn").addEventListener("click", () => {
    currentTheme = (currentTheme === "Teenager") ? "Grandparent" : "Teenager";

    // Update the displayed current theme inside the button
    document.getElementById("theme-name").textContent = currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1);

    // Toggle switch style for the button
    const themeButton = document.getElementById("theme-toggle-btn");
    themeButton.classList.toggle("active"); // Toggle active class
    themeButton.classList.remove("Teenager", "Grandparent");
    themeButton.classList.add(currentTheme);

    console.log(`Current theme: ${currentTheme}`);
});

// Function to call the Hugging Face API
function callHuggingFaceAPI(apiKey, prompt) {
    const themedPrompt = generateThemedPrompt(prompt, currentTheme);
    fetch("https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,  // Use the user-provided API key
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "meta-llama/Llama-3.1-8B-Instruct",
            messages: [
                {
                    role: "user",
                    content: themedPrompt,
                },
            ],
            max_tokens: 100,
            temperature: 0.8,
            stream: false,
            stop: ["\n"],
        }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            return response.json();
        })
        .then((data) => {
            const respondtext = data.choices[0].message.content; //det var et objekt i den returnerede data som var svaret, og det fisker vi ud her igennem dataens choices da det er et array med et enkelt object
            console.log("Response object:", respondtext);
            document.getElementById("response-output").textContent = respondtext;
        })
        .catch((error) => {
            console.error("Error:", error);
            document.getElementById("response-output").textContent = `Error: ${error.message}`;
        });
}

// Event listener for button click
document.getElementById("submit-btn").addEventListener("click", () => {
    const apiKey = document.getElementById("api-key").value.trim();  // Get the user-entered API key
    const prompt = document.getElementById("prompt").value.trim();

    if (!apiKey) {
        alert("Please enter your Hugging Face API key!");
        return;
    }

    if (prompt) {
        callHuggingFaceAPI(apiKey, `with the most formal way to answer, ${prompt}`);
    } else {
        alert("Please enter a prompt!");
    }
});


// Function to generate a themed prompt based on the current theme
function generateThemedPrompt(prompt, theme) {
    if (theme === "Teenager") {
        return `Pretend you are an teenage boy with a eminent passion for gaming, please respond in a humorous, gaming-inspired tone refering to either a yes or no if possible: ${prompt}`;
    } else if (theme === "Grandparent") {
        return `Pretend to be an wise old man without stating it. Can you provide me with a comment on this: ${prompt}. - phrased in a much formal and professional way, thanks`;
    }
    return prompt; // Default
}