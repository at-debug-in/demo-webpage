document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selections ---
    const toggleIngredientsBtn = document.getElementById('toggle-ingredients-btn');
    const toggleInstructionsBtn = document.getElementById('toggle-instructions-btn');
    const ingredientsList = document.getElementById('ingredients-list');
    const instructionsList = document.getElementById('steps-list');
    const startCookingBtn = document.getElementById('start-cooking-btn');
    const nextStepBtn = document.getElementById('next-step-btn');
    const progressBar = document.getElementById('progress-bar');
    const steps = instructionsList.querySelectorAll('li');
    const timerDisplay = document.getElementById('timer-display');
    const printBtn = document.getElementById('print-btn');

    // --- State Variables ---
    let currentStep = -1;
    const totalSteps = steps.length;
    let timerInterval;
    const cookTimeSeconds = 30 * 60; // 30 minutes

    // --- Toggle Visibility Functionality ---
    const toggleList = (list, button) => {
        const isCollapsed = list.classList.toggle('collapsed');
        button.textContent = isCollapsed ? 'Show' : 'Hide';
    };

    toggleIngredientsBtn.addEventListener('click', () => toggleList(ingredientsList, toggleIngredientsBtn));
    toggleInstructionsBtn.addEventListener('click', () => toggleList(instructionsList, toggleInstructionsBtn));

    // --- Cooking Flow Functionality ---
    const updateProgressBar = () => {
        if (currentStep >= 0) {
            const progressPercentage = ((currentStep + 1) / totalSteps) * 100;
            progressBar.style.width = `${progressPercentage}%`;
        } else {
            progressBar.style.width = '0%';
        }
    };

    const highlightStep = () => {
        steps.forEach((step, index) => {
            step.classList.remove('active-step');
            if (index === currentStep) {
                step.classList.add('active-step');
            }
        });
    };
    
    const startTimer = () => {
        clearInterval(timerInterval); // Clear any existing timer
        let timeLeft = cookTimeSeconds;
        timerDisplay.classList.remove('hidden');

        timerInterval = setInterval(() => {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerDisplay.textContent = "Time's Up!";
            }
        }, 1000);
    };

    startCookingBtn.addEventListener('click', () => {
        // Un-collapse instructions if they are hidden
        if (instructionsList.classList.contains('collapsed')) {
            toggleList(instructionsList, toggleInstructionsBtn);
        }
        
        currentStep = 0;
        highlightStep();
        updateProgressBar();
        startTimer();

        startCookingBtn.classList.add('hidden');
        nextStepBtn.classList.remove('hidden');
    });

    nextStepBtn.addEventListener('click', () => {
        currentStep++;
        if (currentStep < totalSteps) {
            highlightStep();
            updateProgressBar();
        } else {
            // Recipe finished
            alert('Congratulations! You finished the recipe. 🧑‍🍳');
            currentStep = -1;
            steps.forEach(step => step.classList.remove('active-step'));
            updateProgressBar();
            clearInterval(timerInterval);

            nextStepBtn.classList.add('hidden');
            startCookingBtn.classList.remove('hidden');
            timerDisplay.classList.add('hidden');
        }
    });

    // --- Bonus: Print Functionality ---
    printBtn.addEventListener('click', () => {
        // Ensure lists are visible for printing
        ingredientsList.classList.remove('collapsed');
        toggleIngredientsBtn.textContent = 'Hide';
        instructionsList.classList.remove('collapsed');
        toggleInstructionsBtn.textContent = 'Hide';
        
        // Use a small timeout to allow the DOM to update before printing
        setTimeout(() => {
            window.print();
        }, 100);
    });
});