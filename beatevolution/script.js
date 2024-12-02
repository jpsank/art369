
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
let isPlaying = false;

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
            <h2>--------- Beat ${index + 1} ---- <span class="small">BPM ${beat.bpm}</span></h2>
            <div class='row'>
                <div class='pattern'>
                    <pre class='kick'>${renderPattern(beat.kick, on="K")}</pre>
                    <pre class='snare'>${renderPattern(beat.snare, on="S")}</pre>
                    <pre class='hihat'>${renderPattern(beat.hiHat, on="H")}</pre>
                    <pre class='bass'>${renderPattern(beat.bass, on="B")}</pre>
                </div>
                <button class="play" onclick="playBeat(${index})">▶</button>
            </div>
            <div class='row'>
                <input type="checkbox" id="selectBeat${index}"><span class="small">SELECT FOR BREEDING</span>
            </div>
        `;
        beatsContainer.appendChild(beatDiv);
    });
}

function renderPattern(pattern, on="■") {
    return pattern.split('').map((step, i) => 
        `<span class="i${i} ${step === '1' ? 'active' : ''}">${step === '1' ? on : ' '}</span>`
    ).join('');
}

// Function to simulate playing a beat (console log in this case)
function playBeat(index) {
    const beatDiv = document.getElementById(`beat${index}`);
    const button = beatDiv.getElementsByTagName('button')[0];

    // Pause the beat if it is already playing
    if (button.innerText === '⏸') {
        pause();
        button.classList.remove('playing');
        button.innerText = '▶';
        return;
    }

    // Prevent playing multiple beats simultaneously
    if (isPlaying) {
        return;
    }

    // Play the beat
    isPlaying = true;
    console.log(`Playing Beat ${index + 1}:`, population[index]);
    button.classList.add('playing');

    // Play the sound effects simultaneously
    const beat = population[index];
    for (let i = 0; i < patternLength; i++) {

        // Highlight the current step
        timeoutIds.push(setTimeout(() => {
            for (let el of beatDiv.getElementsByClassName(`i${i}`)) {
                el.classList.add('current');
            }
        }, (60 / beat.bpm / 4) * i * 1000));
        timeoutIds.push(setTimeout(() => {
            for (let el of beatDiv.getElementsByClassName(`i${i}`)) {
                el.classList.remove('current');
            }
        }, (60 / beat.bpm / 4) * (i+1) * 1000));

        // Change background color of the beat pattern depending on the sound effect
        timeoutIds.push(setTimeout(() => {
            beatDiv.getElementsByClassName('kick')[0].style.backgroundColor = beat.kick[i] === '1' ? 'rgba(255, 0, 0, 0.5)' : '';
            beatDiv.getElementsByClassName('snare')[0].style.backgroundColor = beat.snare[i] === '1' ? 'rgba(0, 255, 0, 0.5)' : '';
            beatDiv.getElementsByClassName('hihat')[0].style.backgroundColor = beat.hiHat[i] === '1' ? 'rgba(0, 0, 255, 0.5)' : '';
            beatDiv.getElementsByClassName('bass')[0].style.backgroundColor = beat.bass[i] === '1' ? 'rgba(255, 255, 0, 0.5)' : '';
        }, (60 / beat.bpm / 4) * i * 1000));

        // Play the sound effect if the pattern has a '1' at the current step
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
    timeoutIds.push(setTimeout(() => {
        button.classList.remove('playing');
        button.innerText = '▶';

        // Reset the background color of the beat pattern
        beatDiv.getElementsByClassName('kick')[0].style.backgroundColor = '';
        beatDiv.getElementsByClassName('snare')[0].style.backgroundColor = '';
        beatDiv.getElementsByClassName('hihat')[0].style.backgroundColor = '';
        beatDiv.getElementsByClassName('bass')[0].style.backgroundColor = '';

        isPlaying = false;
    }, (60 / beat.bpm / 4) * patternLength * 1000));
    button.innerText = '⏸';
}

// Function to pause the beat
function pause() {
    isPlaying = false;
    timeoutIds.forEach((id) => clearTimeout(id));
    timeoutIds.length = 0;
    for (let el of document.querySelectorAll(`[class^="i"][class*="current"]`)) {
        el.classList.remove('current');
    }
    // Reset the background color of the beat pattern
    for (let el of document.querySelectorAll('.kick, .snare, .hihat, .bass')) {
        el.style.backgroundColor = '';
    }
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
