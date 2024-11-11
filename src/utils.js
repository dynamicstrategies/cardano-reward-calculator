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

// export const getChainTip = async () => {
//
// 	let utxos = [];
//
// 	console.log(scriptAddress)
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
