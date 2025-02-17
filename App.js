import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handlePress = (value) => {
    if (value === 'AC') {
      setInput('');
      setResult('');
    } else if (value === 'C') {
      setInput(input.slice(0, -1));
    } else if (value === '=') {
      try {
        setResult(eval(input).toString()); // ⚠️ Simple evaluation (avoid for production)
      } catch (error) {
        setResult('Error');
      }
    } else {
      setInput(input + value);
    }
  };

  const buttons = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['C', '0', '=', '+'],
    ['AC']
  ];

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' }}>
        <View style={{ width: '90%', backgroundColor: 'white', padding: 20, borderRadius: 10, shadowOpacity: 0.1 }}>
          <Text style={{ fontSize: 32, textAlign: 'right', minHeight: 50 }}>{input || '0'}</Text>
          <Text style={{ fontSize: 24, textAlign: 'right', color: 'gray', minHeight: 30 }}>{result}</Text>
        </View>
        <View style={{ marginTop: 20 }}>
          {buttons.map((row, rowIndex) => (
            <View key={rowIndex} style={{ flexDirection: 'row' }}>
              {row.map((button) => (
                <TouchableOpacity
                  key={button}
                  onPress={() => handlePress(button)}
                  style={{
                    backgroundColor: ['C', 'AC'].includes(button) ? '#FF4136' : button === '=' ? '#2ECC40' : '#0074D9',
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

