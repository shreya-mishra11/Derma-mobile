import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useLogin, useRegister } from '@/app/api/react-query/auth';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { setToken, signIn } from '@/lib/auth-session';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const registerMutation = useRegister();
  const loginMutation = useLogin();

  const handleSubmit = () => {
    setError('');
    if (!email.trim() || !password.trim() || (isRegister && !name.trim())) {
      setError('Please fill all required fields');
      return;
    }
    if (isRegister) {
      registerMutation.mutate(
        { name, email, password },
        {
          onSuccess: (res) => {
            console.log("Resss",res)
            setToken(res.data.token);
            signIn({ id: res.user?.id || 'u', name: res.user?.name || name, email: res.user?.email || email });
            router.replace('/');
          },
          onError: (e: any) => setError(e?.message || 'Registration failed'),
        }
      );
    } else {
      loginMutation.mutate(
        { email, password },
        {
          onSuccess: (res) => {
            console.log("Resss>>>",res)

            setToken(res.data.token);
            signIn({ id: res.user?.id || 'u', name: res.user?.name || 'User', email: res.user?.email || email });
            router.replace('/');
          },
          onError: (e: any) => setError(e?.message || 'Login failed'),
        }
      );
    }
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent={Platform.OS === 'android'} />

      <View style={[styles.content, { paddingTop: Platform.OS === 'ios' ? insets.top + 20 : 40 }]}>
        <ThemedText style={styles.title}>{isRegister ? 'Create Account' : 'Welcome Back'}</ThemedText>
        <ThemedText style={styles.subtitle}>{isRegister ? 'Register to continue' : 'Sign in to continue'}</ThemedText>

        {isRegister && (
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Name</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Your name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />
          </View>
        )}

        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Email</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="email@example.com"
            placeholderTextColor="#999"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Password</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {!!error && <ThemedText style={styles.error}>{error}</ThemedText>}

        <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit} disabled={registerMutation.isPending || loginMutation.isPending}>
          <ThemedText style={styles.primaryButtonText}>
            {registerMutation.isPending || loginMutation.isPending ? 'Please wait...' : isRegister ? 'Register' : 'Sign In'}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsRegister(!isRegister)}>
          <ThemedText style={styles.switchText}>
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register"}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: '800', color: '#333', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 24 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, color: '#333', backgroundColor: '#fff' },
  error: { color: '#ff4444', marginBottom: 12 },
  primaryButton: { backgroundColor: '#279989', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  switchText: { marginTop: 16, color: '#279989', fontWeight: '600', textAlign: 'center' },
});


