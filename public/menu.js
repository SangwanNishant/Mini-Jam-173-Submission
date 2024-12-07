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
// Create an Image object to preload the background image
const backgroundImage = new Image();
backgroundImage.src = 'Assets/menu.png';

// Once the background image is loaded, show the content (buttons)
backgroundImage.onload = () => {
    // Set the background of the body once the image has loaded
    document.body.style.backgroundImage = `url(${backgroundImage.src})`;

    // Remove the 'hidden' class from the content to show the buttons
    document.getElementById('content').classList.remove('hidden');
};
