import { useEffect, useState } from 'react';
import { Platform, Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { deleteUser, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import { useAppData } from '@/lib/app-data';
import { deleteAccount, updatePhoto, updateSkills, useLeaderboard } from '@/lib/data';
import { PhotoPermissionError, pickProfilePhoto, type PhotoSource } from '@/lib/profile-photo';
import { Icon } from '@/components/Icon';
import { computeBadges, formatNumber, summarize } from '@/lib/impact';
import { CATEGORIES, SKILL_TAGS } from '@/lib/types';
import { Avatar, Button, Card, Chip, HexBadge, Screen, T } from '@/components/ui';
import { colors, radius } from '@/theme';

const level = (people: number) => {
  const steps = [
    [0, 'Yeni Gönüllü'],
    [10, 'Kıvılcım'],
    [100, 'Etki Yaratıcı'],
    [500, 'Değişim Elçisi'],
    [2000, 'Umut Mimarı'],
  ] as const;
  const idx = steps.reduce((acc, [min], i) => (people >= min ? i : acc), 0);
  return `Seviye ${idx + 1} · ${steps[idx][1]}`;
};

export default function Profil() {
  const { profile } = useAuth();
  const { claims } = useAppData();
  const leaders = useLeaderboard(5);
  const s = summarize(claims);
  const badges = computeBadges(claims);
  const [skills, setSkills] = useState<string[]>(profile?.skills ?? []);
  const [saveError, setSaveError] = useState('');
  const [editSkills, setEditSkills] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [photoMenu, setPhotoMenu] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoError, setPhotoError] = useState('');

  useEffect(() => setSkills(profile?.skills ?? []), [profile?.skills]);

  if (!profile) return null;

  async function toggle(tag: string) {
    const next = skills.includes(tag) ? skills.filter((x) => x !== tag) : [...skills, tag];
    if (!next.length) return; // en az bir yetenek kalsın
    setSkills(next);
    setSaveError('');
    try {
      await updateSkills(profile!.uid, next);
    } catch {
      setSkills(profile!.skills);
      setSaveError('Kaydedilemedi, tekrar dene.');
    }
  }

  async function changePhoto(source: PhotoSource) {
    setPhotoError('');
    setPhotoBusy(true);
    try {
      const photo = await pickProfilePhoto(source);
      if (photo) {
        await updatePhoto(profile!.uid, photo);
        setPhotoMenu(false);
      }
    } catch (e) {
      setPhotoError(
        e instanceof PhotoPermissionError
          ? 'Kamera izni verilmedi. Ayarlar > Genç Gönüllüler bölümünden izin verebilirsin.'
          : 'Fotoğraf kaydedilemedi, tekrar dene.',
      );
    } finally {
      setPhotoBusy(false);
    }
  }

  async function removePhoto() {
    setPhotoError('');
    setPhotoBusy(true);
    try {
      await updatePhoto(profile!.uid, null);
      setPhotoMenu(false);
    } catch {
      setPhotoError('Fotoğraf kaldırılamadı, tekrar dene.');
    } finally {
      setPhotoBusy(false);
    }
  }

  async function removeAccount() {
    const current = auth.currentUser;
    if (!current) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await deleteAccount(current.uid, claims.map((c) => c.id));
      await deleteUser(current);
    } catch (e: any) {
      setDeleteError(
        e?.code === 'auth/requires-recent-login'
          ? 'Güvenlik için çıkış yapıp tekrar giriş yaptıktan sonra hesabını silebilirsin.'
          : 'Hesap silinemedi. Tekrar dene.',
      );
      setDeleting(false);
    }
  }

  return (
    <Screen>
      <View style={{ alignItems: 'center', gap: 10 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={profile.photo ? 'Profil fotoğrafını değiştir' : 'Profil fotoğrafı ekle'}
          onPress={() => setPhotoMenu(!photoMenu)}
          style={({ pressed }) => ({ padding: 4, borderRadius: 99, borderWidth: 2, borderColor: colors.red, opacity: pressed || photoBusy ? 0.7 : 1 })}
        >
          <Avatar name={profile.name} size={84} photo={profile.photo} />
          <View
            style={{
              position: 'absolute',
              right: -2,
              bottom: -2,
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: colors.red,
              borderWidth: 3,
              borderColor: colors.bg,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name={profile.photo ? 'camera' : 'plus'} size={14} color={colors.white} strokeWidth={2.4} />
          </View>
        </Pressable>
        {photoMenu ? (
          <View style={{ width: '100%', maxWidth: 360, gap: 8, padding: 12, borderRadius: radius.lg, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}>
            <T w="extrabold" size={14} style={{ textAlign: 'center' }}>
              Profil fotoğrafı
            </T>
            <Button label="Galeriden seç" icon="plus" variant="outline" loading={photoBusy} onPress={() => changePhoto('library')} style={{ height: 46 }} />
            {Platform.OS !== 'web' ? (
              <Button label="Fotoğraf çek" icon="camera" variant="outline" disabled={photoBusy} onPress={() => changePhoto('camera')} style={{ height: 46 }} />
            ) : null}
            {profile.photo ? (
              <Button label="Fotoğrafı kaldır" variant="ghost" disabled={photoBusy} onPress={removePhoto} style={{ height: 42 }} />
            ) : null}
            {photoError ? (
              <T w="semibold" size={13} color={colors.redDark} style={{ textAlign: 'center' }}>
                {photoError}
              </T>
            ) : null}
          </View>
        ) : null}
        <T w="extrabold" size={22} style={{ letterSpacing: -0.4 }}>
          {profile.name}
        </T>
        <View style={{ backgroundColor: colors.redSoft, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill }}>
          <T w="bold" size={12} color={colors.redDark}>
            {level(s.people)}
          </T>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 8 }}>
        {[
          [formatNumber(s.people), 'Dokunulan hayat'],
          [String(s.tasks), 'Mikro görev'],
          [String(s.orgs), 'Kurum'],
        ].map(([value, label]) => (
          <View key={label} style={{ flex: 1, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 18, paddingVertical: 14, paddingHorizontal: 8, alignItems: 'center', gap: 2 }}>
            <T w="extrabold" size={20}>
              {value}
            </T>
            <T w="semibold" size={11} color={colors.muted} style={{ textAlign: 'center' }}>
              {label}
            </T>
          </View>
        ))}
      </View>

      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
          <T w="extrabold" size={16}>
            Yeteneklerin ({skills.length})
          </T>
          <T w="semibold" size={12} color={colors.muted}>
            Eşleşmeler buna göre yapılır
          </T>
        </View>
        {editSkills ? (
          CATEGORIES.map((c) => (
            <View key={c.id} style={{ gap: 8 }}>
              <T w="bold" size={13} color={colors.text}>
                {c.label}
              </T>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {SKILL_TAGS.filter((t) => t.category === c.id).map((t) => (
                  <Chip key={t.tag} label={t.tag} active={skills.includes(t.tag)} onPress={() => toggle(t.tag)} dashed />
                ))}
              </View>
            </View>
          ))
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {skills.map((tag) => (
              <Chip key={tag} label={tag} active onPress={() => toggle(tag)} dashed />
            ))}
          </View>
        )}
        <Button
          label={editSkills ? 'Tamam' : 'Yetenek ekle / düzenle'}
          variant="outline"
          icon={editSkills ? 'check' : 'plus'}
          onPress={() => setEditSkills(!editSkills)}
        />
        {saveError ? (
          <T w="semibold" size={13} color={colors.redDark}>
            {saveError}
          </T>
        ) : null}
      </Card>

      <View style={{ gap: 12 }}>
        <T w="extrabold" size={16} accessibilityRole="header">
          Rozet koleksiyonu
        </T>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 14 }}>
          {badges.map((b) => (
            <View
              key={b.id}
              style={{ width: '25%', alignItems: 'center', gap: 6 }}
              accessible
              accessibilityLabel={`${b.name}: ${b.earned ? 'kazanıldı' : `kilitli, ${b.hint}`}`}
            >
              <HexBadge icon={b.icon} tone={b.tone} earned={b.earned} size={56} />
              <T w="semibold" size={11} color={b.earned ? colors.text : colors.muted} style={{ textAlign: 'center', lineHeight: 14 }}>
                {b.earned ? b.name : b.hint}
              </T>
            </View>
          ))}
        </View>
      </View>

      <Card style={{ gap: 6 }}>
        <T w="extrabold" size={16} style={{ marginBottom: 6 }}>
          Etki sıralaması
        </T>
        {leaders.map((u, i) => {
          const me = u.uid === profile.uid;
          return (
            <View key={u.uid} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, paddingHorizontal: 10, borderRadius: 14, backgroundColor: me ? colors.redSoft : 'transparent' }}>
              <T w="extrabold" size={13} color={colors.muted} style={{ width: 18 }}>
                {i + 1}
              </T>
              <Avatar name={u.name} size={32} photo={u.photo} />
              <T w="bold" size={14} style={{ flex: 1 }} numberOfLines={1}>
                {me ? 'Sen' : u.name}
              </T>
              <T w="extrabold" size={13}>
                {formatNumber(u.impactTotal ?? 0)} kişi
              </T>
            </View>
          );
        })}
      </Card>

      {profile.role === 'admin' ? <Button label="Kurum paneli" icon="shield" variant="dark" onPress={() => router.push('/yonetim')} /> : null}
      <Button label="Çıkış yap" icon="logout" variant="outline" onPress={() => signOut(auth)} />
      {confirmDelete ? (
        <Card style={{ borderColor: colors.red }}>
          <T w="bold" size={14} style={{ lineHeight: 20 }}>
            Hesabın, etki geçmişin ve rozetlerin kalıcı olarak silinecek. Bu işlem geri alınamaz.
          </T>
          <Button label="Evet, hesabımı sil" loading={deleting} onPress={removeAccount} />
          <Button label="Vazgeç" variant="ghost" onPress={() => setConfirmDelete(false)} />
          {deleteError ? (
            <T w="semibold" size={13} color={colors.redDark}>
              {deleteError}
            </T>
          ) : null}
        </Card>
      ) : (
        <Button label="Hesabımı sil" variant="ghost" onPress={() => setConfirmDelete(true)} />
      )}
    </Screen>
  );
}
