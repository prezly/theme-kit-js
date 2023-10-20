/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */
import { useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import tinycolor from 'tinycolor2';

const DARKNESS_THRESHOLD = 180;
const BRIGHTNESS_THRESHOLD = 220;

interface ColorSwatchProps {
    value: string;
    hex: string;
}

export function ColorSwatch({ value, hex }: ColorSwatchProps) {
    const [notification, setNotification] = useState('');
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const color = tinycolor(hex);
    const isDark = color.getBrightness() < DARKNESS_THRESHOLD;
    const isBright = color.getBrightness() > BRIGHTNESS_THRESHOLD;
    const borderColor = isBright ? color.clone().darken(5).toHexString() : undefined;

    function handleValueClick() {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        navigator.clipboard.writeText(hex);
        setNotification('Value copied!');
        timeoutRef.current = setTimeout(() => setNotification(''), 2000);
    }

    return (
        <div
            className="relative p-4 border-transparent border-[1px] rounded-lg"
            style={{ backgroundColor: hex, borderColor }}
        >
            <p
                className={twMerge(
                    'font-medium text-sm text-gray-800 opacity-50 uppercase m-0',
                    isDark && 'text-white',
                )}
            >
                {notification}
            </p>
            <p
                className={twMerge(
                    'font-bold text-lg leading-7 text-gray-800 m-0',
                    isDark && 'text-gray-50',
                )}
                onClick={handleValueClick}
            >
                {value}
            </p>
        </div>
    );
}
