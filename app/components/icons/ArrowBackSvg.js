import React from 'react';

const ArrowBackSvg = ({ width = '800px', height = '800px', fill = '#0F1729', ...props }) => {
	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path d="M15 7L10 12L15 17" stroke="#4c0519" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
};

export default ArrowBackSvg;
