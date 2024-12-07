// Difficulty button selection
let selectedDifficulty = "";

// Add event listeners to difficulty buttons
document.getElementById('easy-btn').addEventListener('click', function() {
    selectedDifficulty = "easy";
    highlightSelectedButton();
});

document.getElementById('medium-btn').addEventListener('click', function() {
    selectedDifficulty = "medium";
    highlightSelectedButton();
});

document.getElementById('hard-btn').addEventListener('click', function() {
    selectedDifficulty = "hard";
    highlightSelectedButton();
});

// Add event listener to Confirm button
document.getElementById('confirm-btn').addEventListener('click', function() {
    if (selectedDifficulty === "") {
        alert("Please select a difficulty.");
        return;
    }
    // Redirect based on the selected difficulty
    if (selectedDifficulty === "easy") {
        window.location.href = "/game/easy";  // Redirect to easy game page
    } else if (selectedDifficulty === "medium") {
        window.location.href = "/game/medium";  // Redirect to medium game page
    } else if (selectedDifficulty === "hard") {
        window.location.href = "/game/hard";  // Redirect to hard game page
    }
});

// Function to highlight the selected button
function highlightSelectedButton() {
    const buttons = document.querySelectorAll('.difficulty-btn');
    buttons.forEach(button => {
        if (button.id === `${selectedDifficulty}-btn`) {
            button.style.backgroundColor = '#4a90e2';  // Change background color for selected
        } else {
            button.style.backgroundColor = '#6ec1e4';  // Default color for unselected buttons
        }
    });
}
