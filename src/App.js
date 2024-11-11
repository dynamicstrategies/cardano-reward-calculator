import React from 'react'
import './App.css';
import {getChainTip, getEpochInfo, getProtocolParams, getStakePoolList} from "./utils";
import {Button, ControlGroup, InputGroup, Intent, Label, Tag} from "@blueprintjs/core";


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
			rho: undefined, // Monetary Expansion - % Reserve towards Reward in each epoch (e.g. 0.003)
			tau: undefined, // % Reward towards Treasury in each epoch (e.g. 20%)
			k: undefined, // optimal number of pools (e.g. 500)
			a0: undefined, // Pool Pledge influence from Reward formula (e.g. 0.3)

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
			feesInEpoch: undefined,
			totalAdaStaked: undefined,

			/**
			 * Stake Pool default parameters
			 * A representative stake pool is shown
			 * when the calculator is first opened with
			 * these parameters
			 */
			poolStake: undefined,
			sigma: undefined,
			sigmadash: undefined,
			s: undefined,
			sdash: undefined,

			/**
			 * User parameters
			 */
			amountAdaToStake: 10000,

		}


		this.allStakePoolInfo = []


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
		const delegatorsStake = this.state.poolStake - poolPledge;
		const sigma = this.state.poolStake / this.state.currentAdaSupply;
		const s = this.state.poolPledge / this.state.currentAdaSupply;
		const sigmadash = Math.min(sigma, z0);
		const sdash = Math.min(s, z0);
		const blockAssigmentProbability = this.state.poolStake / this.state.totalAdaStaked;
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



	handleChange = (event) => {
		let str = event.target.value
		str = str.replace(/,/g,"")

		let val = Number(str)
		let id = event.target.id;

		switch(id) {
			case "ada-to-stake":
				this.setState({amountAdaToStake: val})
				break

			case "days-in-epoch":
				this.setState({daysInEpoch: val, epochsInYear: 365/val},() => {this.recalcAll()})
				break
			case "epochs-in-year":
				this.setState({daysInEpoch: 365 / val, epochsInYear: val},() => {this.recalcAll()})
				break
			case "slots-in-epoch":
				this.setState({slotsInEpoch: val},() => {this.recalcAll()})
				break
			case "chain-density":
				this.setState({chainDensity: val},() => {
					if (Number(val) !== 0) {
						this.recalcAll();
					}
				})
				break
			case "blocks-per-epoch":
				this.setState({blocksPerEpoch: val},() => {this.recalcAll()})
				break
			case "current-ada-supply":
				this.setState({currentAdaSupply: val},() => {this.recalcAll()})
				break
			case "total-staked-ada":
				const truncVal = Math.min(this.state.currentAdaSupply, val)
				this.setState({totalAdaStaked: truncVal},() => {
					if (Number(truncVal) !== 0) {
						this.recalcAll();
					}
				})
				break
			case "rho":
				this.setState({rho: val},() => {
					if (Number(val) !== 0) {
						this.recalcAll();
					}
				})
				break
			case "tau":
				this.setState({tau: val},() => {
					if (Number(val) !== 0) {
						this.recalcAll();
					}
				})
				break
			case "k":
				this.setState({k: val},() => {this.recalcAll()})
				break
			case "a0":
				this.setState({a0: val},() => {this.recalcAll()})
				break

			case "fees-in-epoch":
				this.setState({feesInEpoch: val},() => {this.recalcAll()})
				break

			case "pool-pledge":
				const tmp = Math.min(val, this.state.totalStake);
				this.setState({poolPledge: tmp},() => {this.recalcAll()})
				break
			case "delegators-stake":
				this.setState({delegatorsStake: val},() => {this.recalcAll()})
				break
			case "total-pool-stake":
				this.setState({totalStake: val},() => {this.recalcAll()})
				break
			case "pool-fixed-costs":
				this.setState({poolFixedCost: val},() => {this.recalcAll()})
				break
			case "pool-variable-fee":
				this.setState({poolVariableFee: val},() => {this.recalcAll()})
				break

			default:
				console.log(`id not found: ${id}`)
		}

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

						<div className="mt-4 bg-yellow-100">
							<p className="p-4 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
								Testing
							</p>
							<div className="flex m-4">
								<div className="m-2">
									<Button rightIcon="refresh" intent={Intent.PRIMARY} text="Get Tip" onClick={() => {
										getChainTip().then(r => {
											const currentEpochN = r["epoch_no"]
											const currentEpochSlot = r["epoch_slot"]
											const currentBlockTime = r["block_time"]
											this.setState({currentEpochN, currentEpochSlot, currentBlockTime})
											console.log("--- Chain Tip ---")
											console.log(r)
										})
									}}/>
								</div>
								<div className="m-2">
									<Button rightIcon="refresh" disabled={!this.state.currentEpochN} intent={Intent.PRIMARY} text="Get Epoch Info" onClick={() => {
										getEpochInfo(this.state.currentEpochN).then(r => {
											const totalAdaStaked = r["active_stake"]
											const feesInEpoch = r["fees"]
											this.setState({totalAdaStaked, feesInEpoch})
											console.log("--- Current Epoch Info ---")
											console.log(r)
										})
									}}/>
								</div>
								<div className="m-2">
									<Button rightIcon="refresh" disabled={!this.state.totalAdaStaked} intent={Intent.PRIMARY} text="Get Protocol Parameters" onClick={() => {
										getProtocolParams().then(r => {
											const rho = r["monetaryExpansion"]
											const tau = r["treasuryCut"]
											const k = r["stakePoolTargetNum"]
											const a0 = r["poolPledgeInfluence"]
											this.setState({rho, tau, k, a0})
											console.log("--- Protocol Parameters ---")
											console.log(r)
										})
									}}/>
								</div>

								<div className="m-2">
									<Button rightIcon="refresh" disabled={false} intent={Intent.PRIMARY} text="Get Stake Pools" onClick={() => {
										getStakePoolList().then(r => {
											const livePools = r.filter(x => x["pool_status"] === "registered")
											console.log("registered pools n: " + livePools.length)
											this.allStakePoolInfo = livePools
											// console.log(r)
										})
									}}/>
								</div>

							</div>
						</div>




						<div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-4">

							<div className="relative lg:col-span-2">
								<div className="absolute inset-px rounded-lg bg-white"></div>
								<div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
									<div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
										<p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
											1.1 Basic Calculator
										</p>
									</div>
									<div className="px-8 mb-8 pb-8 pt-8 sm:px-10 sm:pb-0 sm:pt-10">


										<h4 className="text-balance mb-4 text-4xl font-medium tracking-tight text-gray-900 sm:text-3xl">
											Amount of ADA to Stake
										</h4>
										<ControlGroup fill={true} vertical={false} style={{width:"100%"}}>
											<InputGroup
												style={{fontSize: "1.5rem"}}
												id="ada-to-stake"
												disabled={false}
												// leftIcon="filter"
												onChange={this.handleChange}
												value={this.state.amountAdaToStake.toLocaleString("en-US")}
												fill={true}
												rightElement={<Tag minimal={true}>1.1</Tag>}
											/>
										</ControlGroup>


										<dl className="mt-8 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-2">

											<div key="pool-reward-ada" className="flex flex-col bg-gray-400/5 p-8">
												<dt className="text-sm/6 font-semibold text-gray-600">Pool Reward per Year ADA</dt>
												<dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">{150}</dd>
											</div>
											<div key="pool-reward-perc" className="flex flex-col bg-gray-400/5 p-8">
												<dt className="text-sm/6 font-semibold text-gray-600">Annualized Pool Reward</dt>
												<dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">{`${2.85}%`}</dd>
											</div>


										</dl>

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


