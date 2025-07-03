import React, { useState } from 'react';
import { Box, Button, Grid, Paper, TextField, Typography } from '@mui/material';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForSecondValue, setWaitingForSecondValue] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNumberClick = (value) => {
    if (display === '0' && value !== '.') {
      setDisplay(value);
    } else {
      // Prevent multiple decimal points
      if (value === '.' && display.includes('.')) {
        return;
      }
      setDisplay(display + value);
    }
    setWaitingForSecondValue(false);
  };

  const handleOperationClick = (op) => {
    setPreviousValue(parseFloat(display));
    setOperation(op);
    setWaitingForSecondValue(true);
    setDisplay('0');
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForSecondValue(false);
    setError('');
  };

  const handleEqual = async () => {
    if (previousValue === null || operation === null) return;

    const currentValue = parseFloat(display);
    let operationType = '';

    if (operation === '+') {
      operationType = 'add';
    } else if (operation === '-') {
      operationType = 'subtract';
    } else if (operation === '*') {
      operationType = 'multiply';
    } else if (operation === '/') {
      operationType = 'divide';
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          num1: previousValue,
          num2: currentValue,
          operation: operationType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setDisplay(data.result.toString());
        setPreviousValue(null);
        setOperation(null);
        setWaitingForSecondValue(false);
      } else {
        setError(data.error || 'Calculation failed');
        setDisplay('Error');
      }
    } catch (err) {
      setError('Network error or server is unavailable');
      setDisplay('Error');
    } finally {
      setLoading(false);
    }
  };

  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', 'C', '+',
    '='
  ];

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
      <Paper elevation={6} sx={{ width: 320, padding: 2, borderRadius: 3, backgroundColor: '#fff' }}>
        <TextField
          variant="outlined"
          value={display}
          fullWidth
          disabled
          sx={{ marginBottom: 2, backgroundColor: '#f0f0f0', borderRadius: 1 }}
          inputProps={{ style: { textAlign: 'right', fontSize: '2rem' } }}
        />
        {error && (
          <Typography variant="body2" color="error" sx={{ marginBottom: 2, textAlign: 'center' }}>
            {error}
          </Typography>
        )}
        <Grid container spacing={1}>
          {buttons.map((btn) => (
            <Grid item xs={3} key={btn}>
              <Button
                variant={btn === '=' ? 'contained' : 'outlined'}
                color={['+', '-', '*', '/'].includes(btn) ? 'secondary' : btn === 'C' ? 'error' : 'primary'}
                fullWidth
                disabled={loading && btn === '='}
                sx={{ height: 60, fontSize: '1.2rem', borderRadius: 2 }}
                onClick={() => {
                  if (btn === 'C') handleClear();
                  else if (btn === '=') handleEqual();
                  else if (['+', '-', '*', '/'].includes(btn)) handleOperationClick(btn);
                  else handleNumberClick(btn);
                }}
              >
                {btn}
              </Button>
            </Grid>
          ))}
        </Grid>
        <Typography variant="caption" align="center" sx={{ display: 'block', marginTop: 1, color: '#888' }}>
          Simple Calculator
        </Typography>
      </Paper>
    </Box>
  );
};

export default Calculator;
