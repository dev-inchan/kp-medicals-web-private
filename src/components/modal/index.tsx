import { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import style from './index.module.scss';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  width?: string;
  height?: string;
}

const Modal = ({ open, onClose, children, width = '360px', height = '360px' }: ModalProps) => {
  if (!open) return null;
  return ReactDOM.createPortal(
    <>
      <div className={style.overlayStyle} />
      <div className={style.modalStyle} style={{ width, height }}>
        <span className={style.modalClose} onClick={onClose}>
          <svg width='16px' height='12' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'>
            <path
              fill='#3E4042'
              fill-rule='evenodd'
              d='M.203.203c.27-.27.708-.27.979 0L6 5.02 10.818.203c.27-.27.709-.27.98 0 .27.27.27.708 0 .979L6.978 6l4.818 4.818c.27.27.27.709 0 .98-.27.27-.709.27-.979 0L6 6.978l-4.818 4.818c-.27.27-.709.27-.98 0-.27-.27-.27-.709 0-.979L5.022 6 .203 1.182c-.27-.27-.27-.709 0-.98z'
              clip-rule='evenodd'
            ></path>
          </svg>
        </span>

        {children}
      </div>
    </>,
    document.getElementById('modal') as HTMLElement,
  );
};

export default Modal;
