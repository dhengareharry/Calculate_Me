let string = "";
let buttons = document.querySelectorAll('.button');
const input = document.querySelector('input');

Array.from(buttons).forEach((button) => {
  button.addEventListener('click', (e) => {
    const buttonValue = e.target.innerHTML;

    if (buttonValue === '=') {
      try {
        const result = evaluateExpression(string);
        input.value = result;
        string = ""; // Reset the string
      } catch (error) {
        input.value = "Error";
      }
    } else if (buttonValue === 'AC') {
      string = '';
      input.value = string;
    } else {
      string += buttonValue;
      input.value = string;
    }
  });
});

function evaluateExpression(string) {
  while (string.includes('(')) {
    const startIndex = string.lastIndexOf('(');
    const endIndex = string.indexOf(')', startIndex);

    if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
      throw new Error('Invalid string');
    }

    const subExpression = string.substring(startIndex + 1, endIndex);
    const subResult = evaluate(subExpression);
    string = string.replace(`(${subExpression})`, subResult);
  }

  return evaluate(string);
}

function evaluate(string) {
  const terms = string.split('+');
  let result = 0;

  for (let term of terms) {
    if (term.includes('-')) {
      const subTerms = term.split('-');
      let subResult = evaluate(subTerms[0]);

      for (let i = 1; i < subTerms.length; i++) {
        subResult -= evaluate(subTerms[i]);
      }

      result += subResult;
    } else {
      result += evaluateTerm(term);
    }
  }

  return result;
}

function evaluateTerm(term) {
  const factors = term.split('*');
  let result = 1;

  for (let factor of factors) {
    if (factor.includes('/')) {
      const divisors = factor.split('/');
      let divisorResult = evaluate(divisors[0]);

      for (let i = 1; i < divisors.length; i++) {
        const divisor = evaluate(divisors[i]);
        if (divisor !== 0) {
          divisorResult /= divisor;
        } else {
          throw new Error('Division by zero');
        }
      }

      result *= divisorResult;
    } else {
      result *= parseFloat(factor);
    }
  }

  return result;
}
