import React, { useState, useEffect } from "react";
import { Button, MenuItem } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";

/* Randomize array in-place using Durstenfeld shuffle algorithm */
const shuffleArray = (array) => {
	for (let i = array.length - 1; i >= 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}

	return array
}

function StakePoolSelector(props) {

	const [selectedPool, setSelectedPool] = useState({ticker: "Placeholder", pool_id_bech32: "stake pools are loading"});
	const [allPoolTickers, setAllPoolTickers] = useState([selectedPool])

	useEffect(() => {
		// console.log(props.allStakePoolInfo)

		const allStakePoolInfo = shuffleArray(props.allStakePoolInfo)

		let poolTickers = []
		for (const x of allStakePoolInfo) {
			const ticker = x?.ticker;
			const pool_id_bech32 = x?.pool_id_bech32;
			const poolDict = {ticker, pool_id_bech32}
			poolTickers.push(poolDict)
		}
		setAllPoolTickers(poolTickers)
	}, [props])


	return (

		<Select
			items={allPoolTickers}
			// selectedItems={items}
			itemPredicate = {(query, val, _index, exactMatch) => {
				const normalizedTitle = val.ticker.toLowerCase();
				const normalizedQuery = query.toLowerCase();

				if (exactMatch) {
					return normalizedTitle === normalizedQuery;
				} else {
					return normalizedTitle.indexOf(normalizedQuery) >= 0
				}
			}}
			fill={true}

			itemRenderer={(val, { handleClick, handleFocus, modifiers, query }) => {
				if (!modifiers.matchesPredicate) {
					return null;
				}
				return (
					<MenuItem
						roleStructure="listoption"
						key={val.pool_id_bech32}
						text={`${val.ticker.padEnd("12", ".")} ${val.pool_id_bech32}`}
						style={{fontFamily: "monospace"}}
						onClick={handleClick}
						onFocus={handleFocus}
						active={modifiers.active}
					/>
				);

			}}

			onItemSelect={setSelectedPool}
			placeholder="Select a Pool"
			noResults={<MenuItem disabled={true} text="No results." roleStructure="listoption" />}
		>
			<Button text={selectedPool?.ticker} rightIcon="double-caret-vertical" placeholder="Select a Stake Pool" />
		</Select>

	);
}

export default StakePoolSelector;
