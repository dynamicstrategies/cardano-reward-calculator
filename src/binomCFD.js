/**
 * Tests the performance and accuracy of statistical packages to calculate
 * the Binomial CFD function. The function gives the probability that
 * a stake pool will mint exactly N number of blocks in an epoch
 * and the function is heavily used to compute the estimated returns
 * of a stake pool
 *
 * run with `node binomCFD.js`
 */
import {computeBinomCFD} from "./utils.js";


const poolStake = 70_000_000;
const totalAdaStaked = 21_870_000_000;

const BLOCKS_EPOCH = 21600;
const BLOCK_PROB = poolStake / totalAdaStaked;
const N_BLOCKS = 120;


const binomialCDF = () => {

	let binomialCDFArr = []
	for (let i = 0; i <= 120; i++) {
		const binomcdf = computeBinomCFD(i, BLOCKS_EPOCH, BLOCK_PROB)
		binomialCDFArr.push(binomcdf)
	}

	console.table(binomialCDFArr)


	const randn = Math.random();

	let nblocks = 0;


	while (randn > binomialCDFArr[nblocks]) {
		if (nblocks > binomialCDFArr.length) break
		nblocks++;
	}

	// do {
	// 	if (nblocks > binomialCDFArr.length) break
	// 	nblocks++;
	// } while(randn > binomialCDFArr[nblocks + 1])

	console.log(`randn: ${randn}`)
	console.log(`nblocks: ${nblocks}`)


}

binomialCDF()

