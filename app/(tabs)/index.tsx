import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function BrewingScreen() {
  const [scaleConnected, setScaleConnected] = useState(false);
  const [kettleConnected, setKettleConnected] = useState(false);
  const [extraction, setExtraction] = useState({ weight: 0.0, rate: 0.0 });
  const [waterWeight, setWaterWeight] = useState({ weight: 0.0, rate: 0.0 });

  const handlePrepareToBrew = () => {
    if (!scaleConnected || !kettleConnected) {
      Alert.alert('Connection Required', 'Please connect both scale and kettle before brewing.');
      return;
    }
    // Handle brew preparation logic
    console.log('Preparing to brew...');
  };

  const handlePreferences = () => {
    // Navigate to preferences or show modal
    console.log('Opening preferences...');
  };

  const handleBrewingInstructions = () => {
    // Show brewing instructions modal or navigate
    console.log('Opening brewing instructions...');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Brewing</Text>
        <TouchableOpacity style={styles.scanButton}>
          <Ionicons name="qr-code-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Connection Status */}
      <View style={styles.connectionContainer}>
        <View style={styles.connectionStatus}>
          <View style={styles.statusIndicator}>
            <Ionicons 
              name="alert-circle" 
              size={16} 
              color="#ff6b6b" 
            />
          </View>
          <Text style={styles.connectionText}>
            ScaleNot connected
          </Text>
        </View>

        <View style={styles.connectionStatus}>
          <View style={styles.statusIndicator}>
            <Ionicons 
              name="alert-circle" 
              size={16} 
              color="#ff6b6b" 
            />
          </View>
          <Text style={styles.connectionText}>
            KettleNot connected
          </Text>
        </View>
      </View>

      {/* Brewing Diagram */}
      <View style={styles.brewingDiagram}>
        {/* Powder Ratio - Top */}
        <View style={styles.ratioContainer}>
          <Text style={styles.ratioLabel}>Powder ratio</Text>
          <Text style={styles.ratioValue}>-- : --</Text>
        </View>

        {/* Extraction Display */}
        <View style={styles.extractionContainer}>
          <Text style={styles.extractionLabel}>Extraction</Text>
          <Text style={styles.extractionValue}>{extraction.weight.toFixed(1)}g</Text>
          <Text style={styles.extractionRate}>{extraction.rate.toFixed(1)}g/s</Text>
        </View>

        {/* Coffee Dripper Illustration */}
        <View style={styles.dripperContainer}>
          <View style={styles.dripper}>
            <View style={styles.dripperTop} />
            <View style={styles.dripperFilter} />
            <View style={styles.dripperBody} />
          </View>
        </View>

        {/* Powder Ratio - Bottom */}
        <View style={styles.ratioContainer}>
          <Text style={styles.ratioLabel}>Powder ratio</Text>
          <Text style={styles.ratioValue}>-- : --</Text>
        </View>

        {/* Water Injection Display */}
        <View style={styles.waterContainer}>
          <Text style={styles.waterLabel}>Water inject...</Text>
          <Text style={styles.waterValue}>{waterWeight.weight.toFixed(1)}g</Text>
          <Text style={styles.waterRate}>{waterWeight.rate.toFixed(1)}g/s</Text>
        </View>

        {/* Coffee Pot */}
        <View style={styles.coffeePot}>
          <View style={styles.potBody} />
          <View style={styles.potHandle} />
          <View style={styles.potBase} />
        </View>
      </View>

      {/* Control Buttons */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={styles.preferencesButton}
          onPress={handlePreferences}
        >
          <Ionicons name="options-outline" size={20} color="#666" />
          <Text style={styles.preferencesText}>Preferences</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.brewButton}
          onPress={handlePrepareToBrew}
        >
          <Text style={styles.brewButtonText}>Prepare to brew</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.instructionsButton}
          onPress={handleBrewingInstructions}
        >
          <Ionicons name="chatbubble-outline" size={20} color="#666" />
          <Text style={styles.instructionsText}>Brewing instructions</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  scanButton: {
    padding: 5,
  },
  connectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#e5e5e5',
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    marginRight: 8,
  },
  connectionText: {
    fontSize: 14,
    color: '#666',
  },
  brewingDiagram: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  ratioContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  ratioLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  ratioValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  extractionContainer: {
    position: 'absolute',
    top: 80,
    right: 40,
    alignItems: 'flex-end',
  },
  extractionLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  extractionValue: {
    fontSize: 32,
    fontWeight: '300',
    color: '#333',
  },
  extractionRate: {
    fontSize: 14,
    color: '#cd9456',
  },
  waterContainer: {
    position: 'absolute',
    top: 200,
    right: 40,
    alignItems: 'flex-end',
  },
  waterLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  waterValue: {
    fontSize: 32,
    fontWeight: '300',
    color: '#333',
  },
  waterRate: {
    fontSize: 14,
    color: '#cd9456',
  },
  dripperContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  dripper: {
    alignItems: 'center',
  },
  dripperTop: {
    width: 60,
    height: 15,
    backgroundColor: '#333',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  dripperFilter: {
    width: 80,
    height: 40,
    backgroundColor: 'transparent',
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#333',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  dripperBody: {
    width: 100,
    height: 60,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#333',
    borderTopWidth: 0,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  coffeePot: {
    alignItems: 'center',
    marginTop: 10,
  },
  potBody: {
    width: 120,
    height: 80,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 10,
    position: 'relative',
  },
  potHandle: {
    position: 'absolute',
    right: -15,
    top: 20,
    width: 30,
    height: 40,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#333',
    borderLeftWidth: 0,
    borderRadius: 15,
  },
  potBase: {
    width: 140,
    height: 15,
    backgroundColor: '#333',
    borderRadius: 7,
    marginTop: -2,
  },
  controlsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  preferencesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e5e5e5',
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
  },
  preferencesText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  brewButton: {
    backgroundColor: '#333',
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
  },
  brewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  instructionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e5e5e5',
    paddingVertical: 15,
    borderRadius: 25,
  },
  instructionsText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
});