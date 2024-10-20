// The script remains unchanged
const arrayContainer = document.getElementById('array-container');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const infoText = document.getElementById('info');
const instructionsText = document.getElementById('instructions');
let initialArray = [64, 34, 25, 12, 22, 11, 90];
let array = [...initialArray];
let isAnimating = false;
let sortGenerator = null;

function createArrayItems() {
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
            instructionsText.style.display = 'none';
        }
    }
}

function resetArray() {
    array = [...initialArray];
    createArrayItems();
    updateVariables();
    infoText.textContent = "Array reset. Click 'Start Shell Sort' to begin the visualization.";
    startBtn.disabled = false;
    isAnimating = false;
}

startBtn.addEventListener('click', () => {
    if (!isAnimating) {
        isAnimating = true;
        startBtn.disabled = true;
        resetBtn.disabled = true;
        instructionsText.style.display = 'block';
        sortGenerator = shellSortGenerator();
        nextStep();
    }
});

resetBtn.addEventListener('click', resetArray);

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' && isAnimating) {
        nextStep();
    }
});

document.addEventListener('touchstart', (event) => {
    if (isAnimating) {
        nextStep();
    }
});

createArrayItems();