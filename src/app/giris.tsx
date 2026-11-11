import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
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
import { useLayout } from '@/lib/use-layout';

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
  const { isDesktop } = useLayout();
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

  const formEl = (
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
  );

  if (isDesktop) {
    return (
      <View style={{ flex: 1, flexDirection: 'row', backgroundColor: colors.bg }}>
        <View style={{ flex: 1, backgroundColor: colors.red, padding: 56, justifyContent: 'space-between', overflow: 'hidden' }}>
          <View style={{ position: 'absolute', right: -160, top: -120, width: 520, height: 520, borderRadius: 260, borderWidth: 2, borderColor: 'rgba(255,255,255,0.18)' }} />
          <View style={{ position: 'absolute', right: -90, top: -50, width: 380, height: 380, borderRadius: 190, borderWidth: 2, borderColor: 'rgba(255,255,255,0.18)' }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' }}>
              <T w="extrabold" size={19} color={colors.red}>
                GG
              </T>
            </View>
            <T w="extrabold" size={20} color={colors.white} style={{ lineHeight: 22 }}>
              Genç{'\n'}Gönüllüler
            </T>
          </View>
          <View style={{ gap: 18, maxWidth: 520 }}>
            <T w="extrabold" size={52} color={colors.white} style={{ letterSpacing: -1.6, lineHeight: 58 }}>
              Küçük adımlar,{'\n'}büyük etkiler.
            </T>
            <T size={18} color={colors.white} style={{ lineHeight: 27, opacity: 0.92 }}>
              Tasarım, kod, fotoğraf ya da kelimeler: yeteneğinle 15–60 dakikalık görevler yap, dokunduğun hayatları gör.
            </T>
          </View>
          <T w="semibold" size={13} color={colors.white} style={{ opacity: 0.8 }}>
            Puan değil, insan sayıyoruz.
          </T>
        </View>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 40 }} keyboardShouldPersistTaps="handled">
          <View style={{ width: '100%', maxWidth: 420, alignSelf: 'center', gap: 24 }}>
            <View style={{ gap: 6 }}>
              <T w="extrabold" size={28} style={{ letterSpacing: -0.8 }} accessibilityRole="header">
                {mode === 'register' ? 'Hesap oluştur' : 'Tekrar hoş geldin'}
              </T>
              <T size={15} color={colors.muted}>
                {mode === 'register' ? 'Birkaç saniyede aramıza katıl.' : 'Kaldığın yerden devam et.'}
              </T>
            </View>
            {formEl}
          </View>
        </ScrollView>
      </View>
    );
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

        {formEl}
      </Screen>
    </KeyboardAvoidingView>
  );
}
