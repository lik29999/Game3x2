/**
 * Validates if the player's expression equals the target number
 * @param {number[]} numbers - Array of 4 numbers provided by the game
 * @param {string[]} operators - Array of 3 operators chosen by the player
 * @param {number} target - The target number to reach
 * @returns {object} { isCorrect: boolean, result: number, error: string|null }
 */
export const validateAnswer = (numbers, operators, target) => {
  try {
    // Validate inputs
    if (!Array.isArray(numbers) || numbers.length !== 4) {
      return { isCorrect: false, result: null, error: 'Must use exactly 4 numbers' };
    }

    if (!Array.isArray(operators) || operators.length !== 3) {
      return { isCorrect: false, result: null, error: 'Must use exactly 3 operators' };
    }

    // Check if all operators are valid
    const validOperators = ['+', '-', '*', '/'];
    const invalidOps = operators.filter(op => !validOperators.includes(op));
    if (invalidOps.length > 0) {
      return { isCorrect: false, result: null, error: `Invalid operators: ${invalidOps.join(', ')}` };
    }

    // Calculate result following order of operations (PEMDAS/BODMAS)
    const result = evaluateExpression(numbers, operators);

    // Check for division by zero or invalid calculation
    if (result === null) {
      return { isCorrect: false, result: null, error: 'Division by zero or invalid calculation' };
    }

    // Check if result matches target
    const isCorrect = Math.abs(result - target) < 0.0001; // Handle floating point precision

    return {
      isCorrect,
      result: Math.round(result * 10000) / 10000, // Round to 4 decimal places
      error: null
    };
  } catch (error) {
    return { isCorrect: false, result: null, error: `Error: ${error.message}` };
  }
};

/**
 * Evaluates an expression with given numbers and operators
 * Follows mathematical order of operations (PEMDAS/BODMAS)
 * @param {number[]} numbers - Array of 4 numbers
 * @param {string[]} operators - Array of 3 operators
 * @returns {number|null} Calculated result or null if error
 */
const evaluateExpression = (numbers, operators) => {
  // Create a copy to avoid mutating original arrays
  let nums = [...numbers];
  let ops = [...operators];

  // First pass: handle multiplication and division (left to right)
  for (let i = 0; i < ops.length; i++) {
    if (ops[i] === '*' || ops[i] === '/') {
      let result;

      if (ops[i] === '*') {
        result = nums[i] * nums[i + 1];
      } else { // division
        if (nums[i + 1] === 0) {
          return null; // Division by zero
        }
        result = nums[i] / nums[i + 1];
      }

      // Replace the two numbers with the result
      nums.splice(i, 2, result);
      ops.splice(i, 1);
      i--; // Adjust index after splicing
    }
  }

  // Second pass: handle addition and subtraction (left to right)
  let finalResult = nums[0];
  for (let i = 0; i < ops.length; i++) {
    if (ops[i] === '+') {
      finalResult += nums[i + 1];
    } else if (ops[i] === '-') {
      finalResult -= nums[i + 1];
    }
  }

  return finalResult;
};

/**
 * Generates a random set of 4 numbers for the game
 * @returns {number[]} Array of 4 random numbers between 1-99
 */
export const generateNumbers = () => {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 99) + 1);
};

/**
 * Generates a random target number based on the given numbers
 * @param {number[]} numbers - The game numbers
 * @returns {number} A target number (sum of all numbers, or a reasonable target)
 */
export const generateTarget = (numbers) => {
  const sum = numbers.reduce((a, b) => a + b, 0);
  const randomVariation = Math.floor(Math.random() * 100) - 50; // -50 to +50
  return Math.max(1, sum + randomVariation);
};

/**
 * Formats an expression as a readable string
 * @param {number[]} numbers - Array of numbers
 * @param {string[]} operators - Array of operators
 * @returns {string} Formatted expression
 */
export const formatExpression = (numbers, operators) => {
  let expression = `${numbers[0]}`;
  for (let i = 0; i < operators.length; i++) {
    expression += ` ${operators[i]} ${numbers[i + 1]}`;
  }
  return expression;
};
