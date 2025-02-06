import React, { Component } from "react";
import packageJson from "../package.json"; // Adjust the path as needed

class VersionDisplay extends Component {
	render() {
		return (
			<div className="ml-1 mt-4 text-gray-600">
				version: {packageJson.version}
			</div>
		);
	}
}

export default VersionDisplay;
