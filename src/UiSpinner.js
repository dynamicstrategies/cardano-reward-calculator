import React from "react";
import {Spinner, Intent} from "@blueprintjs/core";

function UiSpinner(props) {

	return (


		<div className="flex flex-row">
			<Spinner
				aria-label={`Loading ${props.progress * 100}% complete`}
				intent={Intent.NONE}
				size={25}
				value={props.progress}
			/>
			<p className="text-base font-normal ml-4">loading stake pools ...</p>
		</div>

	);
}

export default UiSpinner;
