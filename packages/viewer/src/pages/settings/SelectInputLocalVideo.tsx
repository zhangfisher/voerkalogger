/**
 * @author
 * @file SelectInputLocalVideo.tsx
 * @fileBase SelectInputLocalVideo
 * @path projects\web-client\src\pages\settings\SelectInputLocalVideo.tsx
 * @from
 * @desc
 * @example
 */
import { Label } from '@/components/ui/label';
import SelectInput from './SelectInput';
export interface SelectInputLocalVideoProps {
    // value: any
}
export const SelectInputLocalVideo: React.FC<SelectInputLocalVideoProps> = () => {
    return (
        <>
            <div>
                {/* 本地视频宽度 */}
                <Label htmlFor="localVideoWidth">本地视频宽度{'(0就是不设置)'}</Label>
                <SelectInput
                    type="number"
                    min={0}
                    options={[0, 640, 1280, 1920]}
                    id="localVideoWidth"
                    value={localVideoWidth}
                    onChange={(value) => {
                        setLocalVideoWidth(value);
                    }}></SelectInput>
            </div>
            <div>
                {/* 本地视频高度 */}
                <Label htmlFor="localVideoHeight">本地视频高度</Label>
                <SelectInput
                    type="number"
                    id="localVideoHeight"
                    min={0}
                    options={[0, 480, 720, 1080]}
                    value={localVideoHeight}
                    onChange={(value) => {
                        setLocalVideoHeight(value || 0);
                    }}></SelectInput>
            </div>
        </>
    );
};

// 默认导出
export default SelectInputLocalVideo;
