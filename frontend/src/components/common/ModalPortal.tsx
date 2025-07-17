import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalPortalProps {
  children: React.ReactNode;
  isOpen: boolean;
}

const ModalPortal: React.FC<ModalPortalProps> = ({ children, isOpen }) => {
  const elRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    if (!elRef.current) {
      elRef.current = document.createElement('div');
      elRef.current.className = 'modal-portal';
    }
    
    const modalRoot = elRef.current;
    
    if (isOpen) {
      document.body.appendChild(modalRoot);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      if (modalRoot.parentElement) {
        modalRoot.parentElement.removeChild(modalRoot);
        document.body.style.overflow = '';
      }
    };
  }, [isOpen]);
  
  if (!isOpen || !elRef.current) return null;
  
  return createPortal(children, elRef.current);
};

export default ModalPortal;