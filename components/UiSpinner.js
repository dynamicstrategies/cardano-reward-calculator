import React from "react";
import {Spinner, Intent} from "@blueprintjs/core";
import {uiText} from "@/components/infos";

function UiSpinner(props) {

	return (


		<div className="flex flex-row">
			<Spinner
				aria-label={`Loading ${props.progress * 100}% complete`}
				intent={Intent.NONE}
				size={25}
				value={props.progress}
			/>
			<div className="text-base font-normal ml-4">
				{uiText["loading_stake_pools_label"][props.lang]}
			</div>
		</div>

	);
}

export default UiSpinner;
