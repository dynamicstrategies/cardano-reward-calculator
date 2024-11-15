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

		reachedEnd = true

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
