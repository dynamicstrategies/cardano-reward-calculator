import React, { useState, useEffect } from "react";
import { Popover, Classes, Position  } from "@blueprintjs/core";
import {InformationCircleIcon} from "@heroicons/react/24/outline";

function InfoHoverComponent({children}) {

	// const [state, setState] = useState("a");
	//
	//
	// useEffect(() => {
	//
	// }, [props])


	return (


		<div>
			<Popover
				content={
					<div className="p-4 lg:max-w-xl bg-blue-primary text-white">
						{children}
					</div>
				}
				interactionKind="click"
				position="auto"
				hoverOpenDelay={0} // Delay in milliseconds before opening
				hoverCloseDelay={0} // Delay in milliseconds before closing
			>
				<InformationCircleIcon
					key="infocircle_pool_1"
					className="h-5 w-5 text-gray-700"
					aria-hidden="true"
					cursor="pointer"
					onClick={() => {

					}}>
				</InformationCircleIcon>
			</Popover>
		</div>

	);
}

export default InfoHoverComponent;
