const link = document.getElementById("world-cup-link");

link.addEventListener("click", (event) => {
    event.preventDefault();

    document.body.classList.add("fade-out");

    setTimeout(() => {
        window.location.href = "groups.html";
    }, 1000);
});