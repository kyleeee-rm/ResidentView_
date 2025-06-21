document.addEventListener('DOMContentLoaded', function() {
console.log("Script loaded and DOM ready");
console.log("Script loaded");




document.getElementById("ApplicationForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const toast = document.getElementById("toast");
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 5000);

    this.reset();
    
});





});