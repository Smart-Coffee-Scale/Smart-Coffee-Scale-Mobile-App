import { SignInCredentials, SignUpCredentials, useAuth, User } from '@/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { JSX, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Storage keys (should match AuthContext)
const STORAGE_KEYS = {
  USER_TOKEN: '@auth_token',
  USER_DATA: '@user_data',
} as const;

interface FormErrors {
  email?: string;
  password?: string;
  name?: string;
}

export default function LoginScreen(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const { signIn, signUp, setUser } = useAuth();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Name validation for sign up
    if (isSignUp) {
      if (!name.trim()) {
        newErrors.name = 'Name is required';
      } else if (name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGuestLogin = async (): Promise<void> => {
    setLoading(true);
    
    try {
      // Create a guest user
      const guestUser: User = {
        id: 'guest-' + Date.now(),
        email: 'guest@brewing.app',
        name: 'Guest User',
        avatar: undefined,
        createdAt: new Date().toISOString(),
      };
      
      // Save guest user data locally (no token needed for guest)
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(guestUser));
      
      // Update auth context
      setUser(guestUser);
      
    } catch (error) {
      console.error('Guest login error:', error);
      Alert.alert('Error', 'Failed to continue as guest. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});
    
    try {
      let result;
      
      if (isSignUp) {
        const credentials: SignUpCredentials = {
          email: email.toLowerCase().trim(),
          password,
          name: name.trim(),
        };
        result = await signUp(credentials);
      } else {
        const credentials: SignInCredentials = {
          email: email.toLowerCase().trim(),
          password,
        };
        result = await signIn(credentials);
      }

      if (!result.success) {
        Alert.alert(
          'Authentication Error', 
          result.error || 'An unexpected error occurred'
        );
      }
      // Success case is handled by the auth context
    } catch (error) {
      console.error('Auth error:', error);
      Alert.alert(
        'Error', 
        'Something went wrong. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = (): void => {
    setIsSignUp(!isSignUp);
    setEmail('');
    setPassword('');
    setName('');
    setErrors({});
  };

  const clearError = (field: keyof FormErrors): void => {
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </Text>
            <Text style={styles.subtitle}>
              {isSignUp 
                ? 'Sign up to start brewing perfect coffee' 
                : 'Sign in to your brewing account'
              }
            </Text>
          </View>

          <View style={styles.form}>
            {isSignUp && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.name && styles.inputError
                  ]}
                  value={name}
                  onChangeText={(text: string) => {
                    setName(text);
                    clearError('name');
                  }}
                  placeholder="Enter your full name"
                  autoCapitalize="words"
                  textContentType="name"
                  returnKeyType="next"
                />
                {errors.name && (
                  <Text style={styles.errorText}>{errors.name}</Text>
                )}
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.email && styles.inputError
                ]}
                value={email}
                onChangeText={(text: string) => {
                  setEmail(text);
                  clearError('email');
                }}
                placeholder="Enter your email address"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
                returnKeyType="next"
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.password && styles.inputError
                ]}
                value={password}
                onChangeText={(text: string) => {
                  setPassword(text);
                  clearError('password');
                }}
                placeholder="Enter your password"
                secureTextEntry
                autoCapitalize="none"
                textContentType={isSignUp ? "newPassword" : "password"}
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            <TouchableOpacity 
              style={[
                styles.submitButton, 
                loading && styles.disabledButton
              ]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.guestButton,
                loading && styles.disabledButton
              ]}
              onPress={handleGuestLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.guestButtonText}>Continue as Guest</Text>
            </TouchableOpacity>

            <View style={styles.toggleContainer}>
              <Text style={styles.toggleText}>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              </Text>
              <TouchableOpacity 
                onPress={toggleMode}
                disabled={loading}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.toggleButton,
                  loading && styles.disabledText
                ]}>
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: '#ff6b6b',
    borderWidth: 2,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginTop: 5,
    marginLeft: 4,
  },
  submitButton: {
    backgroundColor: '#333',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
    minHeight: 56,
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  guestButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 30,
    minHeight: 54,
    justifyContent: 'center',
  },
  guestButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 14,
    color: '#666',
    marginRight: 5,
  },
  toggleButton: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  disabledText: {
    opacity: 0.5,
  },
});