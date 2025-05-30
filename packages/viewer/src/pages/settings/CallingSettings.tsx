/**
 * @author
 * @file index.tsx
 * @fileBase CallingSettings
 * @path projects\web-client\src\pages\CallingSettings\index.tsx
 * @from
 * @desc
 * @example
 */
import { CallModule } from '@/app';
import { SpeakerModule } from '@/app/modules/speaker';
import ringing from '@/assets/audio/ringing.wav';
import ringing2 from '@/assets/audio/ringing2.wav';
import ringtone from '@/assets/audio/ringtone.wav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useModule, useModuleStore } from '@voerka/react';
import { ReactNode } from 'react';
import { toast } from 'sonner';
import LocalAudioSelect from './local-audio-select/local-audio-select';
import LocalVideoSelect from './local-video-select/local-video-select';
import { UserName } from './user-name';
export interface CallingSettingsProps {
    // value: any
}
/**
 *
 */
export const FormContainer: React.FC<{
    children: ReactNode;
}> = ({ children }) => {
    return (
        <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-end">{children}</div>
    );
};

export const CallingSettings: React.FC<CallingSettingsProps> = () => {
    const callModule = useModule<CallModule>('call');
    const callStore = useModuleStore<CallModule>('call');
    const [ipAddress, setIpAddress] = callStore.useReactive('connectOpts.host');
    const [port, setPort] = callStore.useReactive('connectOpts.port');
    const [autoAnswer, setAutoAnswer] = callStore.useReactive('answer.auto');
    const [autoHangup, setAutoHangup] = callStore.useReactive('hangup.auto');
    const [autoHangupTime, setAutoHangupTime] = callStore.useReactive('hangup.waitTime');
    const [isLocalVideoOn, setIsLocalVideoOn] = callStore.useReactive('localVideo.on');
    const [localVideoDeviceId, setLocalVideoDeviceId] = callStore.useReactive('localVideo.input');
    const [localAudioDeviceId, setLocalAudioDeviceId] = callStore.useReactive('localAudio.input');
    const [localVideoWidth, setLocalVideoWidth] = callStore.useReactive('localVideo.width');
    const [localVideoHeight, setLocalVideoHeight] = callStore.useReactive('localVideo.height');
    const [ringValue, setRingValue] = callStore.useReactive('ring.value');
    const speakerModule = useModule<SpeakerModule>('speaker');
    const speakerStore = useModuleStore<SpeakerModule>('speaker');
    // 响铃时长
    const [ringDuration, setRingDuration] = callStore.useReactive('ring.duration');
    // 是否语音播报
    const [isSpeakOn, setIsSpeakOn] = callStore.useReactive('notify.callIn.speak.on');
    // 通话速率
    const [speakRate, setSpeakRate] = speakerStore.useReactive('rate');
    function testSpeaker() {
        speakerModule.speak('测试语音功能');
    }
    const [speakRepeatTimes, setSpeakRepeatTimes] = callStore.useReactive(
        'notify.callIn.speak.repeat',
    );
    return (
        <div className="h-full bg-primary-foreground">
            {/* // container */}
            <div className="space-y-4 p-4 max-w-[1200px] mx-auto">
                {/* panel */}
                <div className="p-6 rounded-lg shadow bg-card text-card-foreground">
                    <div className="font-bold">连接设置</div>
                    <FormContainer>
                        <UserName></UserName>
                        <div>
                            <Label htmlFor="host">通讯地址</Label>
                            {/* ip地址的validate */}
                            <Input
                                id="host"
                                value={ipAddress}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setIpAddress(value);
                                }}
                            />
                        </div>
                        <div>
                            <Label htmlFor="port">端口</Label>
                            {/* ip地址的validate */}
                            <Input
                                type="number"
                                id="port"
                                value={port}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setPort(value);
                                }}
                            />
                        </div>
                        <Button
                            onClick={() => {
                                toast.info('重新连接');
                                callModule.initPeer();
                            }}>
                            重新连接
                        </Button>
                        <Button
                            variant={'destructive'}
                            onClick={() => {
                                toast.info('重新连接');
                                callModule.forceInitPeer();
                            }}>
                            强制重接
                        </Button>
                    </FormContainer>
                </div>
                <Panel>
                    <div className="font-bold">通话设置</div>
                    <FormContainer>
                        {/* 是否自动接听 */}
                        <div className="">
                            <Label htmlFor="autoAnswer">自动接听</Label>
                            <div className="flex items-center h-10">
                                <Switch
                                    id="autoAnswer"
                                    checked={autoAnswer}
                                    onCheckedChange={(value) => {
                                        setAutoAnswer(value);
                                    }}
                                />
                            </div>
                        </div>
                        {/* 是否自动挂断 */}
                        <div className="">
                            <Label htmlFor="autoHangup">自动挂断</Label>
                            <div className="flex items-center h-10">
                                <Switch
                                    id="autoHangup"
                                    checked={autoHangup}
                                    onCheckedChange={(value) => {
                                        setAutoHangup(value);
                                    }}
                                />
                            </div>
                        </div>
                        {/* 自动挂断时长 */}
                        {/* 自动挂断时长 */}
                        <div>
                            <Label htmlFor="autoHangupTime">自动挂断时长(单位:秒)</Label>
                            {/* ip地址的validate */}
                            <Input
                                type="number"
                                id="autoHangupTime"
                                value={autoHangupTime}
                                // 最小3秒钟
                                min={3}
                                onChange={(e) => {
                                    const value = e.target.value || 3;
                                    setAutoHangupTime(value);
                                }}
                            />
                        </div>
                    </FormContainer>
                </Panel>
                <Panel>
                    <div className="font-bold">音视频设置</div>
                    <FormContainer>
                        {/* 是否自动接听 */}
                        <div className="">
                            <Label htmlFor="isLocalVideoOn">本地视频</Label>
                            <div className="flex items-center h-10">
                                <Switch
                                    id="isLocalVideoOn"
                                    checked={isLocalVideoOn}
                                    onCheckedChange={(value) => {
                                        setIsLocalVideoOn(value);
                                    }}
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="localVideoDeviceId">视频设备</Label>
                            <LocalVideoSelect
                                defaultValue={localVideoDeviceId}
                                onDeviceChange={setLocalVideoDeviceId}></LocalVideoSelect>
                        </div>
                        <div>
                            <Label htmlFor="localAudioDeviceId">麦克风</Label>
                            <LocalAudioSelect
                                defaultValue={localAudioDeviceId}
                                onDeviceChange={setLocalAudioDeviceId}></LocalAudioSelect>
                        </div>
                        {/* 分辨率 */}

                        <div>
                            <Label htmlFor="localVideo">本地视频分辨率</Label>
                            <Select
                                onValueChange={(value) => {
                                    const [width, height] = value.split('*');
                                    setLocalVideoWidth(parseInt(width, 10));
                                    setLocalVideoHeight(parseInt(height, 10));
                                }}
                                defaultValue={[localVideoWidth || 0, localVideoHeight || 0].join(
                                    '*',
                                )}>
                                <SelectTrigger>
                                    <SelectValue placeholder="选择本地视频分辨率" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={'0*0'}>不限</SelectItem>
                                    <SelectItem value={'640*480'}>640*480</SelectItem>
                                    <SelectItem value={'1280*720'}>1280*720</SelectItem>
                                    <SelectItem value={'1920*1080'}>1920*1080</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </FormContainer>
                </Panel>
                <Panel>
                    <div className="font-bold">响铃设置</div>
                    <FormContainer>
                        {/* 铃声选择 */}
                        <div>
                            <Label htmlFor="ringValue">铃声</Label>
                            {/* ip地址的validate */}
                            {/* select */}
                            <Select onValueChange={setRingValue} defaultValue={ringValue}>
                                <SelectTrigger>
                                    <SelectValue placeholder="选择铃声" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={ringing}>响铃1</SelectItem>
                                    <SelectItem value={ringing2}>响铃2</SelectItem>
                                    <SelectItem value={ringtone}>响铃3</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {/* 响铃时长 */}
                        <div>
                            <Label htmlFor="ringDuration">响铃时长(单位:秒)</Label>
                            {/* ip地址的validate */}
                            <Input
                                type="number"
                                id="ringDuration"
                                value={ringDuration}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setRingDuration(value);
                                }}
                            />
                        </div>
                    </FormContainer>
                </Panel>
                <Panel>
                    <div className="font-bold">语音播报</div>
                    <FormContainer>
                        {/* 是否呼入播报 */}
                        <div className="">
                            <Label htmlFor="isSpeakOn">语音播报</Label>
                            <div className="flex items-center h-10">
                                <Switch
                                    id="isSpeakOn"
                                    checked={isSpeakOn}
                                    onCheckedChange={(value) => {
                                        setIsSpeakOn(value);
                                    }}
                                />
                            </div>
                        </div>
                        {/* 播报次数 */}
                        <div>
                            <Label htmlFor="speakRepeatTimes">播报次数</Label>
                            <Input
                                type="number"
                                id="speakRepeatTimes"
                                value={speakRepeatTimes}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value, 10);
                                    setSpeakRepeatTimes(value);
                                }}
                            />
                        </div>
                        {/* 播报语速 */}
                        <div>
                            <Label htmlFor="speakRate">语速</Label>
                            {/* ip地址的validate */}
                            <Input
                                type="number"
                                id="speakRate"
                                value={speakRate}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSpeakRate(value);
                                }}
                            />
                        </div>
                        <Button onClick={testSpeaker}>测试语音</Button>
                    </FormContainer>
                </Panel>
            </div>
        </div>
    );
};

// 默认导出
export default CallingSettings;

function Panel({ children }: { children?: ReactNode }) {
    return <div className="p-6 rounded-lg shadow bg-card text-card-foreground">{children}</div>;
}
