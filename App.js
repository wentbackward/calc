import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { evaluate } from 'mathjs';

export default function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);
  const [newCalculation, setNewCalculation] = useState(false);
  const [memory, setMemory] = useState(0);

  const formatNumber = (num) => {
    if (!num) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handlePress = (value) => {
    if (value === 'AC') {
      setInput('');
      setResult('');
      setHistory([]);
      setNewCalculation(false);
    } else if (value === 'C') {
      setInput(input.slice(0, -1));
    } else if (value === '=') {
      try {
        if (input.trim() === '') return;
        const newResult = evaluate(input).toString(); // Using mathjs for safer evaluation
        setHistory([...history.slice(-2), input + ' = ' + newResult]);
        setInput(newResult);
        setResult(newResult);
        setNewCalculation(true);
      } catch (error) {
        setResult('Error');
      }
    } else if (value === 'M+') {
      setMemory(memory + parseFloat(result || input || '0'));
    } else if (value === 'M-') {
      setMemory(memory - parseFloat(result || input || '0'));
    } else if (value === 'MS') {
      setMemory(parseFloat(result || input || '0'));
    } else if (value === 'MC') {
      setMemory(0);
    } else if (value === 'MR') {
      setInput(memory.toString());
    } else {
      if (newCalculation && /[0-9]/.test(value)) {
        setInput(value);
        setNewCalculation(false);
      } else {
        setInput((prevInput) => prevInput + value);
      }
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (/^[0-9+\-*/.]$/.test(event.key)) {
        setInput((prevInput) => prevInput + event.key);
      } else if (event.key === 'Enter') {
        if (input.trim() !== '') handlePress('=');
      } else if (event.key === 'Backspace') {
        handlePress('C');
      } else if (event.key === 'Escape') {
        handlePress('AC');
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [input]);

  const buttons = [
    ['M+', 'M-', 'MS', 'MC'],
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['C', '0', '.', '+'],
    ['AC', '', 'MR',  '=']
  ];

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' }}>
        <View style={{ width: '90%', backgroundColor: 'white', padding: 20, borderRadius: 10, shadowOpacity: 0.1 }}>
          {history.slice().reverse().map((entry, index) => (
            <Text key={index} style={{ fontSize: 18, textAlign: 'right', color: 'gray' }}>{entry}</Text>
          ))}
          <Text style={{ fontSize: 32, textAlign: 'right', minHeight: 50 }}>{formatNumber(input) || '0'}</Text>
          <Text style={{ fontSize: 24, textAlign: 'right', color: 'gray', minHeight: 30 }}>{formatNumber(result)}</Text>
          <Text style={{ fontSize: 18, textAlign: 'right', color: 'blue', minHeight: 20 }}>Memory: {formatNumber(memory)}</Text>
        </View>
        <View style={{ marginTop: 20 }}>
          {buttons.map((row, rowIndex) => (
            <View key={rowIndex} style={{ flexDirection: 'row' }}>
              {row.map((button) => (
                <TouchableOpacity
                  key={button}
                  onPress={() => handlePress(button)}
                  style={{
                    backgroundColor: ['C', 'AC', 'MC'].includes(button) ? '#FF4136' : button === '=' ? '#2ECC40' : '#0074D9',
                    padding: 20,
                    margin: 5,
                    borderRadius: 5,
                    width: 70,
                    alignItems: 'center',
                  }}>
                  <Text style={{ color: 'white', fontSize: 24 }}>{button}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </View>
    </SafeAreaProvider>
  );
}
