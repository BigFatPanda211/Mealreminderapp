import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface WaterCounterProps {
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export default function WaterCounter({ count, onIncrement, onDecrement }: WaterCounterProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>💧 Water Intake</Text>
      <Text style={styles.subtitle}>Stay hydrated!</Text>

      <View style={styles.counterSection}>
        <TouchableOpacity style={styles.button} onPress={onDecrement}>
          <Text style={styles.buttonText}>−</Text>
        </TouchableOpacity>

        <View style={styles.display}>
          <Text style={styles.count}>{count}</Text>
          <Text style={styles.unit}>cups</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={onIncrement}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.recommendation}>
        Daily goal: 8-10 cups
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5a5a7a',
    marginBottom: 4
  },
  subtitle: {
    fontSize: 12,
    color: '#9a9ab5',
    marginBottom: 16
  },
  counterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 16
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(212, 179, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 28,
    color: '#5a5a7a',
    fontWeight: 'bold'
  },
  display: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  count: {
    fontSize: 36,
    fontWeight: '700',
    color: '#d4b3ff'
  },
  unit: {
    fontSize: 12,
    color: '#9a9ab5',
    marginTop: 4
  },
  recommendation: {
    fontSize: 12,
    color: '#9a9ab5',
    fontStyle: 'italic'
  }
});
