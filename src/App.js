import React from 'react'
import './App.css';
import cardanoLogo from './cardano_logo_white.svg';
import {
	computeBinomCFD,
	getChainTip,
	getEpochInfo,
	getProtocolParams,
	getReserves,
	getStakePoolInfo,
	getStakePoolList
} from "./utils";
import {Button, ControlGroup, InputGroup, Intent, Label, Tag} from "@blueprintjs/core";
import StakePoolSelector from "./StakePoolSelector";


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
			poolPledge: undefined,
			poolStake: undefined,
			delegatorsStake: undefined,
			poolFixedCost: undefined, // e.g. 340
			poolVariableFee: undefined, // e.g. 0.02
			sigma: undefined,
			sigmadash: undefined,
			s: undefined,
			sdash: undefined,

			/**
			 * Stake Pool calculated values
			 */
			blockAssigmentProbability: undefined,
			expectedNBlocksInEpoch: undefined,
			expectedNBlocksPerYear: undefined,
			expectedPoolRewardInEpoch: undefined,
			expectedPoolRewardPerYear: undefined,
			annualizedPoolReward: undefined,

			/**
			 * User parameters
			 */
			amountAdaToStake: 10000,
			selectedPoolBech32: "pool189lsf6c2upyhmrzddyvyfjxxkqnte9pw8aqx7f4cuf85sjxlm02",
			poolStake_plus_userAmount: undefined,

			/**
			 * All stake pools information
			 */
			allStakePoolInfo: [],

			/**
			 * UI Controls
			 * Control the accordions in the UI. Users who need more detail
			 * on how the rewards are calculated can open these accordions
			 */
			isUIStakePoolsShown: true,
			isUIStakeParamsShown: true,
			isUIBlockParamsShown: true,
			isUIStaticParamsShow: true,
			isUIDynamicParamsShow: true,
			isUIFeesReservesShow: true,

			/**
			 * Monte Carlo Simulation
			 */
			nMonteCarloSimuls: 1000,

		}

	}


	initData = async () => {

		try {

			console.log("--- Getting Chain Tip ---")
			const chainTipObj = await getChainTip();
			const currentEpochN = chainTipObj["epoch_no"]
			const currentEpochSlot = chainTipObj["epoch_slot"]
			const currentBlockTime = chainTipObj["block_time"]

			console.log("--- Getting Current Epoch Info ---")
			const epochInfoObj_curr = await getEpochInfo(currentEpochN);
			const totalAdaStaked = epochInfoObj_curr["active_stake"] / 1000000

			console.log("--- Getting Previous Epoch Info ---")
			const prevEpochN = currentEpochN - 1;
			const epochInfoObj_prev = await getEpochInfo(prevEpochN);
			const feesInEpoch = epochInfoObj_prev["fees"] / 1000000

			console.log("--- Getting Protocol Parameters ---")
			const protocolParamsObj = await getProtocolParams();
			const rho = protocolParamsObj["monetaryExpansion"]
			const tau = protocolParamsObj["treasuryCut"]
			const k = protocolParamsObj["stakePoolTargetNum"]
			const a0 = protocolParamsObj["poolPledgeInfluence"]

			console.log("--- Getting Protocol Reserves ---")
			const reservesObj = await getReserves(currentEpochN);
			const currentAdaSupply = reservesObj["supply"] / 1000000

			console.log("--- Getting Stake Pools Info ---")
			const spObj = await getStakePoolList();
			const allStakePoolInfo = spObj.filter(x => x["pool_status"] === "registered" && x["ticker"])
			console.log("retrieved number of pools: " + allStakePoolInfo?.length)
			// console.log(allStakePoolInfo)

			this.setState({
				allStakePoolInfo,
				rho, tau, k, a0,
				currentEpochN, currentEpochSlot, currentBlockTime,
				totalAdaStaked, feesInEpoch,
				currentAdaSupply
			}, () => {
				this.updateSelectedPoolParams()
			})


		} catch(e) {
			console.error(e)
		}
	}


	updateSelectedPoolParams = async (selectedPoolBech32 = this.state.selectedPoolBech32) => {

		// const allStakePoolInfo = this.state.allStakePoolInfo;

		// const spsObj = allStakePoolInfo.filter(x => x.pool_id_bech32 = selectedPoolBech32) || []
		// const spObj = spsObj.length ? spsObj[0] : undefined;



		const spInfo = await getStakePoolInfo(selectedPoolBech32)
		const poolPledge = spInfo?.pledge / 1_000_000;
		const poolFixedCost = spInfo?.fixed_cost / 1_000_000;
		const poolVariableFee = spInfo?.margin;
		const poolStake = spInfo?.active_stake / 1_000_000;


		this.setState({poolPledge, poolFixedCost, poolVariableFee, poolStake},
			() => this.recalcAll())

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
		const poolStake_plus_userAmount = this.state.poolStake + this.state.amountAdaToStake
		const delegatorsStake = poolStake_plus_userAmount - poolPledge;
		const sigma = poolStake_plus_userAmount / this.state.currentAdaSupply;
		const s = this.state.poolPledge / this.state.currentAdaSupply;
		const sigmadash = Math.min(sigma, z0);
		const sdash = Math.min(s, z0);
		const blockAssigmentProbability = poolStake_plus_userAmount / this.state.totalAdaStaked;
		const expectedNBlocksInEpoch = blockAssigmentProbability * blocksPerEpoch;
		const expectedNBlocksPerYear = expectedNBlocksInEpoch * this.state.epochsInYear;
		const a0 = Number(this.state.a0);

		const expectedPoolRewardInEpoch = rewardToPoolOperators / (1 + a0) * (sigmadash + sdash * a0 * ((sigmadash - sdash * ((z0-sigmadash)/z0))/z0));
		const expectedPoolRewardPerYear = expectedPoolRewardInEpoch * this.state.epochsInYear;
		const annualizedPoolReward = expectedPoolRewardPerYear / poolStake_plus_userAmount;

		this.setState({
			reserveAda,
			z0,
			distributionFromReserve,
			grossReward,
			distributionToTreasury,
			rewardToPoolOperators,
			delegatorsStake,
			sigma,
			s,
			sigmadash,
			sdash,
			blockAssigmentProbability,
			expectedNBlocksInEpoch,
			expectedNBlocksPerYear,
			expectedPoolRewardInEpoch,
			expectedPoolRewardPerYear,
			annualizedPoolReward,
			blocksPerEpoch,
			poolPledge,
			poolStake_plus_userAmount
		}, () => {this.runMonteCarlo()})

	}


	/**
	 * Simulates a full year of rewards, by going through every epoch and
	 * checking how much rewards would have been earned by the stake pool
	 * and what proportion would be distributed to delegators
	 */
	simulatedPoolRewards = () => {

		if (!(this.state.epochsInYear < 5000)) {
			console.log("Too many epochs in a Year ...")
			return
		}

		// let simulatedResults = {};
		let totalReward = 0;
		let poolFixedReward = 0;
		let poolVariableReward = 0;
		let poolReturnOnPledge = 0;
		let poolReward = 0;
		let delegatorsReward = 0;
		let totalBlocks = 0;



		for (let i = 0; i < this.state.epochsInYear; i++) {

			const randn = Math.random();
			let nblocks = 0;
			let stop = false;

			do {

				const binomcfd = computeBinomCFD(nblocks,this.state.blocksPerEpoch, this.state.blockAssigmentProbability)
				if (randn > binomcfd) {
					nblocks++;
				} else {
					stop = true;
				}

			} while(!stop)

			totalBlocks += nblocks;

			const rewardMultiplier = (nblocks / this.state.blocksPerEpoch) / this.state.blockAssigmentProbability;
			const epoch_totalReward = this.state.expectedPoolRewardInEpoch * rewardMultiplier;
			const epoch_poolFixedReward = Math.min(epoch_totalReward, this.state.poolFixedCost);
			const epoch_poolVariableReward = (epoch_totalReward - epoch_poolFixedReward) * Number(this.state.poolVariableFee);
			const epoch_poolReturnOnPledge = (epoch_totalReward - epoch_poolFixedReward - epoch_poolVariableReward) * this.state.poolPledge / this.state.poolStake_plus_userAmount;
			const epoch_poolReward = epoch_poolFixedReward + epoch_poolVariableReward + epoch_poolReturnOnPledge;
			const epoch_delegatorsReward = epoch_totalReward - epoch_poolReward;

			totalReward += epoch_totalReward;
			poolFixedReward += epoch_poolFixedReward;
			poolVariableReward += epoch_poolVariableReward;
			poolReturnOnPledge += epoch_poolReturnOnPledge;
			poolReward +=  epoch_poolReward
			delegatorsReward += epoch_delegatorsReward;

		}


		const simulatedResultsSummary = {
			totalReward,
			poolFixedReward,
			poolVariableReward,
			poolReturnOnPledge,
			poolReward,
			delegatorsReward,
		}

		return simulatedResultsSummary

	}


	/**
	 * Run multiple simulation of the same year of returns
	 */
	runMonteCarlo = () => {

		// reset previous run before kicking off a new one
		let monetCarloSimul = [];

		for (let i = 0; i < this.state.nMonteCarloSimuls; i++) {

			const simul = this.simulatedPoolRewards();

			const simulRes = {
				totalReward: simul.totalReward,
				poolReward: simul.poolReward,
				delegatorsReward: simul.delegatorsReward,
			}

			monetCarloSimul.push(simulRes)

		}


		// calc summary stats
		const poolRewardS = monetCarloSimul.map(x => x.poolReward);
		const delegatorsRewardS = monetCarloSimul.map(x => x.delegatorsReward);
		const totalRewardS = monetCarloSimul.map(x => x.totalReward);

		const poolReward_av = (monetCarloSimul.reduce((tot, val) => {return (tot + val.poolReward)}, 0)) / this.state.nMonteCarloSimuls;
		const delegatorsReward_av = (monetCarloSimul.reduce((tot, val) => {return (tot + val.delegatorsReward)}, 0)) / this.state.nMonteCarloSimuls;
		const totalReward_av = (monetCarloSimul.reduce((tot, val) => {return (tot + val.totalReward)}, 0)) / this.state.nMonteCarloSimuls;


		const monteCarloPoolStats = {
			poolReward_av,
			delegatorsReward_av,
			totalReward_av,
		}

		// // total reward stats
		// const poolStats = {
		// 	"total": [
		// 		(this.Quartile(totalRewardS, 0.1) / this.state.totalStake)*100,
		// 		(this.Quartile(totalRewardS, 0.25) / this.state.totalStake)*100,
		// 		(totalReward_av / this.state.totalStake)*100,
		// 		(this.Quartile(totalRewardS, 0.75) / this.state.totalStake)*100,
		// 		(this.Quartile(totalRewardS, 0.9) / this.state.totalStake)*100
		// 	],
		// 	"pool": [
		// 		(this.Quartile(poolRewardS, 0.1) / this.state.poolPledge)*100,
		// 		(this.Quartile(poolRewardS, 0.25) / this.state.poolPledge)*100,
		// 		(poolReward_av / this.state.poolPledge)*100,
		// 		(this.Quartile(poolRewardS, 0.75) / this.state.poolPledge)*100,
		// 		(this.Quartile(poolRewardS, 0.9) / this.state.poolPledge)*100
		// 	],
		// 	"delegators": [
		// 		(this.Quartile(delegatorsRewardS, 0.1) / this.state.delegatorsStake)*100,
		// 		(this.Quartile(delegatorsRewardS, 0.25) / this.state.delegatorsStake)*100,
		// 		(delegatorsReward_av / this.state.delegatorsStake)*100,
		// 		(this.Quartile(delegatorsRewardS, 0.75) / this.state.delegatorsStake)*100,
		// 		(this.Quartile(delegatorsRewardS, 0.9) / this.state.delegatorsStake)*100,
		// 	]
		// }


		// set state
		this.setState({monetCarloSimul, monteCarloPoolStats})

		// if (this.state.poolIdSelected) {
		// 	let tmp = this.state.poolComparisonStats;
		// 	tmp[this.state.poolHashSelected] = poolStats
		// 	this.setState({poolComparisonStats: tmp})
		// }

	}



	handleChange = (event) => {
		let str = event.target.value
		str = str.replace(/,/g,"")

		let val = Number(str)
		let id = event.target.id;

		switch(id) {
			case "ada-to-stake":
				this.setState({amountAdaToStake: val}, () => this.recalcAll())
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
				const tmp = Math.min(val, this.state.poolStake_plus_userAmount);
				this.setState({poolPledge: tmp},() => {this.recalcAll()})
				break
			// case "delegators-stake":
			// 	this.setState({delegatorsStake: val},() => {this.recalcAll()})
			// 	break
			case "total-pool-stake":
				const poolStake = val - this.state.amountAdaToStake
				this.setState({poolStake},() => {this.recalcAll()})
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

	handlePoolSelect = (spObj) => {
		const selectedPoolBech32 = spObj?.pool_id_bech32;
		this.setState({selectedPoolBech32},
			() => this.updateSelectedPoolParams().then(() => {}))

	}


	async componentDidMount() {

		await this.initData()

	}

	render() {

		return (

			<div className="min-h-full">

				<header className="bg-[#023E8A] shadow">
					<div className="mx-auto flex max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
						<img className="mr-4" src={cardanoLogo} alt="nami logo" height="35" width="35"/>
						<h1 className="text-3xl font-bold tracking-tight text-gray-50">Staking Reward Calculator</h1>
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
									<Button rightIcon="refresh" disabled={false} intent={Intent.PRIMARY} text="Get Protocol Parameters" onClick={() => {
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
									<Button rightIcon="refresh" disabled={!this.state.currentEpochN} intent={Intent.PRIMARY} text="Get Protocol Reserves" onClick={() => {
										getReserves(this.state.currentEpochN).then(r => {
											const currentAdaSupply = r["supply"]
											this.setState({currentAdaSupply})
											console.log("--- Protocol Reserves ---")
											console.log(r)
										})
									}}/>
								</div>

								<div className="m-2">
									<Button rightIcon="refresh" disabled={false} intent={Intent.PRIMARY} text="Get Stake Pools" onClick={() => {
										getStakePoolList().then(r => {
											const livePools = r.filter(x => x["pool_status"] === "registered" && x["ticker"])
											console.log("registered pools n: " + livePools.length)
											this.setState({allStakePoolInfo: livePools})
											// console.log(r)
										})
									}}/>
								</div>

							</div>
						</div>

						<div className="grid lg:grid-cols-3 lg:grid-rows-[auto_auto_auto_auto] gap-4">

							{/* Row 1, Column 1 */}
							<div className="border border-gray-300 shadow-md rounded-lg bg-white p-8 lg:col-span-2">
								<h4 className="text-balance text-2xl font-medium tracking-tight text-gray-900">
									Amount of ADA to Stake
								</h4>
								<div className="mt-8 grid gap-4 overflow-hidden text-center">

									<ControlGroup fill={true} vertical={false} style={{width:"100%"}}>
										<InputGroup
											style={{fontSize: "1.8rem", padding: "1.2em", textAlign: "center", fontWeight: 500}}
											id="ada-to-stake"
											disabled={false}
											// leftIcon="filter"
											onChange={this.handleChange}
											value={this.state.amountAdaToStake.toLocaleString("en-US")}
											fill={true}
											rightElement={<Tag minimal={true}>ADA</Tag>}
										/>
									</ControlGroup>


									<dl className="mt-8 grid grid-cols-1 gap-1 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-2">

										<div key="pool-reward-ada" className="flex flex-col bg-gray-700/5 p-8">
											<dt className="text-sm/6 font-semibold text-gray-600">Staking Reward per Year ADA</dt>
											<dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">{
												`${Number(this.state.monteCarloPoolStats?.delegatorsReward_av / this.state.delegatorsStake * this.state.amountAdaToStake).toLocaleString("en-US", {maximumFractionDigits: 0})}`
											}</dd>
										</div>
										<div key="pool-reward-perc" className="flex flex-col bg-gray-700/5 p-8">
											<dt className="text-sm/6 font-semibold text-gray-600">Annualized Staking Reward</dt>
											<dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">{`${
												(this.state.monteCarloPoolStats?.delegatorsReward_av / this.state.delegatorsStake * 100).toLocaleString("en-US", {maximumFractionDigits: 2})
											}%`}</dd>
										</div>


									</dl>

								</div>

							</div>

							{/* Row 1, Column 2 */}
							<div className="border border-gray-300 shadow-md rounded-lg bg-white p-4">
								<p>Info</p>
							</div>

							{/* Row 2, Column 1 */}
							<div className="border border-gray-300 shadow-md rounded-lg bg-white p-8 lg:col-span-2">

								<div className="cursor-pointer" onClick={
									() => this.setState({isUIStakePoolsShown: !this.state.isUIStakePoolsShown})
								}>
									<h4 className="text-balance text-2xl font-medium tracking-tight text-gray-900">
									<span id="icon" className="text-3xl font-normal text-gray-900 mr-4">
										{this.state.isUIStakePoolsShown ? "-" : "+"}
									</span>
										Stake Pools
									</h4>
								</div>



								<dl className={`${this.state.isUIStakePoolsShown ? "" : "hidden"} mt-8 grid gap-4 overflow-hidden text-center sm:grid-cols-3`}>

									<div key="stake-pool-1" className="flex flex-col bg-gray-700/5 p-8 rounded-xl border-2 border-[#0277BD]">
										<StakePoolSelector allStakePoolInfo={this.state.allStakePoolInfo} handlePoolSelect={this.handlePoolSelect}/>

									</div>
									<div key="stake-pool-2" className="flex flex-col bg-gray-700/5 p-8 rounded-xl">
										<StakePoolSelector allStakePoolInfo={this.state.allStakePoolInfo} handlePoolSelect={this.handlePoolSelect}/>

									</div>
									<div key="stake-pool-3" className="flex flex-col bg-gray-700/5 p-8 rounded-xl">
										<StakePoolSelector allStakePoolInfo={this.state.allStakePoolInfo} handlePoolSelect={this.handlePoolSelect}/>

									</div>


								</dl>
							</div>

							{/* Row 2, Column 2 */}
							<div className="border border-gray-300 shadow-md rounded-lg bg-white p-4">
								<p>Info</p>
							</div>

							{/* Row 3, Column 1 */}
							<div className="border border-gray-300 shadow-md rounded-lg bg-white p-8 lg:col-span-2">
								<div className="cursor-pointer" onClick={
									() => this.setState({isUIStakeParamsShown: !this.state.isUIStakeParamsShown})
								}>
									<h4 className="text-balance text-2xl font-medium tracking-tight text-gray-900">
									<span id="icon" className="text-3xl font-normal text-gray-900 mr-4">
										{this.state.isUIStakeParamsShown ? "-" : "+"}
									</span>
										Stake Pool Parameters
									</h4>
								</div>

								<div className={`${this.state.isUIStakeParamsShown ? "" : "hidden"} mt-8`}>
									<ControlGroup fill={true} vertical={false} style={{width:"90%"}}>
										<Label htmlFor="pool-pledge" style={{width:"400px"}}>Pool Pledge</Label>
										<InputGroup
											id="pool-pledge"
											disabled={false}
											leftIcon="plus"
											onChange={this.handleChange}
											value={this.state.poolPledge?.toLocaleString("en-US")}
											fill={true}
											rightElement={<Tag minimal={true}>ADA</Tag>}
										/>
									</ControlGroup>

									<ControlGroup fill={true} vertical={false} style={{width:"90%"}}>
										<Label htmlFor="delegators-stake" style={{width:"400px"}}>Delegator's Stake</Label>
										<InputGroup
											id="delegators-stake"
											disabled={true}
											leftIcon="plus"
											onChange={this.handleChange}
											value={this.state.delegatorsStake?.toLocaleString("en-US", {maximumFractionDigits: 0})}
											fill={true}
											rightElement={<Tag minimal={true}>ADA</Tag>}
										/>
									</ControlGroup>

									<ControlGroup fill={true} vertical={false} style={{width:"90%"}}>
										<Label htmlFor="total-pool-stake" style={{width:"400px"}}>Total Pool Stake</Label>
										<InputGroup
											id="total-pool-stake"
											disabled={false}
											leftIcon="equals"
											onChange={this.handleChange}
											value={this.state.poolStake_plus_userAmount?.toLocaleString("en-US", {maximumFractionDigits: 0})}
											fill={true}
											rightElement={<Tag minimal={true}>ADA</Tag>}
										/>
									</ControlGroup>

									<ControlGroup fill={true} vertical={false} style={{width:"90%"}}>
										<Label htmlFor="pool-fixed-costs" style={{width:"400px"}}>Pool Fixed Costs</Label>
										<InputGroup
											id="pool-fixed-costs"
											disabled={false}
											// leftIcon="filter"
											onChange={this.handleChange}
											value={this.state.poolFixedCost?.toLocaleString("en-US")}
											fill={true}
											rightElement={<Tag minimal={true}>ADA</Tag>}
										/>
									</ControlGroup>

									<ControlGroup fill={true} vertical={false} style={{width:"90%"}}>
										<Label htmlFor="pool-variable-fee" style={{width:"400px"}}>Pool Variable Fee</Label>
										<InputGroup
											id="pool-variable-fee"
											disabled={false}
											asyncControl={true}
											// leftIcon="filter"
											onChange={this.handleChange}
											value={this.state.poolVariableFee}
											fill={true}
											rightElement={<Tag minimal={true}>%</Tag>}
										/>
									</ControlGroup>
								</div>

							</div>

							{/* Row 3, Column 2 */}
							<div className="border border-gray-300 shadow-md rounded-lg bg-white p-4">
								<p>Info</p>
							</div>

							{/* Row 4, Column 1 */}
							<div className="border border-gray-300 shadow-md rounded-lg bg-white p-8 lg:col-span-2">
								<div className="cursor-pointer" onClick={
									() => this.setState({isUIBlockParamsShown: !this.state.isUIBlockParamsShown})
								}>
									<h4 className="text-balance text-2xl font-medium tracking-tight text-gray-900">
									<span id="icon" className="text-3xl font-normal text-gray-900 mr-4">
										{this.state.isUIBlockParamsShown ? "-" : "+"}
									</span>
										Blockchain Parameters
									</h4>
								</div>



								<div className={`${this.state.isUIBlockParamsShown ? "" : "hidden"} mt-8`}>


									<div className="cursor-pointer bg-gray-100 px-2 py-1 -mx-2 mt-8 mb-4 text-gray-900" onClick={
										() => this.setState({isUIDynamicParamsShow: !this.state.isUIDynamicParamsShow})
									}>
										<span id="icon" className="font-normal text-gray-900 mr-4">
											{this.state.isUIDynamicParamsShow ? "-" : "+"}
										</span>
										Dynamic Parameters
									</div>

									<div className={`${this.state.isUIDynamicParamsShow ? "" : "hidden"}`}>
										<ControlGroup fill={true} vertical={false} style={{width:"90%"}}>
											<Label htmlFor="rho" style={{width:"400px"}}>Rho</Label>
											<InputGroup
												id="rho"
												disabled={false}
												asyncControl={true}
												// leftIcon="filter"
												onChange={this.handleChange}
												value={this.state.rho}
												fill={true}
												rightElement={<Tag minimal={true}>1.1</Tag>}
											/>
										</ControlGroup>

										<ControlGroup fill={true} vertical={false} style={{width:"90%"}}>
											<Label htmlFor="tau" style={{width:"400px"}}>Tau</Label>
											<InputGroup
												id="tau"
												disabled={false}
												asyncControl={true}
												// leftIcon="filter"
												onChange={this.handleChange}
												value={this.state.tau}
												fill={true}
												rightElement={<Tag minimal={true}>1.2</Tag>}
											/>
										</ControlGroup>

										<ControlGroup fill={true} vertical={false} style={{width:"90%"}}>
											<Label htmlFor="k" style={{width:"400px"}}>K</Label>
											<InputGroup
												id="k"
												disabled={false}
												// leftIcon="filter"
												onChange={this.handleChange}
												value={this.state.k}
												fill={true}
												rightElement={<Tag minimal={true}>1.3</Tag>}
											/>
										</ControlGroup>

										<ControlGroup fill={true} vertical={false} style={{width:"90%"}}>
											<Label htmlFor="a0" style={{width:"400px"}}>a0</Label>
											<InputGroup
												id="a0"
												disabled={false}
												asyncControl={true}
												// leftIcon="filter"
												onChange={this.handleChange}
												value={this.state.a0}
												fill={true}
												rightElement={<Tag minimal={true}>1.4</Tag>}
											/>
										</ControlGroup>

										<ControlGroup fill={true} vertical={false} style={{width:"90%"}}>
											<Label htmlFor="z0" style={{width:"400px"}}>z0</Label>
											<InputGroup
												id="z0"
												disabled={true}
												// leftIcon="filter"
												// onChange={this.handleChange}
												value={this.state.z0}
												fill={true}
												rightElement={<Tag minimal={true}>1.5</Tag>}
											/>
										</ControlGroup>
									</div>

									<div className="cursor-pointer bg-gray-100 px-2 py-1 -mx-2 mt-8 mb-4 text-gray-900" onClick={
										() => this.setState({isUIStaticParamsShow: !this.state.isUIStaticParamsShow})
									}>
										<span id="icon" className="font-normal text-gray-900 mr-4">
											{this.state.isUIStaticParamsShow ? "-" : "+"}
										</span>
										Static Parameters
									</div>

									<div className={`${this.state.isUIStaticParamsShow ? "" : "hidden"}`}>
										<ControlGroup fill={true} vertical={false} style={{width:"90%"}}>
											<Label htmlFor="days-in-epoch" style={{width:"400px"}}>Days in an Epoch</Label>
											<InputGroup
												id="days-in-epoch"
												disabled={true}
												// leftIcon="filter"
												onChange={this.handleChange}
												value={this.state.daysInEpoch}
												fill={true}
												rightElement={<Tag minimal={true}>1.6</Tag>}
											/>

										</ControlGroup>

										<ControlGroup fill={true} vertical={false} style={{width:"90%"}}>
											<Label htmlFor="epochs-in-year" style={{width:"400px"}}>Epochs in a Year</Label>
											<InputGroup
												id="epochs-in-year"
												disabled={true}
												// leftIcon="filter"
												onChange={this.handleChange}
												value={this.state.epochsInYear}
												fill={true}
												rightElement={<Tag minimal={true}>1.7</Tag>}
											/>
										</ControlGroup>

										<ControlGroup fill={true} vertical={false} style={{width:"90%"}}>
											<Label htmlFor="slots-in-epoch" style={{width:"400px"}}>Slots in an Epoch</Label>
											<InputGroup
												id="slots-in-epoch"
												disabled={true}
												// leftIcon="filter"
												onChange={this.handleChange}
												value={this.state.slotsInEpoch.toLocaleString("en-US")}
												fill={true}
												rightElement={<Tag minimal={true}>1.8</Tag>}
											/>
										</ControlGroup>

										<ControlGroup fill={true} vertical={false} style={{width:"90%"}}>
											<Label htmlFor="chain-density" style={{width:"400px"}}>Chain Density</Label>
											<InputGroup
												id="chain-density"
												disabled={true}
												// asyncControl={true}
												// leftIcon="filter"
												onChange={this.handleChange}
												// inputRef={"chain-density"}
												value={this.state.chainDensity}
												fill={true}
												rightElement={<Tag minimal={true}>1.9</Tag>}
											/>
										</ControlGroup>

										<ControlGroup fill={true} vertical={false} style={{width:"90%"}}>
											<Label htmlFor="blocks-per-epoch" style={{width:"400px"}}>Blocks per Epoch</Label>
											<InputGroup
												id="blocks-per-epoch"
												disabled={true}
												// leftIcon="filter"
												onChange={this.handleChange}
												value={this.state.blocksPerEpoch.toLocaleString("en-US")}
												fill={true}
												rightElement={<Tag minimal={true}>1.10</Tag>}
											/>
										</ControlGroup>

										<ControlGroup fill={true} vertical={false} style={{width:"90%"}}>
											<Label htmlFor="max-ada-supply" style={{width:"400px"}}>Max ADA Supply</Label>
											<InputGroup
												id="max-ada-supply"
												disabled={true}
												// leftIcon="filter"
												// onChange={this.handleChange}
												value={this.state.maxAdaSupply.toLocaleString("en-US", {maximumFractionDigits: 0})}
												fill={true}
												rightElement={<Tag minimal={true}>1.11</Tag>}
											/>
										</ControlGroup>

										<ControlGroup fill={true} vertical={false} style={{width:"90%"}}>
											<Label htmlFor="current-ada-supply" style={{width:"400px"}}>Current ADA Supply</Label>
											<InputGroup
												id="current-ada-supply"
												disabled={false}
												// leftIcon="filter"
												onChange={this.handleChange}
												value={this.state.currentAdaSupply?.toLocaleString("en-US", {maximumFractionDigits: 0})}
												// defaultValue={this.state.currentAdaSupply.toLocaleString("en-US")}
												fill={true}
												rightElement={<Tag minimal={true}>1.12</Tag>}
											/>
										</ControlGroup>

										<ControlGroup fill={true} vertical={false} style={{width:"90%"}}>
											<Label htmlFor="reserve-ada" style={{width:"400px"}}>Reserve ADA</Label>
											<InputGroup
												id="reserve-ada"
												disabled={true}
												// leftIcon="filter"
												// onChange={this.handleChange}
												value={this.state.reserveAda?.toLocaleString("en-US", {maximumFractionDigits: 0})}
												fill={true}
												rightElement={<Tag minimal={true}>1.13</Tag>}
											/>
										</ControlGroup>

										<ControlGroup fill={true} vertical={false} style={{width:"90%"}}>
											<Label htmlFor="total-staked-ada" style={{width:"400px"}}>Total Staked ADA</Label>
											<InputGroup
												id="total-staked-ada"
												disabled={false}
												// leftIcon="filter"
												onChange={this.handleChange}
												value={this.state.totalAdaStaked?.toLocaleString("en-US", {maximumFractionDigits: 0})}
												fill={true}
												rightElement={<Tag minimal={true}>1.14</Tag>}
											/>
										</ControlGroup>
									</div>

									<div className="cursor-pointer bg-gray-100 px-2 py-1 -mx-2 mt-8 mb-4 text-gray-900" onClick={
										() => this.setState({isUIFeesReservesShow: !this.state.isUIFeesReservesShow})
									}>
										<span id="icon" className="font-normal text-gray-900 mr-4">
											{this.state.isUIFeesReservesShow ? "-" : "+"}
										</span>
										Fees & Remaining Reserves
									</div>

									<div className={`${this.state.isUIFeesReservesShow ? "" : "hidden"}`}>
										<ControlGroup fill={true} vertical={false} style={{width:"90%"}}>
											<Label htmlFor="fees-in-epoch" style={{width:"400px"}}>Fees per Epoch</Label>
											<InputGroup
												id="fees-in-epoch"
												disabled={false}
												leftIcon="plus"
												onChange={this.handleChange}
												value={this.state.feesInEpoch?.toLocaleString("en-US", {maximumFractionDigits: 0})}
												fill={true}
												rightElement={<Tag minimal={true}>1.15</Tag>}
											/>
										</ControlGroup>

										<ControlGroup fill={true} vertical={false} style={{width:"90%"}}>
											<Label htmlFor="distribution-from-reserve" style={{width:"400px"}}>Distribution from Reserve</Label>
											<InputGroup
												id="distribution-from-reserve"
												disabled={true}
												leftIcon="plus"
												// onChange={this.handleChange}
												value={this.state.distributionFromReserve?.toLocaleString("en-US", {maximumFractionDigits: 0})}
												fill={true}
												rightElement={<Tag minimal={true}>1.16</Tag>}
											/>
										</ControlGroup>

										<ControlGroup fill={true} vertical={false} style={{width:"90%"}}>
											<Label htmlFor="gross-reward" style={{width:"400px"}}>Gross Reward</Label>
											<InputGroup
												id="equals"
												disabled={true}
												leftIcon="equals"
												// onChange={this.handleChange}
												value={this.state.grossReward?.toLocaleString("en-US", {maximumFractionDigits: 0})}
												fill={true}
												rightElement={<Tag minimal={true}>1.17</Tag>}
											/>
										</ControlGroup>

										<ControlGroup fill={true} vertical={false} style={{width:"90%"}}>
											<Label htmlFor="distribution-to-treasury" style={{width:"400px"}}>Distribution to Treasury</Label>
											<InputGroup
												id="distribution-to-treasury"
												disabled={true}
												leftIcon="minus"
												// onChange={this.handleChange}
												value={this.state.distributionToTreasury?.toLocaleString("en-US", {maximumFractionDigits: 0})}
												fill={true}
												rightElement={<Tag minimal={true}>1.18</Tag>}
											/>
										</ControlGroup>

										<ControlGroup fill={true} vertical={false} style={{width:"90%"}}>
											<Label htmlFor="reward-to-pools" style={{width:"400px"}}>Net Reward to Pools</Label>
											<InputGroup
												id="reward-to-pools"
												disabled={true}
												leftIcon="equals"
												// onChange={this.handleChange}
												value={this.state.rewardToPoolOperators?.toLocaleString("en-US", {maximumFractionDigits: 0})}
												fill={true}
												rightElement={<Tag minimal={true}>1.19</Tag>}
											/>
										</ControlGroup>
									</div>
								</div>
							</div>

							{/* Row 4, Column 2 */}
							<div className="border border-gray-300 shadow-md rounded-lg bg-white p-4">
								<p>Info</p>
							</div>
						</div>




					</div>
				</main>

			</div>

		)
	}


}


