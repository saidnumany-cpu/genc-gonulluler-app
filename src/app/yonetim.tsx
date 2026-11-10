import { useState } from 'react';
import { Linking, Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/lib/auth-context';
import { useAppData } from '@/lib/app-data';
import { addTask, approveClaim, rejectClaim, seedTasks, usePendingClaims } from '@/lib/data';
import { formatNumber } from '@/lib/impact';
import { CATEGORIES, CAUSES, type Category, type Cause, type Claim } from '@/lib/types';
import { Icon } from '@/components/Icon';
import { Button, Card, Chip, Empty, Field, Pill, Screen, T } from '@/components/ui';
import { colors } from '@/theme';

function PendingCard({ claim, defaultImpact }: { claim: Claim; defaultImpact: number }) {
  const [impact, setImpact] = useState(String(defaultImpact));
  const [story, setStory] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const n = parseInt(impact, 10);

  async function run(fn: () => Promise<void>) {
    setBusy(true);
    setError('');
    try {
      await fn();
    } catch {
      setError('İşlem başarısız. Yetkini ve bağlantını kontrol et.');
      setBusy(false);
    }
  }

  return (
    <Card>
      <Pill label={claim.org} />
      <T w="extrabold" size={16} style={{ lineHeight: 21 }}>
        {claim.taskTitle}
      </T>
      <T size={13} color={colors.muted}>
        Gönüllü: {claim.userName}
      </T>
      {claim.link ? (
        <Pressable onPress={() => Linking.openURL(claim.link!)} accessibilityRole="link" style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
          <Icon name="link" size={16} color={colors.red} strokeWidth={2} />
          <T w="bold" size={13} color={colors.redDark} numberOfLines={1} style={{ flex: 1 }}>
            {claim.link}
          </T>
        </Pressable>
      ) : null}
      <Field label="Ulaşılan kişi sayısı" value={impact} onChangeText={setImpact} keyboardType="number-pad" />
      <Field
        label="Etki hikâyesi (gönüllü bunu görecek)"
        value={story}
        onChangeText={setStory}
        placeholder="Örn. Tasarladığın etiketle ürünlerimiz 3 markete girdi."
        multiline
        style={{ minHeight: 80, textAlignVertical: 'top' }}
      />
      <Button label="Onayla" icon="check" disabled={!(n > 0) || story.trim().length < 5} loading={busy} onPress={() => run(() => approveClaim(claim, n, story.trim()))} />
      <Button label="Düzeltme iste" variant="outline" disabled={busy} onPress={() => run(() => rejectClaim(claim))} />
      {error ? (
        <T w="semibold" size={13} color={colors.redDark}>
          {error}
        </T>
      ) : null}
    </Card>
  );
}

function NewTaskForm() {
  const [title, setTitle] = useState('');
  const [org, setOrg] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState<Category>('tasarim');
  const [cause, setCause] = useState<Cause>('Eğitim');
  const [minutes, setMinutes] = useState('30');
  const [impactText, setImpactText] = useState('');
  const [impactCount, setImpactCount] = useState('');
  const [steps, setSteps] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const stepList = steps
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
  const valid = title.trim() && org.trim() && impactText.trim() && parseInt(impactCount, 10) > 0 && parseInt(minutes, 10) > 0 && stepList.length;

  async function save() {
    setBusy(true);
    setMsg('');
    try {
      await addTask({
        title: title.trim(),
        org: org.trim(),
        city: city.trim() || 'Uzaktan',
        category,
        cause,
        minutes: parseInt(minutes, 10),
        impactText: impactText.trim(),
        impactCount: parseInt(impactCount, 10),
        steps: stepList,
        active: true,
      });
      setTitle('');
      setImpactText('');
      setImpactCount('');
      setSteps('');
      setMsg('Görev yayınlandı.');
    } catch {
      setMsg('Kaydedilemedi.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <T w="extrabold" size={16}>
        Yeni görev ekle
      </T>
      <Field label="Görev başlığı" value={title} onChangeText={setTitle} placeholder="Örn. Barınak için afiş tasarla" />
      <Field label="Kurum" value={org} onChangeText={setOrg} />
      <Field label="Şehir" value={city} onChangeText={setCity} />
      <T w="semibold" size={13} color={colors.text}>
        Yetenek alanı
      </T>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {CATEGORIES.map((c) => (
          <Chip key={c.id} label={c.short} active={category === c.id} onPress={() => setCategory(c.id)} />
        ))}
      </View>
      <T w="semibold" size={13} color={colors.text}>
        Etki alanı
      </T>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {CAUSES.map((c) => (
          <Chip key={c} label={c} active={cause === c} onPress={() => setCause(c)} />
        ))}
      </View>
      <Field label="Süre (dakika)" value={minutes} onChangeText={setMinutes} keyboardType="number-pad" />
      <Field label="Etki cümlesi" value={impactText} onChangeText={setImpactText} placeholder="Örn. 60 hayvan daha hızlı yuva bulacak" />
      <Field label="Beklenen kişi sayısı" value={impactCount} onChangeText={setImpactCount} keyboardType="number-pad" />
      <Field label="Adımlar (her satıra bir adım)" value={steps} onChangeText={setSteps} multiline style={{ minHeight: 100, textAlignVertical: 'top' }} />
      <Button label="Yayınla" icon="plus" disabled={!valid} loading={busy} onPress={save} />
      {msg ? (
        <T w="semibold" size={13} color={colors.muted}>
          {msg}
        </T>
      ) : null}
    </Card>
  );
}

export default function Yonetim() {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';
  const pending = usePendingClaims(isAdmin);
  const { tasks } = useAppData();
  const [seeding, setSeeding] = useState(false);

  if (!isAdmin) {
    return (
      <Screen>
        <Empty text="Bu sayfa yalnızca kurum yöneticileri içindir." />
        <Button label="Geri dön" variant="outline" onPress={() => router.back()} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Geri" style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="back" size={20} color={colors.ink} strokeWidth={2.2} />
      </Pressable>
      <View style={{ gap: 4 }}>
        <T w="semibold" size={13} color={colors.redDark}>
          Kurum paneli
        </T>
        <T w="extrabold" size={26} style={{ letterSpacing: -0.8 }} accessibilityRole="header">
          Onay bekleyenler ({pending.length})
        </T>
        <T size={13} color={colors.muted}>
          Yayında {formatNumber(tasks.length)} görev var.
        </T>
      </View>

      {pending.length ? pending.map((c) => <PendingCard key={c.id} claim={c} defaultImpact={tasks.find((t) => t.id === c.taskId)?.impactCount ?? 0} />) : <Empty text="Onay bekleyen teslim yok." />}

      <NewTaskForm />

      {tasks.length === 0 ? (
        <Button
          label="Örnek görevleri yükle"
          variant="dark"
          loading={seeding}
          onPress={async () => {
            setSeeding(true);
            try {
              await seedTasks();
            } finally {
              setSeeding(false);
            }
          }}
        />
      ) : null}
    </Screen>
  );
}
