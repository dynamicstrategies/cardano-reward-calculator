/**
 * Tests the performance and accuracy of statistical packages to calculate
 * the Binomial CFD function. The function gives the probability that
 * a stake pool will mint exactly N number of blocks in an epoch
 * and the function is heavily used to compute the estimated returns
 * of a stake pool
 */
import {
	binomialCDF,
} from "../binomCFD";

test("Binomal CDF max error ", () => {
	expect(binomialCDF()).toBe(0.2)
})

