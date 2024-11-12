import axios from "axios";

const KOIOS_URL = "http://localhost:7070/proxy"

export const getChainTip = async () => {

	try {
		const response = await axios({
			method: 'get',
			url: '/tip',
			baseURL: KOIOS_URL,
			headers: {'accept': 'application/json'},

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

export const getProtocolParams = async () => {

	try {
		const response = await axios({
			method: 'get',
			url: '/cli_protocol_params',
			baseURL: KOIOS_URL,
			headers: {'accept': 'application/json'},

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
 * https://api.koios.rest/#get-/totals
 * @param currentEpochN
 * @returns {Promise<*>}
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
				limit: stepSize
			}

			const response = await axios({
				method: 'get',
				url: '/pool_list',
				baseURL: KOIOS_URL,
				params: payload,
				headers: {'accept': 'application/json'},

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



// export const getStakePoolList = async () => {
//
// 	let utxos = [];
//
// 	const req = {
// 		_addresses: [scriptAddress],
// 		_extended: true
// 	}
//
// 	try {
// 		const response = await axios({
// 			method: 'post',
// 			url: '/address_utxos',
// 			baseURL: KOIOS_URL,
// 			data: JSON.stringify(req),
// 			headers: {'Content-Type': 'application/json', 'accept': 'application/json'},
//
// 		})
//
// 		if (response.status === 200) {
// 			const o = response.data;
// 			utxos = o;
//
// 		} else {
// 			console.error(response)
// 		}
//
// 	} catch(err) {
// 		console.error("Could not retrieve UTXOs");
// 	}
//
// 	return utxos
//
// }
