import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

export type PhotoSource = 'library' | 'camera';

export class PhotoPermissionError extends Error {}

/**
 * Galeriden ya da kameradan kare bir fotoğraf seçtirir, 320 px'e küçültür ve
 * profil belgesine yazılabilecek bir data URI döndürür. Kullanıcı vazgeçerse `null`.
 */
export async function pickProfilePhoto(source: PhotoSource): Promise<string | null> {
  const options: ImagePicker.ImagePickerOptions = {
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  };

  let result: ImagePicker.ImagePickerResult;
  if (source === 'camera') {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) throw new PhotoPermissionError('camera');
    result = await ImagePicker.launchCameraAsync(options);
  } else {
    result = await ImagePicker.launchImageLibraryAsync(options);
  }
  if (result.canceled || !result.assets?.length) return null;

  const asset = result.assets[0];
  // Kısa kenarı 320 px'e indir, sonra ortadan kare kırp (düzenleme ekranı olmayan web için de doğru sonuç).
  const S = 320;
  const w = asset.width || S;
  const h = asset.height || S;
  const portrait = w <= h;
  const scaledW = portrait ? S : Math.round((w * S) / h);
  const scaledH = portrait ? Math.round((h * S) / w) : S;
  const rendered = await ImageManipulator.manipulate(asset.uri)
    .resize(portrait ? { width: S } : { height: S })
    .crop({
      originX: Math.max(0, Math.floor((scaledW - S) / 2)),
      originY: Math.max(0, Math.floor((scaledH - S) / 2)),
      width: Math.min(S, scaledW),
      height: Math.min(S, scaledH),
    })
    .renderAsync();
  const saved = await rendered.saveAsync({ format: SaveFormat.JPEG, compress: 0.72, base64: true });
  if (!saved.base64) return null;
  return `data:image/jpeg;base64,${saved.base64}`;
}
