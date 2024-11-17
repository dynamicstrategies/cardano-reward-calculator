import React, { useState, useEffect } from "react";
import { Button, MenuItem } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
import {shuffleArray} from "./utils";

function StakePoolSelector(props) {

	const [selectedPool, setSelectedPool] = useState({
		ticker: "Select ...",
		pool_id_bech32: "stake pools are loading",
		stakePoolN: undefined
	});

	const [allPoolTickers, setAllPoolTickers] = useState([selectedPool])

	useEffect(() => {
		// console.log(props.allStakePoolInfo)

		const allStakePoolInfo = shuffleArray(props.allStakePoolInfo)
		const stakePoolN = props.stakePoolN

		let poolTickers = []
		for (const x of allStakePoolInfo) {
			const ticker = x?.ticker;
			const pool_id_bech32 = x?.pool_id_bech32;
			const poolDict = {ticker, pool_id_bech32, stakePoolN}
			poolTickers.push(poolDict)
		}

		setAllPoolTickers(poolTickers)
	}, [props])

	useEffect(() => {
		if (selectedPool?.ticker !== "Select ...") {
			console.log(selectedPool)
			props.handlePoolSelect(selectedPool)
		}
	}, [selectedPool])


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
			// onItemSelect={p => props.handlePoolSelect(p)}
			placeholder="Select a Pool"
			noResults={<MenuItem disabled={true} text="No results." roleStructure="listoption" />}
		>
			<Button text={selectedPool?.ticker} rightIcon="double-caret-vertical" placeholder="Select a Stake Pool" />
		</Select>





	);
}

export default StakePoolSelector;
