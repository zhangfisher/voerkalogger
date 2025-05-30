import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';

interface PortalProps {
  children: ReactNode;
  container?: HTMLElement;
}

export const Portal: React.FC<PortalProps> = ({ children, container = document.body }) => {
  return ReactDOM.createPortal(children, container);
};

export default Portal;
