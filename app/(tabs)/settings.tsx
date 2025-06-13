import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import React, { JSX } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface SettingItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

export default function EquipmentScreen(): JSX.Element {
  const { signOut } = useAuth();

  const handleConnectDevice = () => {
    console.log('Connect device pressed');
    // Navigate to device connection screen or show Bluetooth pairing
    Alert.alert('Connect Device', 'Bluetooth device pairing would start here');
  };

  const handleScaleSettings = () => {
    console.log('Scale settings pressed');
    // Navigate to scale settings
    Alert.alert('Scale Settings', 'Scale configuration options');
  };

  const handleKettleSettings = () => {
    console.log('Kettle settings pressed');
    // Navigate to kettle settings
    Alert.alert('Kettle Settings', 'Kettle configuration options');
  };

  const handleSoftwareSettings = () => {
    console.log('Software settings pressed');
    // Navigate to app settings
    Alert.alert('Software Settings', 'App configuration options');
  };

  const handleTroubleshooting = () => {
    console.log('Troubleshooting pressed');
    // Navigate to troubleshooting guide
    Alert.alert('Troubleshooting', 'Help and support information');
  };

  const handleAbout = () => {
    console.log('About pressed');
    // Show app version and info
    Alert.alert('About TIMEMORE', 'App version 1.0.0\nBrewing made perfect');
  };

  const handleExitAccount = () => {
    Alert.alert(
      'Exit Account',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Exit', style: 'destructive', onPress: signOut },
      ]
    );
  };

  const settingsItems: SettingItem[] = [
    {
      id: 'connect',
      title: 'Connect the device',
      icon: 'link-outline',
      onPress: handleConnectDevice,
    },
    {
      id: 'scale',
      title: 'Scale settings',
      icon: 'scale-outline',
      onPress: handleScaleSettings,
    },
    {
      id: 'kettle',
      title: 'The kettle setting',
      icon: 'water-outline',
      onPress: handleKettleSettings,
    },
    {
      id: 'software',
      title: 'Software settings',
      icon: 'settings-outline',
      onPress: handleSoftwareSettings,
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: 'help-circle-outline',
      onPress: handleTroubleshooting,
    },
    {
      id: 'about',
      title: 'About TIMEMORE',
      icon: 'information-circle-outline',
      onPress: handleAbout,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header - Simple centered title */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Equipment</Text>
        </View>

        {/* Connection Status */}
        <View style={styles.connectionContainer}>
          <View style={styles.connectionStatus}>
            <View style={styles.statusIndicator}>
              <Ionicons name="alert-circle" size={16} color="#ff6b6b" />
            </View>
            <Text style={styles.connectionText}>ScaleNot connected</Text>
          </View>

          <View style={styles.connectionStatus}>
            <View style={styles.statusIndicator}>
              <Ionicons name="alert-circle" size={16} color="#ff6b6b" />
            </View>
            <Text style={styles.connectionText}>KettleNot connected</Text>
          </View>
        </View>

        {/* Settings List */}
        <View style={styles.settingsContainer}>
          {settingsItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.settingItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.settingContent}>
                <Ionicons
                  name={item.icon}
                  size={24}
                  color="#333"
                  style={styles.settingIcon}
                />
                <Text style={styles.settingTitle}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Exit Account Button */}
        <TouchableOpacity
          style={styles.exitButton}
          onPress={handleExitAccount}
          activeOpacity={0.7}
        >
          <Text style={styles.exitButtonText}>Exit your current connected account</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 60, // Account for status bar
    paddingBottom: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#333',
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
  settingsContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 0,
    borderRadius: 0,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 16,
    width: 24,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  exitButton: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 100, // Space for tab bar
  },
  exitButtonText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});