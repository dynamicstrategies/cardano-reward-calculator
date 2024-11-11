import React from 'react'
import './App.css';
import {getChainTip, getEpochInfo} from "./utils";
import {Button, Intent} from "@blueprintjs/core";


export default class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {


			/**
			 * Cardano Static Parameters
			 * These are assumed not to change
			 */
			daysInEpoch: 5,
			epochsInYear: 73,
			slotsInEpoch: 432000,
			maxAdaSupply: 45000000000,

			/**
			 * Cardano Dynamic Parameters
			 * These can change with governance
			 */
			chainDensity: "0.05", // chain density controls in what % of slots there are blocks (on average)
			rho: "0.003", // % Reserve towards Reward in each epoch
			tau: "0.2", // % Reward towards Treasury in each epoch
			k: 500, // optimal number of pools
			a0: "0.3", // from Reward formula

			z0: 1 / this.k, // from Reward formula
			blocksPerEpoch: this.slotsInEpoch * Number(this.chainDensity),

			/**
			 * Placeholder for blockchain parameters that
			 * change with each epoch. These are calculated in a
			 * separate function after launch of the calculator
			 */
			currentEpochN: undefined,
			currentEpochSlot: undefined,
			currentBlockTime: undefined,
			currentAdaSupply: undefined,
			totalStake: undefined,
			feesInEpoch: undefined,
			totalAdaStaked: undefined,

			/**
			 * Stake Pool default parameters
			 * A representative stake pool is shown
			 * when the calculator is first opened with
			 * these parameters
			 */
			sigma: 0,
			sigmadash: 0,
			s: 0,
			sdash: 0,

		}

	}





	/**
	 * Recalculates all parameters and the results of the calculator
	 */
	recalcAll = () => {

		const reserveAda = this.state.maxAdaSupply - this.state.currentAdaSupply;
		const blocksPerEpoch = this.state.slotsInEpoch * Number(this.state.chainDensity);
		const distributionFromReserve = reserveAda * Number(this.state.rho);
		const grossReward = this.state.feesInEpoch + distributionFromReserve;
		const z0 = 1 / this.state.k;
		const distributionToTreasury = grossReward * Number(this.state.tau);
		const rewardToPoolOperators = grossReward - distributionToTreasury;
		const poolPledge = this.state.poolPledge;
		const delegatorsStake = this.state.totalStake - poolPledge;
		const sigma = this.state.totalStake / this.state.currentAdaSupply;
		const s = this.state.poolPledge / this.state.currentAdaSupply;
		const sigmadash = Math.min(sigma, z0);
		const sdash = Math.min(s, z0);
		const blockAssigmentProbability = this.state.totalStake / this.state.totalAdaStaked;
		const expectedNBlocksInEpoch = blockAssigmentProbability * blocksPerEpoch;
		const expectedNBlocksPerYear = expectedNBlocksInEpoch * this.state.epochsInYear;
		const a0 = Number(this.state.a0);

		const expectedPoolRewardInEpoch = rewardToPoolOperators / (1 + a0) * (sigmadash + sdash * a0 * ((sigmadash - sdash * ((z0-sigmadash)/z0))/z0));
		const expectedPoolRewardPerYear = expectedPoolRewardInEpoch * this.state.epochsInYear;
		const annualizedPoolReward = expectedPoolRewardPerYear / this.state.totalStake;

		this.setState({
			reserveAda: reserveAda,
			z0: z0,
			distributionFromReserve: distributionFromReserve,
			grossReward: grossReward,
			distributionToTreasury: distributionToTreasury,
			rewardToPoolOperators: rewardToPoolOperators,
			delegatorsStake: delegatorsStake,
			sigma: sigma,
			s: s,
			sigmadash: sigmadash,
			sdash: sdash,
			blockAssigmentProbability: blockAssigmentProbability,
			expectedNBlocksInEpoch: expectedNBlocksInEpoch,
			expectedNBlocksPerYear: expectedNBlocksPerYear,
			expectedPoolRewardInEpoch: expectedPoolRewardInEpoch,
			expectedPoolRewardPerYear: expectedPoolRewardPerYear,
			annualizedPoolReward: annualizedPoolReward,
			blocksPerEpoch: blocksPerEpoch,
			poolPledge: poolPledge
		}, () => {this.runMonteCarlo()})

	}


	runMonteCarlo = () => {

	}


	async componentDidMount() {

	}

	render() {

		return (

			<div className="min-h-full">
				<header className="bg-white shadow">
					<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
						<h1 className="text-3xl font-bold tracking-tight text-gray-900">Staking Reward Calculator</h1>
					</div>
				</header>
				<main className="mx-auto bg-gray-100">
					<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">


						<div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-4">

							<div className="relative lg:col-span-2">
								<div className="absolute inset-px rounded-lg bg-white"></div>
								<div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
									<div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
										<p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
											1.1 Basic Calculator
										</p>
										<p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
											...
										</p>
									</div>

									<div className="flex m-4">
										<div className="m-2">
											<Button rightIcon="refresh" intent={Intent.PRIMARY} text="Get Tip" onClick={() => {
												getChainTip().then(r => {
													const currentEpochN = r["epoch_no"]
													const currentEpochSlot = r["epoch_slot"]
													const currentBlockTime = r["block_time"]
													this.setState({currentEpochN, currentEpochSlot, currentBlockTime})
													console.log(r)
												})
											}}/>
										</div>
										<div className="m-2">
											<Button rightIcon="refresh" disabled={!this.state.currentEpochN} intent={Intent.PRIMARY} text="Get Epoch Info" onClick={() => {
												getEpochInfo(this.state.currentEpochN).then(r => {
													//TODO: process epoch info
													console.log(r)
												})
											}}/>
										</div>
									</div>



								</div>
								<div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div>
							</div>


							<div className="relative">
								<div className="absolute inset-px rounded-lg bg-white"></div>
								<div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
									<div className="px-8 pt-8 sm:px-10 sm:pt-10">
										<p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">1.2 Information</p>
										<p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
											...
										</p>
									</div>

								</div>
								<div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div>
							</div>


							<div className="relative lg:col-span-2">
								<div className="absolute inset-px rounded-lg bg-white"></div>
								<div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
									<div className="px-8 pt-8 sm:px-10 sm:pt-10">
										<p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">2.1 Select Stake Pools</p>
										<p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
											...
										</p>
									</div>


								</div>
								<div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div>
							</div>
							<div className="relative">
								<div className="absolute inset-px rounded-lg bg-white"></div>
								<div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
									<div className="px-8 pt-8 sm:px-10 sm:pt-10">
										<p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">2.2 Information</p>
										<p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
											...
										</p>
									</div>
								</div>
								<div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div>
							</div>

							<div className="relative lg:col-span-2">
								<div className="absolute inset-px rounded-lg bg-white"></div>
								<div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
									<div className="px-8 pt-8 sm:px-10 sm:pt-10">
										<p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">3.1 Stake Pool Parameters</p>
										<p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
											...
										</p>
									</div>


								</div>
								<div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div>
							</div>
							<div className="relative">
								<div className="absolute inset-px rounded-lg bg-white"></div>
								<div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
									<div className="px-8 pt-8 sm:px-10 sm:pt-10">
										<p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">3.2 Information</p>
										<p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
											...
										</p>
									</div>
								</div>
								<div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div>
							</div>

							<div className="relative lg:col-span-2">
								<div className="absolute inset-px rounded-lg bg-white"></div>
								<div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
									<div className="px-8 pt-8 sm:px-10 sm:pt-10">
										<p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">4.1 Cardano Blockchain Parameters</p>
										<p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
											...
										</p>
									</div>


								</div>
								<div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div>
							</div>
							<div className="relative">
								<div className="absolute inset-px rounded-lg bg-white"></div>
								<div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
									<div className="px-8 pt-8 sm:px-10 sm:pt-10">
										<p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">4.2 Information</p>
										<p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
											...
										</p>
									</div>
								</div>
								<div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div>
							</div>


						</div>


					</div>
				</main>

			</div>

		)
	}


}


