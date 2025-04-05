import React from 'react';
import * as FaIconsLib from 'react-icons/fa';
import { 
  FaHome, 
  FaUserFriends, 
  FaSearch, 
  FaListUl, 
  FaChartBar, 
  FaCog,
  FaPlay,
  FaPause,
  FaBackward,
  FaForward,
  FaVolumeUp,
  FaVolumeMute,
  FaMap,
  FaMapMarkerAlt
} from 'react-icons/fa';

// Define a custom interface that includes the size prop
interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

// Create a mapping of icon names to components with custom props
const FaIcons: Record<string, React.FC<IconProps>> = {};

// Create React components for the explicitly imported icons using createElement
FaIcons.FaHome = (props) => React.createElement(FaHome as any, props);
FaIcons.FaUserFriends = (props) => React.createElement(FaUserFriends as any, props);
FaIcons.FaSearch = (props) => React.createElement(FaSearch as any, props);
FaIcons.FaListUl = (props) => React.createElement(FaListUl as any, props);
FaIcons.FaChartBar = (props) => React.createElement(FaChartBar as any, props);
FaIcons.FaCog = (props) => React.createElement(FaCog as any, props);
FaIcons.FaPlay = (props) => React.createElement(FaPlay as any, props);
FaIcons.FaPause = (props) => React.createElement(FaPause as any, props);
FaIcons.FaBackward = (props) => React.createElement(FaBackward as any, props);
FaIcons.FaForward = (props) => React.createElement(FaForward as any, props);
FaIcons.FaVolumeUp = (props) => React.createElement(FaVolumeUp as any, props);
FaIcons.FaVolumeMute = (props) => React.createElement(FaVolumeMute as any, props);
FaIcons.FaMap = (props) => React.createElement(FaMap as any, props);
FaIcons.FaMapMarkerAlt = (props) => React.createElement(FaMapMarkerAlt as any, props);

// Iterate through all the other icons and create proper React components
Object.entries(FaIconsLib).forEach(([key, Icon]) => {
  if (!FaIcons[key]) {
    FaIcons[key] = (props) => React.createElement(Icon as any, props);
  }
});

export { FaIcons }; 