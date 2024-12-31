// static/script.js
let sol = Array.from({ length: 9 }, () => Array(9).fill(0));
let unsolved = Array.from({ length: 9 }, () => Array(9).fill(0));
let control = 0;
function generateGrid(level) {
    sol = gridSudoku()[0];
    let grid = Array.from({ length: 9 }, () => Array(9).fill(0));
    for (let i = 0; i < 9; i++) {
        grid[i] = [...sol[i]];
    }
    console.log("grid", grid);
    let ugrid = unsolvedGrid(grid, level);
    displayGrid(ugrid);
    unsolved = ugrid;
    console.log("sol", sol);
    console.log(sol);
}
function solvedGrid() {
    if (control === 0){
        displayGrid(sol);
        control = 1;
    }
    else{
        displayGrid(unsolved);
        control = 0;
    }
}

function displayGrid(grid) {
    const container = document.getElementById('sudoku-grid');
    container.innerHTML = '';  // Clear previous grid

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('input');
            cell.type = 'text';
            cell.maxLength = 1;
            cell.value = grid[i][j] !== 0 ? grid[i][j] : '';
            if (grid[i][j] !== 0) {
                cell.readOnly = 'true';
            }
            cell.dataset.row = i;
            cell.dataset.col = j;

            if (j%3 === 0){cell.style.borderLeft = '3.5px solid black';}
            if (i%3 === 0){cell.style.borderTop = '3.5px solid black';}
            if (grid[i][j] !== 0) {
                cell.style.backgroundColor = '#d0d0d0';
            }
            if (i===8){cell.style.borderBottom = '3.5px solid black';}
            if (j===8){cell.style.borderRight = '3.5px solid black';}

            cell.onclick = function () {
                let value = cell.value;
                if (value === '') {
                    for (let i = 0; i < 9; i++) {
                        for (let j = 0; j < 9; j++) {
                            document.querySelector(`input[data-row="${i}"][data-col="${j}"]`).style.backgroundColor = '#ffffff';
                            if (grid[i][j] !== 0) {
                                document.querySelector(`input[data-row="${i}"][data-col="${j}"]`).style.backgroundColor = '#d0d0d0';
                            }
                            if (i === parseInt(cell.dataset.row) || j === parseInt(cell.dataset.col)) {
                                document.querySelector(`input[data-row="${i}"][data-col="${j}"]`).style.backgroundColor = 'rgb(222, 222, 240)';
                            }
                            if (i >= parseInt(cell.dataset.row) - parseInt(cell.dataset.row) % 3 && i < parseInt(cell.dataset.row) - parseInt(cell.dataset.row) % 3 + 3 && j >= parseInt(cell.dataset.col) - parseInt(cell.dataset.col) % 3 && j < parseInt(cell.dataset.col) - parseInt(cell.dataset.col) % 3 + 3) {
                                document.querySelector(`input[data-row="${i}"][data-col="${j}"]`).style.backgroundColor = 'rgb(195, 195, 220)';
                            }
                        }
                    }
                } else {
                    if (cell.style.backgroundColor == 'rgb(147, 147, 147)') {
                        for (let i = 0; i < 9; i++) {
                            for (let j = 0; j < 9; j++) {
                                if (grid[i][j] !== 0) {
                                    document.querySelector(`input[data-row="${i}"][data-col="${j}"]`).style.backgroundColor = '#d0d0d0';
                                }
                                else {
                                    if (document.querySelector(`input[data-row="${i}"][data-col="${j}"]`).style.backgroundColor == 'rgb(147, 147, 147)') {
                                    document.querySelector(`input[data-row="${i}"][data-col="${j}"]`).style.backgroundColor = '#ffffff';
                                    }
                                }
                            }
                        }
                        if (grid[cell.dataset.row][cell.dataset.col] !== 0) {
                            cell.style.backgroundColor = '#d0d0d0';
                        } else {
                            cell.style.backgroundColor = '#ffffff';
                        }
                    } else {
                        for (let i = 0; i < 9; i++) {
                            for (let j = 0; j < 9; j++) {
                                //set all the ciells with the same value to grey
                                // document.querySelector(`input[data-row="${i}"][data-col="${j}"]`).style.backgroundColor = '#ffffff';
                                if (unsolved[i][j] == parseInt(value)) {
                                    document.querySelector(`input[data-row="${i}"][data-col="${j}"]`).style.backgroundColor = 'rgb(147, 147, 147)';
                                } else {
                                    document.querySelector(`input[data-row="${i}"][data-col="${j}"]`).style.backgroundColor = '#ffffff';
                                    if (grid[i][j] !== parseInt(value) && grid[i][j] !== 0) {
                                        document.querySelector(`input[data-row="${i}"][data-col="${j}"]`).style.backgroundColor = '#d0d0d0';
                                    }
                                }
                                
                            }
                        }
                    }
                }
            }
            cell.oninput = function () {
                // checks if the input is a number
                if (!/^[1-9]$/.test(cell.value)) {
                    cell.value = '';
                    return;
                }
                checkGrid(cell);
            };

            container.appendChild(cell);
        }
    }
}

function checkGrid(cell) {
    const inputs = document.querySelectorAll('#sudoku-grid input');
    let grid = Array.from({ length: 9 }, () => Array(9).fill(0));

    inputs.forEach(input => {
        const row = input.dataset.row;
        const col = input.dataset.col;
        grid[row][col] = input.value ? parseInt(input.value) : 0;
    });
    unsolved = grid;

    let valid = checkGrid(grid)[1] && !check0InGrid(grid)[0];
    if (valid) {
            alert("Congratulations! Sudoku Solved!");
    }
    let validmove = checkGrid(grid);
    if (!validmove[1]) {
        let text = cell.value + " is not a valid move! " + "Check the " + data.validation[1] + " ;)";
        alert(text);
        cell.value = '';
    }
}

function gridSudoku() {
    let grid = Array(9).fill(Array(9).fill(0));
    let vector = Array.from({ length: 9 }, (_, i) => i + 1);

    for (let i = 0; i < 3; i++) {
        let shuffled = shuffle(vector);  // Shuffle a copy of the vector
        grid[i*3] = [...shuffled];  // Shuffle the row
        while (checkGrid1(grid)[1] === false) {
            shuffled = shuffle(vector);
            grid[i*3] = [...shuffled];
        }
    }
    
    let iter = 0;
    while (check0InGrid(grid)[0]) {
        iter++;
        for (let i = 0; i < 12; i++) {
            let c = randomChoice(Array.from({ length: 9 }, (_, i) => i ));
            let r = randomChoice(Array.from({ length: 9 }, (_, i) => i ));
            grid[r][c] = 0;
        }
        
        for (let i = 1; i < 9; i++) {
            let carray = Array(9).fill(0);
            carray = [...grid[i]];
            for (let j = 0; j < 9; j++) {
                if (grid[i][j] === 0) {
                    let choices = choicesInSubgridAndLines(grid, i, j);
                    let choice = randomChoice(choices);
                    let gchoice = true;
                    while (gchoice) {
                        if (choice === 0 || carray.includes(choice) === false) {
                            carray[j] = choice;
                            gchoice = false;
                        }
                        else {
                            let possible = false;
                            let i = 0;
                            for (i = 0; i < choices.length; i++) {
                                if (carray.includes(choices[i]) === false) {
                                    possible = true;
                                }
                            }
                            if (!possible) {
                                choice = 0;
                            } else {choice = randomChoice(choices);}
                        }
                    }
                        // console.log(i, j, "choices", randomChoice(choicesInSubgridAndLines(grid, i, j)));
                        // console.log("grid[i][j]", carray[j]);
                }
            }
            grid[i] = [...carray];

        }
        if (iter === 1000 && check0InGrid(grid)[1] > 0) {
            // sets everything to 0
            for (let i = 0; i < 9; i++) {
                grid[i] = Array(9).fill(0);
            }
            vector = Array.from({ length: 9 }, (_, i) => i + 1);

            for (let i = 0; i < 3; i++) {
                let shuffled = shuffle(vector);  // Shuffle a copy of the vector
                grid[i*3] = [...shuffled];  // Shuffle the row
                while (checkGrid1(grid)[1] === false) {
                    shuffled = shuffle(vector);
                    grid[i*3] = [...shuffled];
                }
            }
        }
        if (iter === 10000) {
            console.log("Too many iterations:", iter);
            console.log("nomber of 0s:", check0InGrid(grid)[1]);
            break;
        }
    }
    console.log("Check Grid:", checkGrid1(grid));
    console.log("Iterations:", iter);
    // console.log("Grid:", grid);
    return [grid, iter];
}

function check0InGrid(grid) {
    let number0 = 0;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (grid[i][j] === 0) number0++;
        }
    }
    // console.log("Number of 0s:", number0);
    return number0 !== 0 ? [true, number0] : [false, 0];
}

function choicesInSubgridAndLines(grid, row, col) {
    let subgrid = getSubgrid(grid, row, col);
    let vector = Array.from({ length: 9 }, (_, i) => i+1);

    subgrid.flat().forEach(val => {
        vector = vector.filter(v => v !== val);
    });
    grid[row].forEach(val => {
        vector = vector.filter(v => v !== val);
    });
    grid.forEach(r => {
        if (r[col] !== undefined) vector = vector.filter(v => v !== r[col]);
    });
    return vector.length === 0 || vector.length === 2 ? [0]*9 : vector;
}

function getSubgrid(grid, row, col) {
    let subgrid = Array.from({ length: 3 }, () => Array(3).fill(0));
    let r = Math.floor(row / 3) * 3;
    let c = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            subgrid[i][j] = grid[r + i][c + j];
        }
    }
    return subgrid;
}

function printGrid(grid) {
    grid.forEach(row => console.log(row.join(' ')));
}
function removeCells(grid, count) {
    for (let i = 0; i < count; i++) {
        let index1 = Math.floor(Math.random() * 9);
        let index2 = Math.floor(Math.random() * 9);
        let c = Array.from({ length: 9 }, (_, i) => i )[index1];
        let r = Array.from({ length: 9 }, (_, i) => i )[index2];
        grid[r][c] = 0;
    }
}
function unsolvedGrid(grid, level) {
    if (level === 1) removeCells(grid, 40);
    else if (level === 2) removeCells(grid, 60);
    else if (level === 3) {
        while (check0InGrid(grid)[1] < 52) {
            removeCells(grid, 15);
        }
    }
    console.log("Count numbers:", 81 - check0InGrid(grid)[1]);
    return grid;
}


function checkCell(grid, row, col, number) {
    for (let c = 0; c < 9; c++) {
        if ((grid[row][c] === number && c !== col) && grid[row][c] !== 0) {
            console.log("Problem in row:", grid[row]);
            return ["ligne", false];
        }
    }

    for (let r = 0; r < 9; r++) {
        if ((grid[r][col] === number && r !== row) && grid[r][col] !== 0) {
            console.log("Problem in column:", grid.map(r => r[col]));
            return ["colonne", false];
        }
    }

    let subgrid = getSubgrid(grid, row, col);
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if ((subgrid[i][j] === number && (i !== row % 3 || j !== col % 3)) && subgrid[i][j] !== 0) {
                console.log("Problem in subgrid:", subgrid);
                return ["sous-grille", false];
            }
        }
    }
    return ["ok", true];
}

function checkGrid1(grid) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let result = checkCell(grid, i, j, grid[i][j]);
            if (!result[1]) return result;
        }
    }
    return ["ok", true];
}
function checkGrid(cell) {
    const inputs = document.querySelectorAll('#sudoku-grid input');
    let grid = Array.from({ length: 9 }, () => Array(9).fill(0));

    inputs.forEach(input => {
        const row = input.dataset.row;
        const col = input.dataset.col;
        grid[row][col] = input.value ? parseInt(input.value) : 0;
    });
    unsolved = grid;
    //validate
    // console.log(data.valid);
    valid = checkGrid1(grid)[1] && !check0InGrid(grid)[0];
    console.log("data valid is " + valid);
    if (valid) {
        alert("Félicitation le Sudoku est résolu !");
    }


    //validate move
    let validation = checkGrid1(grid);
    console.log(validation);
    if (!validation[1]) {
        let text = "Le " + cell.value + " n'est pas possible. " + "Regarde bien la " + validation[0] + " ;)";
        alert(text);
        cell.value = '';
    }
}

function shuffle(array) {
    let currentIndex = array.length;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
}

function randomChoice(array) {
    let n = 0;
    for (let i = 0; i < array.length; i++) {
        if (array[i] !== 0) {
            n++;
        }
    }
    if (n === 0) return 0;
    let index = Math.floor(Math.random() * (array.length));
    while (array[index] === 0) {
        index = Math.floor(Math.random() * (array.length));

    }
    return array[index];
}

// printGrid(unsolvedGrid(gridSudoku()[0], 3));