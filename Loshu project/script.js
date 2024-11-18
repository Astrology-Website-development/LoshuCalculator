// Map of Lo Shu grid positions
const loShuGridPositions = {
  1: { row: 2, col: 1 },
  2: { row: 0, col: 2 },
  3: { row: 1, col: 0 },
  4: { row: 0, col: 0 },
  5: { row: 1, col: 1 },
  6: { row: 2, col: 2 },
  7: { row: 1, col: 2 },
  8: { row: 2, col: 0 },
  9: { row: 0, col: 1 },
};

// Map alphabet letters to numerology values
const alphabetValues = {
  A: 1,
  I: 1,
  J: 1,
  Y: 1,
  Q: 1,
  B: 2,
  K: 2,
  R: 2,
  C: 3,
  L: 3,
  S: 3,
  G: 3,
  D: 4,
  M: 4,
  T: 4,
  E: 5,
  H: 5,
  N: 5,
  X: 5,
  U: 6,
  V: 6,
  W: 6,
  O: 7,
  Z: 7,
  F: 8,
  P: 8,
};

// Function to format date from DD/MM/YYYY to ISO (YYYY-MM-DD)
function formatDateToISO(dateString) {
  const [day, month, year] = dateString.split("/");
  return `${year}-${month}-${day}`;
}

// Extract numbers from input (name or date)
function extractNumbers(input) {
  const numbers = [];
  for (const char of input
    .replaceAll("-", "")
    .replaceAll(" ", "")
    .toUpperCase()) {
    if (/[A-Z]/.test(char)) {
      numbers.push(alphabetValues[char] || 0); // Map alphabet to numerology value
    } else if (/\d/.test(char)) {
      numbers.push(parseInt(char, 10)); // Add numeric values directly
    }
  }
  return numbers;
}

// Display the Lo Shu Grid
function displayGrid(grid) {
  const gridContainer = document.getElementById("grid");
  gridContainer.innerHTML = ""; // Clear previous grid

  grid.forEach((row) => {
    row.forEach((cell) => {
      const cellDiv = document.createElement("div");
      cellDiv.textContent = cell.join(", ") || ""; // Display numbers or empty
      cellDiv.className = "grid-cell"; // Add class for styling
      gridContainer.appendChild(cellDiv);
    });
  });
}

// Calculate and display results
function calculateResults(grid, dob) {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = ""; // Clear previous results

  // Planes and their respective numbers
  const planes = [
    { name: "Thought Plane (4, 3, 8)", numbers: [4, 3, 8] },
    { name: "Action Plane (2, 7, 6)", numbers: [2, 7, 6] },
    { name: "Success Plane 1 (2, 5, 8)", numbers: [2, 5, 8] },
    { name: "Success Plane 2 (4, 5, 6)", numbers: [4, 5, 6] },
    { name: "Will Plane (9, 5, 1)", numbers: [9, 5, 1] },
    { name: "Mental Plane (4, 9, 2)", numbers: [4, 9, 2] },
    { name: "Emotional Plane (3, 5, 7)", numbers: [3, 5, 7] },
    { name: "Practical Plane (8, 1, 6)", numbers: [8, 1, 6] },
  ];

  planes.forEach((plane) => {
    const count = plane.numbers.filter((num) =>
      grid.flat(2).includes(num)
    ).length;
    const percentage = Math.round((count / plane.numbers.length) * 100);
    addResult(`${plane.name}: ${percentage}%`, resultsContainer);
  });

  // Calculate and display additional numerology values
  const day = parseInt(dob.split("-")[2]);
  const mindNumber = reduceToSingleDigit(day);
  addResult(`Mind Number (Basic): ${mindNumber}`, resultsContainer);

  const bodyNumber = reduceToSingleDigit(
    [...dob.replaceAll("-", "")].reduce(
      (sum, digit) => sum + parseInt(digit),
      0
    )
  );
  addResult(`Body Number (Destiny): ${bodyNumber}`, resultsContainer);

  const year = parseInt(dob.split("-")[0]);
  const kuaNumber = reduceToSingleDigit(year);
  addResult(`Kua Number: ${kuaNumber}`, resultsContainer);

  const combination = `D-${mindNumber}/C-${bodyNumber}`;
  addResult(`Combination: ${combination}`, resultsContainer);
}

// Helper function to add a result
function addResult(text, container) {
  const resultDiv = document.createElement("div");
  resultDiv.className = "result";
  resultDiv.textContent = text;
  container.appendChild(resultDiv);
}

// Reduce a number to a single digit
function reduceToSingleDigit(num) {
  while (num > 9) {
    num = [...num.toString()].reduce((sum, digit) => sum + parseInt(digit), 0);
  }
  return num;
}

// Generate Lo Shu Grid based on DOB and Name
function generateLoShuGrid() {
  const dob = document.getElementById("dob").value;
  const name = document.getElementById("name").value;

  // Validate date format
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dob)) {
    alert("Please enter a valid date in DD/MM/YYYY format!");
    return;
  }

  const formattedDOB = formatDateToISO(dob); // Convert date to ISO format
  const dobNumbers = extractNumbers(formattedDOB);
  const nameNumbers = extractNumbers(name);
  const allNumbers = [...dobNumbers, ...nameNumbers];

  // Initialize a 3x3 grid
  const grid = Array(3)
    .fill(null)
    .map(() => Array(3).fill([]));

  // Populate grid with numbers
  for (const number of allNumbers) {
    if (loShuGridPositions[number]) {
      const { row, col } = loShuGridPositions[number];
      grid[row][col] = [...grid[row][col], number];
    }
  }

  // Display grid and results
  displayGrid(grid);
  calculateResults(grid, formattedDOB);
}

function clearResults() {
  // Clear the grid and results sections
  const gridContainer = document.getElementById("grid");
  const resultsContainer = document.getElementById("results");
  gridContainer.innerHTML = "";
  resultsContainer.innerHTML = "";

  // Clear the input fields
  document.getElementById("dob").value = "";
  document.getElementById("name").value = "";
}
