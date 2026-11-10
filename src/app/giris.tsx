import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createProfile } from '@/lib/data';
import { Button, Field, Screen, Squiggle, T } from '@/components/ui';
import { colors } from '@/theme';

const errorText = (code: string) =>
  ({
    'auth/invalid-email': 'E-posta adresi geçersiz görünüyor.',
    'auth/invalid-credential': 'E-posta ya da şifre hatalı.',
    'auth/wrong-password': 'E-posta ya da şifre hatalı.',
    'auth/user-not-found': 'Bu e-postayla kayıtlı hesap yok.',
    'auth/email-already-in-use': 'Bu e-postayla zaten bir hesap var. Giriş yapmayı dene.',
    'auth/weak-password': 'Şifre en az 6 karakter olmalı.',
    'auth/too-many-requests': 'Çok fazla deneme yapıldı. Biraz sonra tekrar dene.',
    'auth/network-request-failed': 'İnternet bağlantını kontrol et.',
  })[code] ?? 'Bir şeyler ters gitti. Tekrar dener misin?';

export default function Giris() {
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok?: boolean } | null>(null);

  async function submit() {
    setMessage(null);
    if (mode === 'register' && name.trim().length < 2) {
      setMessage({ text: 'Adını yazar mısın?' });
      return;
    }
    setBusy(true);
    try {
      if (mode === 'register') {
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(cred.user, { displayName: name.trim() });
        await createProfile(cred.user.uid, name.trim());
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
    } catch (e: any) {
      setMessage({ text: errorText(e?.code ?? '') });
    } finally {
      setBusy(false);
    }
  }

  async function reset() {
    if (!email.trim()) {
      setMessage({ text: 'Önce e-posta adresini yaz.' });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setMessage({ text: 'Şifre sıfırlama bağlantısı e-postana gönderildi.', ok: true });
    } catch (e: any) {
      setMessage({ text: errorText(e?.code ?? '') });
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen>
        <View style={{ gap: 18, paddingTop: 28 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' }}>
              <T w="extrabold" size={18} color={colors.white}>
                GG
              </T>
            </View>
            <T w="extrabold" size={20} style={{ lineHeight: 22 }}>
              Genç{'\n'}Gönüllüler
            </T>
          </View>
          <View style={{ gap: 8 }}>
            <T w="extrabold" size={30} style={{ letterSpacing: -0.9, lineHeight: 36 }}>
              Küçük adımlar,{'\n'}büyük etkiler.
            </T>
            <Squiggle />
            <T size={15} color={colors.muted} style={{ lineHeight: 22 }}>
              Tasarım, kod, fotoğraf ya da kelimeler: yeteneğinle 15–60 dakikalık görevler yap, dokunduğun hayatları gör.
            </T>
          </View>
        </View>

        <View style={{ gap: 14 }}>
          {mode === 'register' ? (
            <Field label="Adın" value={name} onChangeText={setName} placeholder="Örn. Mert" autoComplete="name" textContentType="givenName" />
          ) : null}
          <Field
            label="E-posta"
            value={email}
            onChangeText={setEmail}
            placeholder="ornek@mail.com"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
          />
          <Field
            label="Şifre"
            value={password}
            onChangeText={setPassword}
            placeholder="En az 6 karakter"
            secureTextEntry
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            textContentType={mode === 'register' ? 'newPassword' : 'password'}
            onSubmitEditing={submit}
          />
          {message ? (
            <T w="semibold" size={13} color={message.ok ? '#1F7A3A' : colors.redDark} accessibilityLiveRegion="polite">
              {message.text}
            </T>
          ) : null}
          <Button label={mode === 'register' ? 'Hesap oluştur' : 'Giriş yap'} icon="arrow" onPress={submit} loading={busy} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Pressable onPress={() => setMode(mode === 'register' ? 'login' : 'register')} hitSlop={10} accessibilityRole="button">
              <T w="bold" size={14} color={colors.ink}>
                {mode === 'register' ? 'Zaten hesabın var mı? Giriş yap' : 'Yeni misin? Hesap oluştur'}
              </T>
            </Pressable>
            {mode === 'login' ? (
              <Pressable onPress={reset} hitSlop={10} accessibilityRole="button">
                <T w="semibold" size={14} color={colors.muted}>
                  Şifremi unuttum
                </T>
              </Pressable>
            ) : null}
          </View>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
