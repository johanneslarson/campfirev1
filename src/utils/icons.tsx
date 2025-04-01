import React from 'react';
import * as FaIconsLib from 'react-icons/fa';

// Define a custom interface that includes the size prop
interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

// Create a mapping of icon names to components with custom props
const FaIcons: Record<string, React.FC<IconProps>> = {};

// Iterate through all the icons and create proper React components
Object.entries(FaIconsLib).forEach(([key, Icon]) => {
  FaIcons[key] = (props) => React.createElement(Icon as any, props);
});

export { FaIcons }; 