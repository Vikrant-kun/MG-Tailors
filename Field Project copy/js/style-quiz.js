document.addEventListener('DOMContentLoaded', () => {
    const quizContainer = document.getElementById('quiz-container');
    const questions = document.querySelectorAll('.quiz-question');
    const options = document.querySelectorAll('.quiz-options .option');
    const resultsContainer = document.getElementById('quiz-results');
    const resultsGrid = document.getElementById('results-grid');
    const apiKey = 'wYFzoEBGM7LEVGhR-gjKlMSgRlXl9zy4AoidpzlH_g8';

    let currentQuestion = 0;
    const scores = {
        wedding: 0, party: 0, casual: 0,
        classic: 0, bold: 0, minimalist: 0,
        royal: 0, pastel: 0, earthy: 0
    };

    options.forEach(option => {
        option.addEventListener('click', () => {
            const style = option.dataset.style;
            scores[style]++;
            
            option.parentElement.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');

            setTimeout(() => {
                goToNextQuestion();
            }, 400);
        });
    });

    function goToNextQuestion() {
        questions[currentQuestion].classList.remove('active');
        currentQuestion++;
        if (currentQuestion < questions.length) {
            questions[currentQuestion].classList.add('active');
        } else {
            showResults();
        }
    }

    async function showResults() {
        quizContainer.style.display = 'none';
        resultsContainer.style.display = 'block';

        let topStyle = '';
        let maxScore = 0;
        for (const style in scores) {
            if (scores[style] > maxScore) {
                maxScore = scores[style];
                topStyle = style;
            }
        }
        
        const query = `${topStyle} indian fashion clothing`;
        
        try {
            const response = await fetch(`https://api.unsplash.com/search/photos?query=${query}&per_page=9&client_id=${apiKey}`);
            const data = await response.json();
            const photos = data.results;

            resultsGrid.innerHTML = '';
            photos.forEach(photo => {
                const item = document.createElement('div');
                item.className = 'gallery-item';
                item.innerHTML = `<img src="${photo.urls.small}" alt="${photo.alt_description}">`;
                resultsGrid.appendChild(item);
            });

        } catch (error) {
            console.error('Error fetching results:', error);
            resultsGrid.innerHTML = '<p>Could not load style recommendations.</p>';
        }
    }
});