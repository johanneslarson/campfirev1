declare module 'react-simple-maps' {
  import React from 'react';
  
  export interface ComposableMapProps {
    projection?: string;
    className?: string;
    [key: string]: any;
  }

  export interface GeographiesProps {
    geography: string | object;
    children: (props: { geographies: any[] }) => React.ReactNode;
    [key: string]: any;
  }

  export interface GeographyProps {
    geography: any;
    key: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    [key: string]: any;
  }

  export interface MarkerProps {
    coordinates: [number, number];
    key?: string;
    children?: React.ReactNode;
    [key: string]: any;
  }

  export interface ZoomableGroupProps {
    zoom?: number;
    center?: [number, number];
    children?: React.ReactNode;
    [key: string]: any;
  }

  export const ComposableMap: React.FC<ComposableMapProps>;
  export const Geographies: React.FC<GeographiesProps>;
  export const Geography: React.FC<GeographyProps>;
  export const Marker: React.FC<MarkerProps>;
  export const ZoomableGroup: React.FC<ZoomableGroupProps>;
} 