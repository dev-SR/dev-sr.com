// https://kimia-ui.vercel.app/components/modal

import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
/*  @reach/portal simplify creating portal*/
import { Portal } from '@reach/portal';
import { useClickAway } from 'react-use';

type ModalProps = {
	isOpen: boolean;
	children: React.ReactNode;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const className = {
	placeholder: `fixed inset-0  w-screen h-screen m-0 shadow rounded overflow-y-auto flex justify-center items-center  z-50 `,
	overlay: `fixed inset-0 w-screen h-screen bg-black/80 z-40`,
	modal: `max-h-min max-w-sm md:max-w-xl bg-white shadow dark:bg-zinc-900  rounded-2xl `
};

const modalVariant = {
	initial: { opacity: 0, y: 60, scale: 0.3 },
	animate: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			type: 'spring',
			stiffness: 100,
			duration: 0.2,
			when: 'beforeChildren'
		}
	},
	exit: { opacity: 0, scale: 0.5, transition: { duration: 0.25 } }
};

const modalContentVariant = {
	initial: { x: -30, opacity: 0 },
	animate: { x: 0, opacity: 1, transition: { duration: 0.2 } }
};

const Modal = ({ isOpen, setIsOpen, children }: ModalProps) => {
	const ref = React.useRef<HTMLDivElement>(null);

	// close modal on click outside
	const handleOutsideClick = () => {
		if (!isOpen) return;
		setIsOpen(false);
	};
	useClickAway(ref, handleOutsideClick);

	// hide scrollbar and prevent body from moving when modal is open
	//put focus on modal dialogue
	// React.useEffect(() => {
	// 	if (!isOpen) return;

	// 	ref.current?.focus();

	// 	const html = document.documentElement;
	// 	const scrollbarWidth = window.innerWidth - html.clientWidth;

	// 	html.style.overflow = 'hidden';
	// 	html.style.paddingRight = `${scrollbarWidth}px`;

	// 	return () => {
	// 		html.style.overflow = '';
	// 		html.style.paddingRight = '';
	// 	};
	// }, [isOpen]);

	React.useEffect(() => {
		const body = document.querySelector('body');
		if (body) {
			if (isOpen) {
				body.style.overflow = 'hidden';
			} else {
				body.style.overflow = 'auto';
			}
		}
	}, [isOpen]);

	return (
		<Portal>
			<AnimatePresence>
				{isOpen && (
					<>
						<div className={className.overlay} />
						<motion.div className={className.placeholder}>
							<motion.div
								className={className.modal}
								ref={ref}
								variants={modalVariant}
								initial='initial'
								animate='animate'
								exit='exit'>
								<motion.div variants={modalContentVariant}>{children}</motion.div>
							</motion.div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</Portal>
	);
};

export default Modal;
