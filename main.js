const inputContainer = document.getElementById('inputContainer');
const arrayInput = document.getElementById('arrayInput');
const arrayContainer = document.getElementById('array-container');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const newBtn = document.getElementById('new-btn');
const randBtn = document.getElementById('rand-btn');
const submitBtn = document.getElementById('submit-btn');
const refreshBtn = document.getElementById('refresh-btn');
const infoText = document.getElementById('info');
const instructionsText = document.getElementById('instructions');
let initialArray = [];
let array = [...initialArray];
let isAnimating = false;
let sortGenerator = null;
operateButtons.style.display = "none";
inputContainer.style.display = "none";


function createArrayItems(array) {
    arrayContainer.innerHTML = '';
    array.forEach((value, index) => {
        const item = document.createElement('div');
        item.className = 'array-item';
        item.textContent = value;
        item.id = `item-${index}`;
        arrayContainer.appendChild(item);
    });
}

function updateVariables(gap, i, j, temp) {
    document.getElementById('gap-value').textContent = gap !== undefined ? gap : 'N/A';
    document.getElementById('i-value').textContent = i !== undefined ? i : 'N/A';
    document.getElementById('j-value').textContent = j !== undefined ? j : 'N/A';
    document.getElementById('temp-value').textContent = temp !== undefined ? temp : 'N/A';
}

function* shellSortGenerator() {
    console.log(array);
    let n = array.length;
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        updateVariables(gap);
        yield `Current gap size: ${gap}`;
        for (let i = gap; i < n; i++) {
            updateVariables(gap, i);
            let temp = array[i];
            let j = i;
            updateVariables(gap, i, j, temp);
            while (j >= gap) {
                yield* compare(j, j - gap);
                if (array[j - gap] > temp) {
                    yield* swap(j, j - gap);
                    array[j] = array[j - gap];
                    j -= gap;
                } else {
                    yield `No swap needed. ${array[j - gap]} is not greater than ${temp}`;
                    break;
                }
                updateVariables(gap, i, j, temp);
            }
            if (j !== i) {
                array[j] = temp;
                updateArrayItem(j, temp);
                yield `Updated element at index ${j} to ${temp}`;
            }
        }
    }
    updateVariables();
    yield 'Shell Sort completed!';
}

function* compare(index1, index2) {
    const item1 = document.getElementById(`item-${index1}`);
    const item2 = document.getElementById(`item-${index2}`);
    item1.classList.add('comparing');
    item2.classList.add('comparing');
    yield `Comparing elements at indices ${index2} (${array[index2]}) and ${index1} (${array[index1]})`;
    item1.classList.remove('comparing');
    item2.classList.remove('comparing');
}

function* swap(index1, index2) {
    const item1 = document.getElementById(`item-${index1}`);
    const item2 = document.getElementById(`item-${index2}`);
    item1.classList.add('swapping');
    item2.classList.add('swapping');
    yield `Swapping elements at indices ${index2} (${array[index2]}) and ${index1} (${array[index1]})`;
    const tempContent = item1.textContent;
    item1.textContent = item2.textContent;
    item2.textContent = tempContent;
    item1.classList.remove('swapping');
    item2.classList.remove('swapping');
}

function updateArrayItem(index, value) {
    const item = document.getElementById(`item-${index}`);
    item.textContent = value;
}

function nextStep() {
    if (sortGenerator) {
        const result = sortGenerator.next();
        if (!result.done) {
            infoText.textContent = result.value;
        } else {
            sortGenerator = null;
            isAnimating = false;
            startBtn.disabled = false;
            resetBtn.disabled = false;
            newBtn.disabled = false;
            instructionsText.style.display = 'none';
        }
        
    }
}

function resetArray() {
    array = [...initialArray]
    createArrayItems(array);
    updateVariables();
    infoText.textContent = "Array reset. Click 'Start Shell Sort' to begin the visualization.";
    startBtn.disabled = false;
    newBtn.disabled = false;
    resetBtn.style.display = 'none';
    isAnimating = false;
}

startBtn.addEventListener('click', () => {
    if (!isAnimating) {
        isAnimating = true;
        startBtn.disabled = true;
        newBtn.disabled = true;
        randBtn.disabled = true;
        instructionsText.style.display = 'block';
        sortGenerator = shellSortGenerator();
        nextStep(array);
    }
});

resetBtn.addEventListener('click', resetArray);

newBtn.addEventListener('click', () => {
    arrayContainer.innerHTML = '';
    inputContainer.style.display = 'block';
});

randBtn.addEventListener('click', () => {
    initialArray = [64, 34, 25, 12, 22, 11, 90];
    array = [...initialArray];
    inputContainer.style.display = 'none';
    createArrayItems(array);
    operateButtons.style.display = "block";
    arrayButtons.style.display = "none";
});

submitBtn.addEventListener('click', () => {
    const inputValue = arrayInput.value.trim();
    if (inputValue) {
        initialArray = inputValue.split(',').map(item => parseInt(item.trim()));
        array = [...initialArray];
        createArrayItems(array);
        inputContainer.style.display = 'none';
        arrayInput.value = '';
    }
    operateButtons.style.display = "block";
    arrayButtons.style.display = "none";
});

refreshBtn.addEventListener('click', () => {
    location.reload()
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' && isAnimating) {
        resetBtn.style.display = 'inline';
        nextStep();
    }
});

document.addEventListener('touchstart', (event) => {
    if (isAnimating) {
        resetBtn.style.display = 'inline';
        nextStep();
    }
});


