import React, { useState, useEffect } from "react";
import { Button, MenuItem } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
import {shuffleArray} from "./utils";

let prevSelectedPool = {}

// function StakePoolSelector(props) {
function StakePoolSelector({stakePoolN, allStakePoolInfo, handlePoolSelect}) {

	const [selectedPool, setSelectedPool] = useState({
		ticker: "Select ...",
		pool_id_bech32: "stake pools are loading",
		stakePoolN: undefined
	});

	const [allPoolTickers, setAllPoolTickers] = useState([selectedPool])


	/**
	 * Action initial load of all stake pools
	 */
	useEffect(() => {

		// split into pools with a ticker and without
		// const poolsWithTicker = []
		// const poolsNoTicker = []
		//
		// for (const x of allStakePoolInfo) {
		// 	if (x["ticker"]) {
		// 		poolsWithTicker.push(x)
		// 	} else {
		// 		x["ticker"] = "no_ticker"
		// 		poolsNoTicker.push(x)
		// 	}
		// }
		//
		// console.log("--- do the shuffle ---")
		// const poolsWithTicker_shuffled = shuffleArray(poolsWithTicker)
		//
		// const allStakePoolInfo_shuffled = poolsWithTicker_shuffled.concat(poolsNoTicker)

		let poolTickers = []
		for (const x of allStakePoolInfo) {
			const ticker = x?.ticker;
			const pool_id_bech32 = x?.pool_id_bech32;
			const poolDict = {ticker, pool_id_bech32, stakePoolN}
			poolTickers.push(poolDict)
		}

		setAllPoolTickers(poolTickers)
	}, [allStakePoolInfo, stakePoolN])


	/**
	 * Action pool selection
	 */
	useEffect(() => {

		if (selectedPool?.ticker !== "Select ...") {
			console.log(selectedPool)
			handlePoolSelect(selectedPool)
		}

	}, [selectedPool, handlePoolSelect])


	return (


		<Select
			items={allPoolTickers}
			// selectedItems={items}
			itemPredicate = {(query, val, _index, exactMatch) => {
				// const normalizedTitle = val.ticker.toLowerCase();
				const normalizedTitle = `${val.ticker.padEnd("12", ".")} ${val.pool_id_bech32}`.toLowerCase();
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
			// onItemSelect={p => props.handlePoolSelect(p)}
			placeholder="Select a Pool"
			noResults={<MenuItem disabled={true} text="No results." roleStructure="listoption" />}
			menuProps={{
				style: {
					maxHeight: "300px",  // Limit the dropdown height
					overflowY: "auto",   // Enable vertical scrolling
				},
			}}
		>
			<Button text={selectedPool?.ticker} rightIcon="double-caret-vertical" fill={true} placeholder="Select a Stake Pool" />
		</Select>





	);
}

export default StakePoolSelector;
