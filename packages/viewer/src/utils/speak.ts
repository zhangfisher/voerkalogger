/**
 * @function speak
 * @description 函数用于
 * @param
 * @returns
 * @example
 * speak() // ->
 */
export function speak(text: string) {
  if (!window.speechSynthesis) {
    return;
  }
  // 创建语音合成实例
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN'; // 设置语言为中文
  utterance.rate = 1; // 设置语速（默认为1）
  utterance.pitch = 1; // 设置音调（默认为1）
  utterance.volume = 1; // 设置音量（默认为1）

  // 播报语音
  window.speechSynthesis.speak(utterance);
}


