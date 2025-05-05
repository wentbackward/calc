import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { evaluate, pi, e, sqrt } from 'mathjs';

export default function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);
  const [newCalculation, setNewCalculation] = useState(false);
  const [memory, setMemory] = useState(0);
  const [scientificMode, setScientificMode] = useState(false);

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
        let expression = input.replace(/π/g, pi).replace(/e/g, e).replace(/√/g, 'sqrt');
        const newResult = evaluate(expression).toString();
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
    } else if (['sin', 'cos', 'tan', 'log', '√'].includes(value)) {
      setInput(`${value}(${input})`);
    } else {
      if (newCalculation && /[0-9]/.test(value)) {
        setInput(value);
        setNewCalculation(false);
      } else {
        setInput((prevInput) => prevInput + value);
      }
    }
  };

  const buttons = [
    ['/', '*', '-', '+'],
    ['7', '8', '9', ''],
    ['4', '5', '6', ''],
    ['1', '2', '3', ''],
    ['C', '0', '.', ''],
    ['AC', '', '',  '=']
  ];

  const operatorButtons = [
    ['M+', '('],
    ['M-', ')'],
    ['MS', ''],
    ['MC', '']
  ];


  const scientificButtons = [
    ['sin', 'cos', 'tan', 'log'],
    ['√', '^', 'π', 'e']
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
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <Text>Scientific Mode</Text>
            <Switch value={scientificMode} onValueChange={setScientificMode} />
          </View>
        </View>
        
        <View style={{ flexDirection: 'row', marginTop: 20 }}>
          <View>
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

        <View style={{ marginLeft: 20 }}>
          {operatorButtons.map((row, rowIndex) => (
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

          {scientificMode && (
            <View style={{ marginLeft: 20 }}>
              {scientificButtons.map((row, rowIndex) => (
                <View key={rowIndex} style={{ flexDirection: 'row' }}>
                  {row.map((button) => (
                    <TouchableOpacity
                      key={button}
                      onPress={() => handlePress(button)}
                      style={{
                        backgroundColor: '#FFA500',
                        padding: 20,
                        margin: 5,
                        borderRadius: 5,
                        width: 70,
                        alignItems: 'center',
                      }}>
                      <Text style={{ color: 'white', fontSize: 20 }}>{button}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </SafeAreaProvider>
  );
}
