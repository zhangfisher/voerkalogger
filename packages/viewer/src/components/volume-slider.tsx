/**
 * @author
 * @file volume-slider.tsx
 * @fileBase volume-slider
 * @path projects\web-client\src\components\volume-slider.tsx
 * @from
 * @desc
 * @example
 */
/**
 * # TODO
 * - 滚轮
 * # DONE
 * ## 20241216 星期一
 * # FUTURE
 */

import { Volume, Volume1, Volume2 } from 'lucide-react';
import { Slider } from './ui/slider';
import { cn } from '@/app';
export interface VolumeSliderProps {
  value: number;
  onValueChange: (value: number) => any;
  className?: string;
}
export const VolumeSlider: React.FC<VolumeSliderProps> = ({ value, onValueChange, className }) => {
  function handleValueChange(volume: number[]) {
    onValueChange(volume[0]);
  }
  function handleWheel(event: React.WheelEvent) {
    const step = 10;
    event.preventDefault();
    const direction = event.deltaY < 0 ? 1 : -1;
    const newVolume = Math.max(0, Math.min(100, value + direction * step)); // 限制音量值在0到100之间
    onValueChange(newVolume);
    return newVolume;
  }
  function toggleVolume() {
    onValueChange(value === 0? 50 : 0);
  }
  return (
    <div
      className={cn('flex items-center gap-2 min-w-[200px]', className)}
      title={'' + value}
      onWheel={handleWheel} // 添加onWheel事件处理器
    >
      <span onClick={toggleVolume} className="text-white">
        {/* <Button variant="ghost" className={"text-white"}> */}
        {value < 1 && <Volume className="text-white" size={24}></Volume>}
        {value >= 1 && value < 50 && <Volume1 className="" size={24}></Volume1>}
        {value >= 50 && value <= 100 && <Volume2 className="text-white" size={24} />}
      </span>
      {/* </Button> */}
      <Slider
        value={[value]}
        onValueChange={handleValueChange}
        max={100}
        step={1}
        className="w-32"
      />
    </div>
  );
};
