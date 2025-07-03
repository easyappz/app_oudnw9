const express = require('express');

// Для работы с базой данных
const mongoDb = global.mongoDb;

const router = express.Router();

// GET /api/hello
router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from API!' });
});

// GET /api/status
router.get('/status', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// POST /api/calculate
router.post('/calculate', (req, res) => {
  try {
    const { num1, num2, operation } = req.body;

    // Проверка на наличие всех необходимых данных
    if (!num1 || !num2 || !operation) {
      return res.status(400).json({ error: 'Missing required parameters: num1, num2, and operation are required' });
    }

    // Преобразование входных данных в числа
    const number1 = parseFloat(num1);
    const number2 = parseFloat(num2);

    // Проверка на корректность чисел
    if (isNaN(number1) || isNaN(number2)) {
      return res.status(400).json({ error: 'Invalid numbers provided' });
    }

    let result;

    // Выполнение операции
    switch (operation) {
      case 'add':
        result = number1 + number2;
        break;
      case 'subtract':
        result = number1 - number2;
        break;
      case 'multiply':
        result = number1 * number2;
        break;
      case 'divide':
        if (number2 === 0) {
          return res.status(400).json({ error: 'Division by zero is not allowed' });
        }
        result = number1 / number2;
        break;
      default:
        return res.status(400).json({ error: 'Invalid operation. Use add, subtract, multiply, or divide' });
    }

    // Возврат результата
    res.json({ result });
  } catch (error) {
    console.error('Calculation error:', error);
    res.status(500).json({ error: 'Internal server error during calculation' });
  }
});

module.exports = router;
