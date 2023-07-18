'use client';
import React from 'react';
import {
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogTitle
} from './ui/alert-dialog';

const AlertMessage = () => {
	// Check if there is any previous state stored in local storage, otherwise default to true
	const initialOpen = JSON.parse(localStorage.getItem('alertOpen') || 'true');

	const [open, setOpen] = React.useState<boolean>(initialOpen);

	// Store the state in local storage whenever it changes
	React.useEffect(() => {
		localStorage.setItem('alertOpen', JSON.stringify(open));
	}, [open]);
	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>This website is still under development!!</AlertDialogTitle>
					<AlertDialogDescription>
						Current posts are dummy posts. We will share real posts on natural language processing,
						machine learning, web development etc. once the website is fully developed.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogAction>Continue</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default AlertMessage;
