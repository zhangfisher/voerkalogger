import { module, Module, configurable, state } from '@voerka/react';
@module({ observable: true, id: 'speaker' })
export class SpeakerModule extends Module {
    state = state({
        rate: configurable(1), // 播报语速
        pitch: configurable(1), // 播报音调
        volume: configurable(1), // 播报音量
    });
    speak(text: string) {
        if (!window.speechSynthesis) {
            return;
        }
        // 创建语音合成实例
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN'; // 设置语言为中文
        utterance.rate = this.state.rate; // 设置语速（默认为1）
        utterance.pitch = this.state.pitch; // 设置音调（默认为1）
        utterance.volume = this.state.volume; // 设置音量（默认为1）

        // 播报语音
        window.speechSynthesis.speak(utterance);
    }
}
