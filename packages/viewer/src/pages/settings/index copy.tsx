import * as React from "react";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface SettingsFormData {
  userId: string;
  ipAddress: string;
  ringtone: string;
  ringDuration: number;
  ringDevice: string;
  speaker: string;
  microphone: string;
  volume: number;
  videoResolution: string;
}

const resolutions = ["640x480", "1280x720", "1920x1080"];

export function SettingsForm() {
  const [devices, setDevices] = React.useState<MediaDeviceInfo[]>([]);
  const { register, handleSubmit, watch, setValue } = useForm<SettingsFormData>(
    {
      defaultValues: {
        userId: "user123",
        ipAddress: "",
        ringtone: "",
        ringDuration: 30,
        ringDevice: "",
        speaker: "",
        microphone: "",
        volume: 50,
        videoResolution: "1280x720",
      },
    }
  );

  React.useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      setDevices(devices);
    });
  }, []);

  const onValueChange = (name: keyof SettingsFormData, value: any) => {
    setValue(name, value);
    console.log(`Saving ${name}:`, value);
  };

  return (
    <main className="space-y-4 p-4 max-w-[1200px] mx-auto">
      {/* 连接设置 */}
      <div className="p-6 rounded-lg shadow bg-primary-foreground">
        <h2 className="mb-4 text-lg font-semibold">连接设置</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="userId">账号</Label>
            <Input
              id="userId"
              {...register("userId")}
              readOnly
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ipAddress">IP 地址</Label>
            <Input
              id="ipAddress"
              {...register("ipAddress")}
              onChange={(e) => onValueChange("ipAddress", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 响铃配置 */}
      <div className="p-6 rounded-lg shadow bg-primary-foreground">
        <h2 className="mb-4 text-lg font-semibold">响铃配置</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ringtone">铃声文件</Label>
            <Input
              id="ringtone"
              type="file"
              accept="audio/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onValueChange("ringtone", file.name);
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ringDuration">响铃时长 (秒)</Label>
            <Input
              id="ringDuration"
              type="number"
              {...register("ringDuration")}
              onChange={(e) => onValueChange("ringDuration", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 设备配置 */}
      <div className="p-6 rounded-lg shadow bg-primary-foreground">
        <h2 className="mb-4 text-lg font-semibold">设备配置</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ringDevice">响铃设备</Label>
            <Select
              onValueChange={(value) => onValueChange("ringDevice", value)}
              defaultValue={watch("ringDevice")}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择响铃设备" />
              </SelectTrigger>
              <SelectContent>
                {devices
                  .filter((device) => device.kind === "audiooutput")
                  .map((device) => (
                    <SelectItem key={device.deviceId} value={device.deviceId}>
                      {device.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="speaker">扬声器</Label>
            <Select
              onValueChange={(value) => onValueChange("speaker", value)}
              defaultValue={watch("speaker")}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择扬声器" />
              </SelectTrigger>
              <SelectContent>
                {devices
                  .filter((device) => device.kind === "audiooutput")
                  .map((device) => (
                    <SelectItem key={device.deviceId} value={device.deviceId}>
                      {device.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="microphone">麦克风</Label>
            <Select
              onValueChange={(value) => onValueChange("microphone", value)}
              defaultValue={watch("microphone")}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择麦克风" />
              </SelectTrigger>
              <SelectContent>
                {devices
                  .filter((device) => device.kind === "audioinput")
                  .map((device) => (
                    <SelectItem key={device.deviceId} value={device.deviceId}>
                      {device.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 通话配置 */}
      <div className="p-6 rounded-lg shadow bg-primary-foreground">
        <h2 className="mb-4 text-lg font-semibold">通话配置</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="volume">音量</Label>
            <Slider
              id="volume"
              min={0}
              max={100}
              step={1}
              value={[watch("volume")]}
              onValueChange={([value]) => onValueChange("volume", value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="videoResolution">视频分辨率</Label>
            <Select
              onValueChange={(value) => onValueChange("videoResolution", value)}
              defaultValue={watch("videoResolution")}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择分辨率" />
              </SelectTrigger>
              <SelectContent>
                {resolutions.map((resolution) => (
                  <SelectItem key={resolution} value={resolution}>
                    {resolution}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </main>
  );
}

export default SettingsForm;
