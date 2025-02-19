import axios from "axios";

// const KOIOS_URL = "http://localhost:7070/proxy"
const KOIOS_URL = process.env.NEXT_PUBLIC_KOIOS_URL
const KOIOS_TOKEN = process.env.NEXT_PUBLIC_KOIOS_TOKEN
/**
 * Gets the blockchain tip with, this gives us the
 * most recent Epoch Number and Slot
 *
 * Docs: https://api.koios.rest/#get-/tip
 *
 * Sample output of the query
 *
 * [
 *   {
 *     "hash": "5c97f09baf48b806e5f94b1d36f28cb01d70927fbc6d17738371cb27e6c0228f",
 *     "epoch_no": 527,
 *     "abs_slot": 142362344,
 *     "epoch_slot": 61544,
 *     "block_no": 11206455,
 *     "block_time": 1733928635
 *   }
 * ]
 */

export const getChainTip = async () => {

	console.log(KOIOS_URL)

	try {
		const response = await axios({
			method: 'get',
			url: '/tip',
			baseURL: KOIOS_URL,
			headers: {'accept': 'application/json'},
			// headers: {'accept': 'application/json', 'Authorization': `Bearer ${KOIOS_TOKEN}`},

		})

		if (response.status === 200) {
			const data = response.data[0];
			return data

		} else {
			console.error(response)
		}

	} catch(err) {
		console.error("Could not retrieve Chain Tip");
	}

}

/**
 * Get the protocol parameters. The important ones
 * for the calculator are:
 * - monetaryExpansion
 * - poolPledgeInfluence
 * - treasuryCut
 *
 * Docs: https://api.koios.rest/#get-/cli_protocol_params
 *
 * Sample Output
 *
 * {
 *   "collateralPercentage": 150,
 *   "committeeMaxTermLength": 146,
 *   "committeeMinSize": 7,
 *   "costModels": {
 *     "PlutusV1": [...],
 *     "PlutusV2": [...],
 *     "PlutusV3": [...]
 *   },
 *   "dRepActivity": 20,
 *   "dRepDeposit": 500000000,
 *   "dRepVotingThresholds": {...},
 *   "executionUnitPrices": {...},
 *   "govActionDeposit": 100000000000,
 *   "govActionLifetime": 6,
 *   "maxBlockBodySize": 90112,
 *   "maxBlockExecutionUnits": {...},
 *   "maxBlockHeaderSize": 1100,
 *   "maxCollateralInputs": 3,
 *   "maxTxExecutionUnits": {
 *     "memory": 14000000,
 *     "steps": 10000000000
 *   },
 *   "maxTxSize": 16384,
 *   "maxValueSize": 5000,
 *   "minFeeRefScriptCostPerByte": 15,
 *   "minPoolCost": 170000000,
 *   "monetaryExpansion": 0.003,
 *   "poolPledgeInfluence": 0.3,
 *   "poolRetireMaxEpoch": 18,
 *   "poolVotingThresholds": {...},
 *   "protocolVersion": {...},
 *   "stakeAddressDeposit": 2000000,
 *   "stakePoolDeposit": 500000000,
 *   "stakePoolTargetNum": 500,
 *   "treasuryCut": 0.2,
 *   "txFeeFixed": 155381,
 *   "txFeePerByte": 44,
 *   "utxoCostPerByte": 4310
 * }
 *
 */

export const getProtocolParams = async () => {

	try {
		const response = await axios({
			method: 'get',
			url: '/cli_protocol_params',
			baseURL: KOIOS_URL,
			headers: {'accept': 'application/json'},
			// headers: {'accept': 'application/json', 'Authorization': `Bearer ${KOIOS_TOKEN}`},

		})

		if (response.status === 200) {
			const data = response.data;
			return data

		} else {
			console.error(response)
		}

	} catch(err) {
		console.error("Could not retrieve Protocol Parameters");
	}

}

/**
 * Get the epoch info. This contains the total active stake
 * and the fee from activity on the blockchain
 *
 * Docs: https://api.koios.rest/api/v1/epoch_info
 *
 * Sample output:
 * [
 *   {
 *     "epoch_no": 527,
 *     "out_sum": "15624945172958663",
 *     "fees": "27254643835",
 *     "tx_count": 82120,
 *     "blk_count": 3146,
 *     "start_time": 1733867091,
 *     "end_time": 1734299091,
 *     "first_block_time": 1733867097,
 *     "last_block_time": 1733930098,
 *     "active_stake": "21802449607298101",
 *     "total_rewards": null,
 *     "avg_blk_reward": "16129032"
 *   }
 * ]
 *
 */

export const getEpochInfo = async (currentEpochN) => {

	try {

		const payload = {
			_epoch_no: String(currentEpochN),
			_include_next_epoch: false
		}

		const response = await axios({
			method: 'get',
			url: '/epoch_info',
			baseURL: KOIOS_URL,
			params: payload,
			headers: {'accept': 'application/json'},
			// headers: {'accept': 'application/json', 'Authorization': `Bearer ${KOIOS_TOKEN}`},

		})

		if (response.status === 200) {

			const data = response.data[0];
			return data

		} else {
			console.error(response)
		}

	} catch(err) {
		console.error("Could not retrieve Epoch Info");
	}

}


/**
 * Get the circulating utxo, treasury, rewards, supply and reserves in lovelace for specified epoch
 *
 * Docs: https://api.koios.rest/#get-/totals
 *
 * Sample output:
 *
 * [
 *   {
 *     "epoch_no": 527,
 *     "circulation": "35112728715277787",
 *     "treasury": "1619326627836757",
 *     "reward": "705371594371509",
 *     "supply": "37442369580560329",
 *     "reserves": "7557630419439671"
 *   }
 * ]
 *
 */
export const getReserves = async (currentEpochN) => {

	try {

		const payload = {
			_epoch_no: String(currentEpochN),
		}

		const response = await axios({
			method: 'get',
			url: '/totals',
			baseURL: KOIOS_URL,
			params: payload,
			headers: {'accept': 'application/json'},
			// headers: {'accept': 'application/json', 'Authorization': `Bearer ${KOIOS_TOKEN}`},

		})

		if (response.status === 200) {

			const data = response.data[0];
			return data

		} else {
			console.error(response)
		}

	} catch(err) {
		console.error("Could not retrieve Reserves Info");
	}

}

/**
 * Get a list of all stake pool with brief info for each
 *
 * Docs: https://api.koios.rest/#get-/pool_list
 *
 * Sample output:
 *
 * [
 *   {
 *     "pool_id_bech32": "pool1z5uqdk7dzdxaae5633fqfcu2eqzy3a3rgtuvy087fdld7yws0xt",
 *     "pool_id_hex": "153806dbcd134ddee69a8c5204e38ac80448f62342f8c23cfe4b7edf",
 *     "active_epoch_no": 496,
 *     "margin": 0.009,
 *     "fixed_cost": "340000000",
 *     "pledge": "400000000000",
 *     "deposit": null,
 *     "reward_addr": "stake1uy89kzrdlpaz5rzu8x95r4qnlpqhd3f8mf09edjp73vcs3qhktrtm",
 *     "owners": [
 *       "stake1uy89kzrdlpaz5rzu8x95r4qnlpqhd3f8mf09edjp73vcs3qhktrtm"
 *     ],
 * ...
 *
 */

export const getStakePoolList = async () => {

	const stepSize = 1000
	let reachedEnd = false
	let i = 0
	let poolsData = []

	while (!reachedEnd) {

		// reachedEnd = true

		const offset = i*stepSize
		console.log("processed stake pools: " + offset)

		try {
			const payload = {
				offset,
				limit: stepSize,
				select: "pool_id_bech32,ticker,pool_status",
				pool_status: "in.(registered,retiring)"
			}

			const response = await axios({
				method: 'get',
				url: '/pool_list',
				baseURL: KOIOS_URL,
				params: payload,
				headers: {'accept': 'application/json'},
				// headers: {'accept': 'application/json', 'Authorization': `Bearer ${KOIOS_TOKEN}`},

			})

			if (response.status === 200) {

				const data = response.data;

				if (data.length) {
					poolsData = poolsData.concat(data)
				} else {
					reachedEnd = true
				}


			} else {
				reachedEnd = true
				console.error(response)
			}

		} catch(err) {
			reachedEnd = true
			console.error("Could not retrieve List of Stake Pools");
		}

		i++;

	}

	return poolsData

}


/**
 * Gets detailed info for a pool id
 *
 * Docs: https://api.koios.rest/#post-/pool_info
 *
 * [
 *   {
 *     "pool_id_bech32": "pool1dts0h87pntgmsffp6mjtnahfht2dz5zjjeeujhzmtn6wgctcuzd",
 *     "pool_id_hex": "6ae0fb9fc19ad1b82521d6e4b9f6e9bad4d150529673c95c5b5cf4e4",
 *     "active_epoch_no": 316,
 *     "vrf_key_hash": "c25f24f437676c58faf046ac9a6890f03bbfbaab8a0745e20e3a63d32a61b535",
 *     "margin": 0.009,
 *     "fixed_cost": "340000000",
 *     "pledge": "235000000000",
 *     "deposit": null,
 *     "reward_addr": "stake1u8sw8laajleq7w7xpc75axd6ragpmws8xecktmyq5ak2vmqnq54ns",
 *     "reward_addr_delegated_drep": null,
 *     "owners": [
 *       "stake1u8sw8laajleq7w7xpc75axd6ragpmws8xecktmyq5ak2vmqnq54ns"
 *     ],
 *     "relays": [
 *       {
 *         "dns": "cnode.dynamicstrategies.io",
 *         "srv": null,
 *         "ipv4": null,
 *         "ipv6": null,
 *         "port": 3001
 *       }
 *     ],
 *     "meta_url": "https://git.io/JInyo",
 *     "meta_hash": "375b5cacc6348fd902d5636ff28b3597bfddab8cfafbfffd2e34189516bb1329",
 *     "meta_json": {
 *       "name": "Dynamic Strategies",
 *       "ticker": "DSIO",
 *       "homepage": "https://dynamicstrategies.io",
 *       "description": "Sandbox for building DApps and a gateway into the Cardano Blockchain. The block producing node runs on renewable energy."
 *     },
 *     "pool_status": "registered",
 *     "retiring_epoch": null,
 *     "op_cert": "692860aacf15b9666c780a88a83b96680be714952118db78a88399132f424b70",
 *     "op_cert_counter": 16,
 *     "active_stake": "372263793192",
 *     "sigma": 0.000017074402184027492,
 *     "block_count": 1012,
 *     "live_pledge": "279358491369",
 *     "live_stake": "372165981793",
 *     "live_delegators": 31,
 *     "live_saturation": 0.5,
 *     "voting_power": "372263793192"
 *   }
 * ]
 */

export const getStakePoolInfo = async (pool_bech32_id) => {

	const req = {
		_pool_bech32_ids: [pool_bech32_id]
	}

	try {
		const response = await axios({
			method: 'post',
			url: '/pool_info',
			baseURL: KOIOS_URL,
			data: JSON.stringify(req),
			headers: {'Content-Type': 'application/json', 'accept': 'application/json'},
			// headers: {'Content-Type': 'application/json', 'accept': 'application/json', 'Authorization': `Bearer ${KOIOS_TOKEN}`},

		})

		if (response.status === 200) {
			const data = response.data[0];
			return data

		} else {
			console.error(response)
		}

	} catch(err) {
		console.error("Could not retrieve Stake Pool Info");
	}

}

/**
 * Retrieved the epoch number when the stake pool was
 * first active
 */
export const getStakePoolActiveSinceEpoch = async (pool_bech32_id) => {

	const payload = {
		_pool_bech32: pool_bech32_id,
	}

	try {

		const response = await axios({
			method: 'get',
			url: '/pool_updates',
			baseURL: KOIOS_URL,
			params: payload,
			headers: {'accept': 'application/json'},
			// headers: {'accept': 'application/json', 'Authorization': `Bearer ${KOIOS_TOKEN}`},

		})

		if (response.status === 200) {

			const data = response.data;
			// console.log(data)
			const firstObj = data[data.length - 1]
			const active_epoch_no = Number(firstObj?.active_epoch_no)
			return active_epoch_no

		} else {
			console.error(response)
		}

	} catch(err) {
		console.error("Could not retrieve first Active Epoch");
	}

}


/**
 * Helper functions for quick computation of the Binomial CFD
 * This function is used to run a Monte Carlo simulation
 * where in each epoch the number of blocks minted by the pool
 * is assessed
 * @param Z
 * @returns {number}
 * @constructor
 */
const LogGamma = (Z) => {

	const S=1+76.18009173/Z-86.50532033/(Z+1)+24.01409822/(Z+2)-1.231739516/(Z+3)+.00120858003/(Z+4)-.00000536382/(Z+5);
	const LG = (Z-.5)*Math.log(Z+4.5)-(Z+4.5)+Math.log(S*2.50662827465);

	return LG
}

const Betinc = (X,A,B) => {
	let A0=0;
	let B0=1;
	let A1=1;
	let B1=1;
	let M9=0;
	let A2=0;
	let C9;
	while (Math.abs((A1-A2)/A1)>.00001) {
		A2=A1;
		C9=-(A+M9)*(A+B+M9)*X/(A+2*M9)/(A+2*M9+1);
		A0=A1+C9*A0;
		B0=B1+C9*B0;
		M9=M9+1;
		C9=M9*(B-M9)*X/(A+2*M9-1)/(A+2*M9);
		A1=A0+C9*A1;
		B1=B0+C9*B1;
		A0=A0/B1;
		B0=B0/B1;
		A1=A1/B1;
		B1=1;
	}
	return A1/A
}

export const computeBinomCFD = (X,N,P) => {

	let bincdf;
	let Betacdf;

	if (N<=0) {
		console.log("sample size must be positive")
	} else if ((P<0)||(P>1)) {
		console.log("probability must be between 0 and 1")
	} else if (X<0) {
		bincdf=0
	} else if (X>=N) {
		bincdf=1
	} else {
		X=Math.floor(X);
		const Z=P;
		const A=X+1;
		const B=N-X;
		const S=A+B;
		const BT=Math.exp(LogGamma(S)-LogGamma(B)-LogGamma(A)+A*Math.log(Z)+B*Math.log(1-Z));
		if (Z<(A+1)/(S+2)) {
			Betacdf=BT * Betinc(Z,A,B)
		} else {
			Betacdf=1-BT * Betinc(1-Z,B,A)
		}
		bincdf=1-Betacdf;
	}

	return bincdf;

}


export const Quartile = (data, q) => {

	data = Array_Sort_Numbers(data);
	const pos = ((data.length) - 1) * q;
	const base = Math.floor(pos);
	const rest = pos - base;
	if( (data[base+1]!==undefined) ) {
		return data[base] + rest * (data[base+1] - data[base]);
	} else {
		return data[base];
	}
}

const Array_Sort_Numbers = (inputarray) => {
	return inputarray.sort(function(a, b) {
		return a - b;
	});
}

/* Randomize array in-place using Durstenfeld shuffle algorithm */
export const shuffleArray = (array) => {
	for (let i = array.length - 1; i >= 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}

	return array
}
