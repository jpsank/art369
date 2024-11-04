
// Load sound effects
const sounds = {
    kick: new Audio('sounds/Capital DK - Mercy.wav'),
    snare: new Audio('sounds/Capital DK - Case.wav'),
    hiHat: new Audio('sounds/Capital DK - Crackle.wav'),
    bass: new Audio('sounds/Capital DK - Chocolate.wav')
};


// Initialize a population of beats
let population = [];
const beatCount = 8; // Number of beats in each generation
const beatsContainer = document.getElementById('beatsContainer');
const patternLength = 32; // Length of each beat pattern

const timeoutIds = [];

function createRandomPattern() {
    return Array.from({ length: patternLength }, () => (Math.random() < 0.5 ? 1 : 0)).join('');
}

// Function to create a random beat pattern
function createRandomBeat() {
    return {
        kick: createRandomPattern(), // Random kick pattern
        snare: createRandomPattern(), // Random snare pattern
        hiHat: createRandomPattern(), // Random hi-hat pattern
        bass: createRandomPattern(), // Random bass pattern
        bpm: Math.round(Math.random() * 100 + 50) // Random BPM between 50 and 150
    };
}

// Function to generate the initial population of beats
function generateInitialPopulation() {
    for (let i = 0; i < beatCount; i++) {
        population.push(createRandomBeat());
    }
    displayBeats();
}

// Function to display beats on the page
function displayBeats() {
    beatsContainer.innerHTML = ''; // Clear previous beats
    population.forEach((beat, index) => {
        const beatDiv = document.createElement('div');
        beatDiv.className = 'beat';
        beatDiv.id = `beat${index}`;
        beatDiv.innerHTML = `
            <h2>Beat ${index + 1}</h2>
            <pre>${beat.kick}</pre>
            <pre>${beat.snare}</pre>
            <pre>${beat.hiHat}</pre>
            <pre>${beat.bass}</pre>
            <p>BPM: ${beat.bpm}</p>
            <button onclick="playBeat(${index})">Play</button>
            <input type="checkbox" id="selectBeat${index}"> Select
        `;
        beatsContainer.appendChild(beatDiv);
    });
}

// Function to simulate playing a beat (console log in this case)
function playBeat(index) {
    console.log(`Playing Beat ${index + 1}:`, population[index]);
    const beatDiv = document.getElementById(`beat${index}`);
    const button = beatDiv.getElementsByTagName('button')[0];
    if (button.innerText === 'Pause') {
        pause();
        button.innerText = 'Play';
        return;
    }

    // Play the sound effects simultaneously
    const beat = population[index];
    for (let i = 0; i < patternLength; i++) {
        if (beat.kick[i] === '1') {
            timeoutIds.push(setTimeout(() => sounds.kick.play(), (60 / beat.bpm / 4) * i * 1000));
        }
        if (beat.snare[i] === '1') {
            timeoutIds.push(setTimeout(() => sounds.snare.play(), (60 / beat.bpm / 4) * i * 1000));
        }
        if (beat.hiHat[i] === '1') {
            timeoutIds.push(setTimeout(() => sounds.hiHat.play(), (60 / beat.bpm / 4) * i * 1000));
        }
        if (beat.bass[i] === '1') {
            timeoutIds.push(setTimeout(() => sounds.bass.play(), (60 / beat.bpm / 4) * i * 1000));
        }
    }
    button.innerText = 'Pause';
}

// Function to pause the beat
function pause() {
    timeoutIds.forEach((id) => clearTimeout(id));
    timeoutIds.length = 0;
}

// Function to evolve beats based on user selection
function evolveBeats() {
    const selectedBeats = population.filter((beat, index) => {
        const checkbox = document.getElementById(`selectBeat${index}`);
        return checkbox && checkbox.checked;
    });

    if (selectedBeats.length === 0) {
        alert('Please select at least one beat to evolve!');
        return;
    }

    const newPopulation = [];
    while (newPopulation.length < beatCount) {
        const parent1 = selectedBeats[Math.floor(Math.random() * selectedBeats.length)];
        const parent2 = selectedBeats[Math.floor(Math.random() * selectedBeats.length)];
        newPopulation.push(mutate(crossover(parent1, parent2)));
    }

    population = newPopulation;
    displayBeats();
}

// Function to clamp a value between a minimum and maximum
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

// Function to mutate a beat pattern
function mutate(beat) {
    const mutationRate = 0.1; // Mutation rate: 10%
    return {
        kick: beat.kick.split('').map((gene) => (Math.random() < mutationRate ? 1 - gene : gene)).join(''),
        snare: beat.snare.split('').map((gene) => (Math.random() < mutationRate ? 1 - gene : gene)).join(''),
        hiHat: beat.hiHat.split('').map((gene) => (Math.random() < mutationRate ? 1 - gene : gene)).join(''),
        bass: beat.bass.split('').map((gene) => (Math.random() < mutationRate ? 1 - gene : gene)).join(''),
        bpm: clamp(beat.bpm + Math.round(Math.random() * 20 - 10), 50, 150) // Mutate BPM by up to ±10
        
    };
}

// Function to perform 2-point crossover
function crossover2pt(array1, array2) {
    const length = array1.length;
    const start = Math.floor(Math.random() * length);
    const end = Math.floor(Math.random() * (length - start)) + start;
    const child1 = [...array1.slice(0, start), ...array2.slice(start, end), ...array1.slice(end)];
    const child2 = [...array2.slice(0, start), ...array1.slice(start, end), ...array2.slice(end)];
    return [child1, child2];
}

// Function to combine two beats (crossover)
function crossover(parent1, parent2) {
    return {
        kick: crossover2pt(parent1.kick, parent2.kick)[Math.random() < 0.5 ? 0 : 1].join(''),
        snare: crossover2pt(parent1.snare, parent2.snare)[Math.random() < 0.5 ? 0 : 1].join(''),
        hiHat: crossover2pt(parent1.hiHat, parent2.hiHat)[Math.random() < 0.5 ? 0 : 1].join(''),
        bass: crossover2pt(parent1.bass, parent2.bass)[Math.random() < 0.5 ? 0 : 1].join(''),
        bpm: Math.random() < 0.5 ? parent1.bpm : parent2.bpm
    };
}

// Event listener for the evolve button
document.getElementById('evolveButton').addEventListener('click', evolveBeats);

// Generate the initial population when the page loads
generateInitialPopulation();
