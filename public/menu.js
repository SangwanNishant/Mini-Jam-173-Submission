// Event listener for "Play Game" button
document.getElementById('play-game-btn').addEventListener('click', function() {
    // Redirect to the game page
    window.location.href = "/game"; // Replace with your actual game endpoint
});

// Event listener for "Difficulty" button
document.getElementById('difficulty-btn').addEventListener('click', function() {
    // Redirect to the difficulty selection page
    window.location.href = "/difficulty"; // Replace with your difficulty page endpoint
});
