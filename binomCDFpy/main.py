from scipy.stats import binom
import numpy as np


poolStake = 70_000_000
totalAdaStaked = 21_870_000_000

BLOCKS_EPOCH = 21_600
BLOCK_PROB = poolStake / totalAdaStaked


if __name__ == "__main__":

    binomCDFArr = np.array([])

    for x in range(121):

        prob = binom.cdf(x, BLOCKS_EPOCH, BLOCK_PROB)
        print(f"N Blocks: {x} , binomCDF: {prob}")

        binomCDFArr = np.append(binomCDFArr, prob)

    np.set_printoptions(precision=16, suppress=True)

    print("--- Array of Binomial CDFs to test against ---")
    print(repr(binomCDFArr))

