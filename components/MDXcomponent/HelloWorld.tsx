const HelloWorld = ({ text }: { text: string }) => {
	return (
		<div>
			<p className=' italic text-red-400'>{text}</p>
		</div>
	);
};
export default HelloWorld;
