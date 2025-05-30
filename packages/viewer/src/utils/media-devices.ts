export async function getMediaDevices() {
  return await navigator.mediaDevices.enumerateDevices();
}
