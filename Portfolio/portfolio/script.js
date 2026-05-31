document.addEventListener("DOMContentLoaded", function() {
    const textTarget = document.getElementById("native-typewriter");
    
    // Prevents errors if the element isn't found on the page
    if (!textTarget) return;

    const professions = ['Software Engineer Intern', 'Backend Web Developer', 'Frontend Developer', 'Problem Solver'];
    
    let arrayIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeLoop() {
        const currentString = professions[arrayIndex];
        
        if (isDeleting) {
            textTarget.textContent = currentString.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; 
        } else {
            textTarget.textContent = currentString.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120; 
        }

        if (!isDeleting && charIndex === currentString.length) {
            typingSpeed = 2000; // Holds word for 2 seconds
            isDeleting = true;
        } 
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            arrayIndex = (arrayIndex + 1) % professions.length; 
            typingSpeed = 400; 
        }

        setTimeout(typeLoop, typingSpeed);
    }

    typeLoop();
});
