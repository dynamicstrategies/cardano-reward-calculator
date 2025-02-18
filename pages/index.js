import Image from "next/image";
import React from 'react';
import Head from 'next/head';
import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import cardanoLogo from "../public/images/cardano_logo_white.svg";
import {
  computeBinomCFD,
  getChainTip,
  getEpochInfo,
  getProtocolParams,
  getReserves, getStakePoolActiveSinceEpoch,
  getStakePoolInfo,
  getStakePoolList,
  Quartile, shuffleArray
} from "@/components/utils";
import {Button, ControlGroup, InputGroup, Intent, Label, OverlayToaster, Position, Tag} from "@blueprintjs/core";
import {Calendar, Cube, SeriesAdd, User, Percentage, BankAccount} from "@blueprintjs/icons";
import StakePoolSelector from "../components/StakePoolSelector";
import InfoHoverComponent from "../components/InfoHoverComponent";
import {infoHovers, infoSections, uiText} from "@/components/infos";
import UiSpinner from "../components/UiSpinner";
import { createRoot } from "react-dom/client";
import VersionDisplay from "@/components/VersionDisplay";


// export async function getServerSideProps({ query }) {
//
//   const lang = query.lang || "en";
//   console.log(`language: ${lang}`)
//
//   return {
//     props: {
//       lang
//     },
//   };
// }

/**
 * A React class component that handles all user interactions
 */
class RewardCalculator extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

      /**
       * Language of the front end
       * default is English
       */
      lang: "en",


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
      poolVariableFee: undefined, // e.g. 2
      sigma: undefined,
      sigmadash: undefined,
      s: undefined,
      sdash: undefined,

      prev_delegatorsStake: undefined,

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
       * Default Parameters
       */
      userAmount: 10000,
      prev_userAmount: 10000,
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
      showHeader: false,
      uiProgressPerc: 0,
      indexerDataLoaded: false,

      isUIStakePoolsShown: false,
      isUIStakeParamsShown: false,
      isUIBlockParamsShown: false,
      isUIDynamicParamsShow: true,
      isUIStaticParamsShow: false,
      isUIFeesReservesShow: false,
      stakePoolNSelected: undefined,
      stakePool_1_Stats: {
        name: "",
        poolBech32: "",
        description: "",
        yearsActive: undefined,
        lifetimeBlocks: undefined,
        nDelegators: undefined,
        marginPerc: undefined,
        minFee: undefined,
        delegatorsReward_lower: 0,
        delegatorsReward_av: 0,
        delegatorsReward_upper: 0,
        delegatorsStake: 0,
      },
      stakePool_2_Stats: {
        name: "",
        poolBech32: "",
        description: "",
        yearsActive: undefined,
        lifetimeBlocks: undefined,
        nDelegators: undefined,
        marginPerc: undefined,
        minFee: undefined,
        delegatorsReward_lower: 0,
        delegatorsReward_av: 0,
        delegatorsReward_upper: 0,
        delegatorsStake: 0,
      },
      stakePool_3_Stats: {
        name: "",
        poolBech32: "",
        description: "",
        yearsActive: undefined,
        lifetimeBlocks: undefined,
        nDelegators: undefined,
        marginPerc: undefined,
        minFee: undefined,
        delegatorsReward_lower: 0,
        delegatorsReward_av: 0,
        delegatorsReward_upper: 0,
        delegatorsStake: 0,
      },



      /**
       * Monte Carlo Simulation
       */
      monteCarloPoolStats: {
        poolReward_av: undefined,
        delegatorsReward_av: undefined,
        totalReward_av: undefined,
        delegatorsReward_lower: undefined,
        delegatorsReward_upper: undefined,
      },

      /**
       * Top screen total rewards
       */
      rewardsPerYearADA: undefined,
      prev_rewardsPerYearADA: undefined,
      rewardsPerYearPerc: undefined,
      prev_rewardsPerYearPerc: undefined,

      /**
       * Plaecholder with Monte Carlo stats
       * Clones the monte carlo object to store the
       * previously simulated results
       */
      prev_monteCarloPoolStats: {},

      /**
       * Global Parameters
       */
      maxNblocksPoolInEpoch: 120,
      nMonteCarloSimuls: 10000,

    }

    /**
     * Intermediate state when something has changed, so the app needs
     * to be recalculated, but the user has not yet finished making changes
     * so the recalc waits for user to finish editing
     */
    this.recalcPending = false;

    /**
     * Placeholder variable for the toast error message
     */
    this.errorToaster = undefined;


  }

  /**
   * Retrieves data from a blockchain indexer
   * - Gets the chain tip find the latest epoch
   *
   * - Gets the current active stake from the latest epoch
   * and the gets the total fees of the blockchain from the previous epoch (the
   * previous epoch is preferred as it has the fees for the whole epoch - whereas
   * getting fees from the current epoch would need to extrapolate until the end
   * of epoch that can lead to inaccuracies)
   *
   * - Gets the Blockchain protocol parameters (rho - monetaryExpansion;
   * tau - treasuryCut; k - stakePoolTargetNum; a0 - poolPledgeInfluence)
   *
   * - Get the Current Ada supply (not all of 45b ADA has been released)
   *
   * - Gets the basic information on all stake pools. This is then used
   * for a user to select more info a particular stake pool
   *
   */
  initData = async () => {

    try {

      console.log("--- Getting Chain Tip ---")
      const chainTipObj = await getChainTip();
      const currentEpochN = chainTipObj["epoch_no"]
      const currentEpochSlot = chainTipObj["epoch_slot"]
      const currentBlockTime = chainTipObj["block_time"]
      this.setState({uiProgressPerc: 0.15})

      console.log("--- Getting Current Epoch Info ---")
      const epochInfoObj_curr = await getEpochInfo(currentEpochN);
      const totalAdaStaked = epochInfoObj_curr["active_stake"] / 1000000
      this.setState({uiProgressPerc: 0.30})

      console.log("--- Getting Previous Epoch Info ---")
      const prevEpochN = currentEpochN - 1;
      const epochInfoObj_prev = await getEpochInfo(prevEpochN);
      const feesInEpoch = epochInfoObj_prev["fees"] / 1000000
      this.setState({uiProgressPerc: 0.45})

      console.log("--- Getting Protocol Parameters ---")
      const protocolParamsObj = await getProtocolParams();
      const rho = protocolParamsObj["monetaryExpansion"]
      const tau = protocolParamsObj["treasuryCut"]
      const k = protocolParamsObj["stakePoolTargetNum"]
      const a0 = protocolParamsObj["poolPledgeInfluence"]
      this.setState({uiProgressPerc: 0.55})

      console.log("--- Getting Protocol Reserves ---")
      const reservesObj = await getReserves(currentEpochN);
      const currentAdaSupply = reservesObj["supply"] / 1000000
      this.setState({uiProgressPerc: 0.65})

      console.log("--- Getting Stake Pools Info ---")
      const spObj = await getStakePoolList();
      this.setState({uiProgressPerc: 0.80})
      // console.log(spObj)

      /**
       * Retrieves all stake pools., but then only keeps the one that:
       * - have been registered
       * - have a ticker. Stake pools without a ticker tend to be private pools
       * - have pledged what they promised
       */

      // split into pools with a ticker and without
      const poolsWithTicker = []
      const poolsNoTicker = []

      for (const x of spObj) {
        if (x["pool_status"] !== "registered") continue

        if (x["ticker"]) {
          poolsWithTicker.push(x)
        } else {
          x["ticker"] = "no_ticker"
          poolsNoTicker.push(x)
        }
      }

      console.log("--- do the shuffle ---") // shuffle the pools with a ticker
      const poolsWithTicker_shuffled = shuffleArray(poolsWithTicker)

      // append the pools without a ticker to the bottom of the list
      const allStakePoolInfo = poolsWithTicker_shuffled.concat(poolsNoTicker)

      console.log("retrieved live pools: " + allStakePoolInfo?.length)
      const indexerDataLoaded = true

      /**
       * Update state with the retrieved information
       * and then recalculate everything.
       * Then finally update the state that everything has been loaded
       */
      this.setState({
        allStakePoolInfo,
        rho, tau, k, a0,
        currentEpochN, currentEpochSlot, currentBlockTime,
        totalAdaStaked, feesInEpoch,
        currentAdaSupply,
      }, () => {
        this.updateSelectedPoolParams()
        this.setState({indexerDataLoaded})
      })


    } catch(e) {
      console.error(e)
      this.showErrorToast("Error syncing with the blockchain. Check your internet connection and try again.")
    }
  }

  /**
   * Shows an error toastie at the top of the screen
   */
  showErrorToast = (message) => {

    const toastOptions = {
      message,
      intent: Intent.DANGER,
      icon: "warning-sign",
    }

    if (this.errorToaster) {
      this.errorToaster.show({...toastOptions})
    }


  }

  /**
   * This is called when a user selects a specific pool
   * The function queries additional parameters for that pool
   * from the blockchain indexer. Additional fields are:
   * - pool name and description
   * - pool pledge
   * - pool fixed cost
   * - pool variable fee
   * - pool active stake (the stake used to determine block probability)
   * - active since epoch
   *
   * This then updates the parameters used in the calculator and a
   * recalculation is launched + the UI is updated with pool
   * parameters
   *
   */
  updateSelectedPoolParams = async (selectedPoolBech32 = this.state.selectedPoolBech32) => {

    try {
      const spInfo = await getStakePoolInfo(selectedPoolBech32)
      console.log("--- selected a stake pool ---")
      console.log(spInfo)

      const poolPledge = Number(spInfo?.live_pledge) / 1_000_000 || 0;
      const poolFixedCost = Number(spInfo?.fixed_cost) / 1_000_000 || 0;
      const poolVariableFee = Number(spInfo?.margin) * 100 || 0;
      const poolStake = Number(spInfo?.active_stake) / 1_000_000 || 0;

      // const activeSinceEpoch = Number(spInfo?.active_epoch_no);
      const activeSinceEpoch = await getStakePoolActiveSinceEpoch(selectedPoolBech32)
      const yearsActive = (this.state.currentEpochN - activeSinceEpoch) / this.state.epochsInYear;
      const lifetimeBlocks = spInfo?.block_count || 0; // set to 0 if value is null, bo blocks minted
      const nDelegators = spInfo?.live_delegators || 0;
      const name = spInfo?.meta_json?.name;
      const description = spInfo?.meta_json?.description;
      const poolBech32 = selectedPoolBech32;

      /**
       * The pool is red flagged if it has one of the following conditions:
       * - the pool live pledge is lower than what was promised
       */
      const isRedFlag = Number(spInfo["live_pledge"]) < Number(spInfo["pledge"])
      // console.log("isRedFlag: " + isRedFlag)

      // update state and recalculate all parameters in the calculator
      this.setState({poolPledge, poolFixedCost, poolVariableFee, poolStake},
          () => this.recalcAll())

      /**
       * Update the state variable that are used in the UI
       * depending on which pool has been selected. This information
       * is used only used in the UI and does not trigger
       * additional calculation
       */
      if (this.state.stakePoolNSelected) {
        let _poolStats =
            this.state.stakePoolNSelected === 1 ? this.state.stakePool_1_Stats :
                this.state.stakePoolNSelected === 2 ? this.state.stakePool_2_Stats :
                    this.state.stakePoolNSelected === 3 ? this.state.stakePool_3_Stats : undefined

        if (_poolStats) {
          _poolStats = {
            ..._poolStats,
            name,
            poolBech32,
            description,
            yearsActive,
            lifetimeBlocks,
            nDelegators,
            isRedFlag,
          }
        }

        const _result =
            this.state.stakePoolNSelected === 1 ? this.setState({stakePool_1_Stats: _poolStats}) :
                this.state.stakePoolNSelected === 2 ? this.setState({stakePool_2_Stats: _poolStats}) :
                    this.state.stakePoolNSelected === 3 ? this.setState({stakePool_3_Stats: _poolStats}) : undefined

      }
    } catch(e) {
      console.error(e)
      this.showErrorToast("Error retrieving information on the selected Stake pool from the blockchain. Check that you are connected to the internet and try again.")
    }



  }

  /**
   * Called when  the user finishes editing a field
   */
  onFocusOut = () => {
    if (this.recalcPending) {
      this.recalcAll()
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
    const poolStake_plus_userAmount = this.state.poolStake + this.state.userAmount
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

    /**
     * Store the previous delegatorsStake and save to state
     * this is done to show a comparison of rewards between
     * simulations
     */
    const prev_delegatorsStake = this.state.delegatorsStake;
    // const prev_userAmount = this.state.userAmount;

    this.setState({
      reserveAda,
      z0,
      distributionFromReserve,
      grossReward,
      distributionToTreasury,
      rewardToPoolOperators,
      delegatorsStake,
      prev_delegatorsStake,
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
      poolStake_plus_userAmount,
      // prev_userAmount,
    }, () => {this.runMonteCarlo()})

    // all has been recalculated, so now wait for more data to be changes
    this.recalcPending = false;

  }


  /**
   * Simulates a full year of rewards, by going through every epoch and
   * checking how much rewards would have been earned by the stake pool
   * and what proportion would be distributed to delegators
   */
  simulatedPoolRewards = (binomialCDFArr) => {

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

      while (randn > binomialCDFArr[nblocks]) {
        if (nblocks > binomialCDFArr.length) break
        nblocks++;
      }

      // totalBlocks += nblocks;

      const rewardMultiplier = (nblocks / this.state.blocksPerEpoch) / this.state.blockAssigmentProbability;
      const epoch_totalReward = this.state.expectedPoolRewardInEpoch * rewardMultiplier;
      const epoch_poolFixedReward = Math.min(epoch_totalReward, this.state.poolFixedCost);
      const epoch_poolVariableReward = (epoch_totalReward - epoch_poolFixedReward) * Number(this.state.poolVariableFee) / 100;
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

    // time the execution
    console.time('monte_carlo_core')


    /**
     * Pre-populate an array with number of blocks for a random draw from a
     * uniform distribution. This speeds up the monte carlo simulation by
     * not having to compute the Binomial CDF at every epoch of every iteration
     */
    let binomialCDFArr = []
    for (let i = 0; i <= this.state.maxNblocksPoolInEpoch; i++) {
      const binomcdf = computeBinomCFD(i, this.state.blocksPerEpoch, this.state.blockAssigmentProbability)
      binomialCDFArr.push(binomcdf)
    }

    // reset previous run before kicking off a new one
    let monetCarloSimul = [];


    for (let i = 0; i < this.state.nMonteCarloSimuls; i++) {

      const simul = this.simulatedPoolRewards(binomialCDFArr);

      const simulRes = {
        totalReward: simul.totalReward,
        poolReward: simul.poolReward,
        delegatorsReward: simul.delegatorsReward,
      }

      monetCarloSimul.push(simulRes)

    }

    console.timeEnd('monte_carlo_core')


    // calc summary stats
    const poolRewards = monetCarloSimul.map(x => x.poolReward);
    const delegatorsRewards = monetCarloSimul.map(x => x.delegatorsReward);
    const totalRewards = monetCarloSimul.map(x => x.totalReward);

    const poolReward_av = (monetCarloSimul.reduce((tot, val) => {return (tot + val.poolReward)}, 0)) / this.state.nMonteCarloSimuls;
    const delegatorsReward_av = (monetCarloSimul.reduce((tot, val) => {return (tot + val.delegatorsReward)}, 0)) / this.state.nMonteCarloSimuls;
    const totalReward_av = (monetCarloSimul.reduce((tot, val) => {return (tot + val.totalReward)}, 0)) / this.state.nMonteCarloSimuls;


    const delegatorsReward_lower = Quartile(delegatorsRewards, 0.1)
    const delegatorsReward_upper = Quartile(delegatorsRewards, 0.9);

    const delegatorsStake = this.state.delegatorsStake;

    const monteCarloPoolStats = {
      poolReward_av,
      delegatorsReward_av,
      totalReward_av,
      delegatorsReward_lower,
      delegatorsReward_upper,
    }

    /**
     * Copy previous monte carlo results into a separate
     * object and store
     */
    let prev_monteCarloPoolStats = {}
    Object.assign(prev_monteCarloPoolStats, this.state.monteCarloPoolStats)


    /**
     * Calculate Staking rewards per year in ADA and as a %
     * for current and previous results
     */
    const rewardsPerYearPerc = delegatorsReward_av / delegatorsStake;
    const prev_rewardsPerYearPerc = prev_monteCarloPoolStats?.delegatorsReward_av / this.state.prev_delegatorsStake;
    const rewardsPerYearADA = rewardsPerYearPerc * this.state.userAmount;
    const prev_rewardsPerYearADA = prev_rewardsPerYearPerc * this.state.prev_userAmount;

    /**
     * Store the user amount as prev_userAmount for next iteration
     */
    const prev_userAmount = this.state.userAmount;

    // set state
    this.setState({
      monetCarloSimul,
      prev_monteCarloPoolStats,
      monteCarloPoolStats,
      rewardsPerYearPerc,
      prev_rewardsPerYearPerc,
      rewardsPerYearADA,
      prev_rewardsPerYearADA,
      prev_userAmount,
    })

    /**
     * Update the state variable that are used in the UI
     * depending on which pool has been selected. This information
     * is used only used in the UI and does not trigger
     * additional calculation
     */
    if (this.state.stakePoolNSelected) {
      let _poolStats =
          this.state.stakePoolNSelected === 1 ? this.state.stakePool_1_Stats :
              this.state.stakePoolNSelected === 2 ? this.state.stakePool_2_Stats :
                  this.state.stakePoolNSelected === 3 ? this.state.stakePool_3_Stats : undefined

      if (_poolStats) {
        _poolStats = {
          ..._poolStats,
          delegatorsReward_av,
          delegatorsReward_lower,
          delegatorsReward_upper,
          delegatorsStake,
        }
      }

      // console.log(_poolStats)

      const _result =
          this.state.stakePoolNSelected === 1 ? this.setState({stakePool_1_Stats: _poolStats}) :
              this.state.stakePoolNSelected === 2 ? this.setState({stakePool_2_Stats: _poolStats}) :
                  this.state.stakePoolNSelected === 3 ? this.setState({stakePool_3_Stats: _poolStats}) : undefined

    }


  }




  handleChange = (event) => {
    let str = event.target.value
    str = str.replace(/,/g,"")

    let val = Number(str)
    let id = event.target.id;

    switch(id) {
      case "ada-to-stake":
        /**
         * Store previous user amount in state variable and
         * then update current userAmount
         */
        const prev_userAmount = this.state.userAmount;
        // this.setState({userAmount: val}, () => this.recalcAll(prev_userAmount))
        this.setState({userAmount: val}, () => {this.recalcPending = true})
        break

      case "days-in-epoch":
        this.setState({daysInEpoch: val, epochsInYear: 365/val},() => {this.recalcPending = true})
        break
      case "epochs-in-year":
        this.setState({daysInEpoch: 365 / val, epochsInYear: val},() => {this.recalcPending = true})
        break
      case "slots-in-epoch":
        this.setState({slotsInEpoch: val},() => {this.recalcPending = true})
        break
      case "chain-density":
        this.setState({chainDensity: val},() => {
          if (Number(val) !== 0) {
            this.recalcPending = true
          }
        })
        break
      case "blocks-per-epoch":
        this.setState({blocksPerEpoch: val},() => {this.recalcPending = true})
        break
      case "current-ada-supply":
        this.setState({currentAdaSupply: val},() => {this.recalcPending = true})
        break
      case "total-staked-ada":
        const truncVal = Math.min(this.state.currentAdaSupply, val)
        this.setState({totalAdaStaked: truncVal},() => {
          if (Number(truncVal) !== 0) {
            this.recalcPending = true
          }
        })
        break
      case "rho":
        this.setState({rho: val},() => {this.recalcPending = true})
        break
      case "tau":
        this.setState({tau: val},() => {
          if (Number(val) !== 0) {
            this.recalcPending = true
          }
        })
        break
      case "k":
        this.setState({k: val},() => {this.recalcPending = true})
        break
      case "a0":
        this.setState({a0: val},() => {this.recalcPending = true})
        break

      case "fees-in-epoch":
        this.setState({feesInEpoch: val},() => {this.recalcPending = true})
        break

      case "pool-pledge":
        const tmp = Math.min(val, this.state.poolStake_plus_userAmount);
        this.setState({poolPledge: tmp},() => {this.recalcPending = true})
        break
        // case "delegators-stake":
        // 	this.setState({delegatorsStake: val},() => {this.recalcPending = true})
        // 	break
      case "total-pool-stake":
        const poolStake = val - this.state.userAmount
        this.setState({poolStake},() => {this.recalcPending = true})
        break
      case "pool-fixed-costs":
        this.setState({poolFixedCost: val},() => {this.recalcPending = true})
        break
      case "pool-variable-fee":
        this.setState({poolVariableFee: val},() => {this.recalcPending = true})
        break

      default:
        console.log(`id not found: ${id}`)
    }

  }

  handlePoolSelect = (spObj) => {

    const selectedPoolBech32 = spObj?.pool_id_bech32;
    const stakePoolNSelected = spObj?.stakePoolN;
    this.setState({selectedPoolBech32, stakePoolNSelected},
        () => this.updateSelectedPoolParams().then(() => {}))

  }


  printStakingRewardPerYearInADA = () => {
    let html = [];


    if (this.state.indexerDataLoaded && this.state.monteCarloPoolStats?.delegatorsReward_av) {
      html.push(
          <div id="curr_adareward">
            {`${Number(this.state.rewardsPerYearADA).toLocaleString("en-US", {maximumFractionDigits: 0})}`}
          </div>
      )


      if (this.state.prev_monteCarloPoolStats?.delegatorsReward_av) {
        html.push(
            <div id="prev_adareward" className="text-gray-300 font-normal">
              {`${Number(this.state.prev_rewardsPerYearADA).toLocaleString("en-US", {maximumFractionDigits: 0})}`}
            </div>
        )
      }


    } else {
      html.push(
          <UiSpinner progress={this.state.uiProgressPerc} lang={this.state.lang}/>
      )
    }


    return html;
  }

  /**
   * Prints spinners that are updated as data is received from the
   * blockchain indexer
   */
  printAnnualizedStakingRewardInPerc = () => {

    let html = [];

    if (this.state.indexerDataLoaded && this.state.monteCarloPoolStats?.delegatorsReward_av) {
      html.push(
          <div id="curr_percreward">
            {`${(this.state.rewardsPerYearPerc * 100).toLocaleString("en-US", {maximumFractionDigits: 2})}%`}
          </div>
      )

      if (this.state.prev_monteCarloPoolStats?.delegatorsReward_av) {
        html.push(
            <div id="prev_percreward" className="text-gray-300 font-normal">
              {`${(this.state.prev_rewardsPerYearPerc * 100).toLocaleString("en-US", {maximumFractionDigits: 2})}%`}
            </div>
        )
      }

    } else {
      html.push(
          <UiSpinner progress={this.state.uiProgressPerc} lang={this.state.lang}/>
      )
    }

    return html;

  }


  async componentDidMount() {

    // Extract the language parameter from the URL
    const params = new URLSearchParams(window.location.search);
    const lang = params.get('lang');

    if (lang) {
      this.setState({ lang });
    }

    console.log(`language: ${lang}`)


    await this.initData()
    this.errorToaster = await OverlayToaster.createAsync({ position: Position.TOP }, {
      // Use createRoot() instead of ReactDOM.render() to comply with React 18
      domRenderer: (toaster, containerElement) => createRoot(containerElement).render(toaster),
    });

  }

  componentWillUnmount() {

  }


  render() {
    return (

        <div className="min-h-full">
          <Head>
            <title>Cardano Staking Reward Calculator</title>
            <meta name="description"
                  content="Cardano Staking Reward Calculator"/>
            <meta name="keywords"
                  content="Cardano, Staking Rewards, Calculator"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          </Head>

          {
            /**
             * Control with a showHeader state variable if you want to show
             * the header or not
             */

            this.state.showHeader
                ?
                <header className="bg-[#023E8A] shadow">
                  <div className="mx-auto flex max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <Image
                        src={cardanoLogo}
                        alt="logo"
                        className="mr-4"
                        layout="raw"
                        height="35"
                        width="35"
                        priority
                    />
                    <h1 className="text-3xl font-bold tracking-tight text-gray-50">Staking Reward Calculator</h1>
                  </div>
                </header>
                :
                null
          }


          <main className="mx-auto bg-gray-100">
            <div className="mx-auto md:max-w-7xl px-4 py-6 sm:px-6 lg:px-8">


              {/*<div className="mt-4 bg-yellow-100">*/}
              {/*	<p className="p-4 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">*/}
              {/*		Testing*/}
              {/*	</p>*/}
              {/*	<div className="flex m-4">*/}
              {/*		<div className="m-2">*/}
              {/*			<Button rightIcon="refresh" intent={Intent.PRIMARY} text="Get Tip" onClick={() => {*/}
              {/*				getChainTip().then(r => {*/}
              {/*					const currentEpochN = r["epoch_no"]*/}
              {/*					const currentEpochSlot = r["epoch_slot"]*/}
              {/*					const currentBlockTime = r["block_time"]*/}
              {/*					this.setState({currentEpochN, currentEpochSlot, currentBlockTime})*/}
              {/*					console.log("--- Chain Tip ---")*/}
              {/*					console.log(r)*/}
              {/*				})*/}
              {/*			}}/>*/}
              {/*		</div>*/}
              {/*		<div className="m-2">*/}
              {/*			<Button rightIcon="refresh" disabled={!this.state.currentEpochN} intent={Intent.PRIMARY} text="Get Epoch Info" onClick={() => {*/}
              {/*				getEpochInfo(this.state.currentEpochN).then(r => {*/}
              {/*					const totalAdaStaked = r["active_stake"]*/}
              {/*					const feesInEpoch = r["fees"]*/}
              {/*					this.setState({totalAdaStaked, feesInEpoch})*/}
              {/*					console.log("--- Current Epoch Info ---")*/}
              {/*					console.log(r)*/}
              {/*				})*/}
              {/*			}}/>*/}
              {/*		</div>*/}
              {/*		<div className="m-2">*/}
              {/*			<Button rightIcon="refresh" disabled={false} intent={Intent.PRIMARY} text="Get Protocol Parameters" onClick={() => {*/}
              {/*				getProtocolParams().then(r => {*/}
              {/*					const rho = r["monetaryExpansion"]*/}
              {/*					const tau = r["treasuryCut"]*/}
              {/*					const k = r["stakePoolTargetNum"]*/}
              {/*					const a0 = r["poolPledgeInfluence"]*/}
              {/*					this.setState({rho, tau, k, a0})*/}
              {/*					console.log("--- Protocol Parameters ---")*/}
              {/*					console.log(r)*/}
              {/*				})*/}
              {/*			}}/>*/}
              {/*		</div>*/}

              {/*		<div className="m-2">*/}
              {/*			<Button rightIcon="refresh" disabled={!this.state.currentEpochN} intent={Intent.PRIMARY} text="Get Protocol Reserves" onClick={() => {*/}
              {/*				getReserves(this.state.currentEpochN).then(r => {*/}
              {/*					const currentAdaSupply = r["supply"]*/}
              {/*					this.setState({currentAdaSupply})*/}
              {/*					console.log("--- Protocol Reserves ---")*/}
              {/*					console.log(r)*/}
              {/*				})*/}
              {/*			}}/>*/}
              {/*		</div>*/}

              {/*		<div className="m-2">*/}
              {/*			<Button rightIcon="refresh" disabled={false} intent={Intent.PRIMARY} text="Get Stake Pools" onClick={() => {*/}
              {/*				getStakePoolList().then(r => {*/}
              {/*					const livePools = r.filter(x => x["pool_status"] === "registered" && x["ticker"])*/}
              {/*					console.log("registered pools n: " + livePools.length)*/}
              {/*					this.setState({allStakePoolInfo: livePools})*/}
              {/*					// console.log(r)*/}
              {/*				})*/}
              {/*			}}/>*/}
              {/*		</div>*/}

              {/*		<div className="m-2">*/}
              {/*			<Button rightIcon="refresh" disabled={false} intent={Intent.PRIMARY} text="Show Toast" onClick={() => {*/}
              {/*				this.showErrorToast()*/}
              {/*			}}/>*/}
              {/*		</div>*/}

              {/*	</div>*/}
              {/*</div>*/}

              <div className="grid lg:grid-cols-3 lg:grid-rows-[auto_auto_auto_auto] gap-4">

                {/* Row 1, Column 1 */}
                <div className="border border-gray-300 shadow-md rounded-lg bg-white p-8 lg:col-span-2">
                  <h4 className="text-balance text-2xl font-medium tracking-tight text-gray-900">
                    {uiText["amount_ada_to_stake"][this.state.lang]}
                  </h4>

                  <div className="mt-2">
                    {uiText["amount_ada_to_stake_desc"][this.state.lang]}
                  </div>

                  <div className="mt-8 grid gap-4 overflow-hidden text-center">

                    <ControlGroup fill={true} vertical={false} style={{width:"100%"}}>
                      <InputGroup
                          style={{fontSize: "1.8rem", padding: "1.2em", textAlign: "center", fontWeight: 500}}
                          id="ada-to-stake"
                          disabled={false}
                          // leftIcon="filter"
                          onChange={this.handleChange}
                          onBlur={() => this.onFocusOut()}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") this.onFocusOut()
                          }}
                          value={this.state.userAmount.toLocaleString("en-US")}
                          fill={true}
                          rightElement={<Tag minimal={true}>ada</Tag>}
                      />
                    </ControlGroup>


                    <dl className="mt-8 grid grid-cols-1 gap-1 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-2">

                      <div key="pool-reward-ada" className="flex flex-col bg-gray-700/5 p-8">
                        <div className="flex flex-row gap-2 justify-center mt-4 ">
                          <dt className="text-sm/6 font-semibold text-gray-600">
                            {uiText["staking_rewards_per_year_ada_label"][this.state.lang]}
                          </dt>
                          <span className="mt-0.5">
                              <InfoHoverComponent>{infoHovers["staking_reward_per_year_ada"][this.state.lang]}</InfoHoverComponent>
                          </span>
                        </div>
                        <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 flex flex-row gap-4 justify-center">
                          {
                            this.printStakingRewardPerYearInADA()
                          }
                        </dd>
                      </div>


                      <div key="pool-reward-perc" className="flex flex-col bg-gray-700/5 p-8">
                        <div className="flex flex-row gap-2 justify-center mt-4 ">
                          <dt className="text-sm/6 font-semibold text-gray-600">
                            {uiText["annualized_staking_reward_label"][this.state.lang]}
                          </dt>
                          <span className="mt-0.5">
                              <InfoHoverComponent>{infoHovers["staking_reward_annualized_perc"][this.state.lang]}</InfoHoverComponent>
                          </span>
                        </div>
                        <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 flex flex-row gap-4 justify-center">
                          {
                            this.printAnnualizedStakingRewardInPerc()
                          }
                        </dd>
                      </div>


                    </dl>

                  </div>

                </div>

                {/* Row 1, Column 2 */}
                <div className="border border-gray-300 shadow-md rounded-lg bg-white p-4">
                  {infoSections["info_section_1"][this.state.lang]}
                </div>

                {/* Row 2, Column 1 - Stake Pools*/}
                <div className="lg:col-span-2">
                  <div className={`${this.state.isUIStakePoolsShown ? "bg-white text-gray-900" : "bg-gray-900 text-white"} border border-gray-300 shadow-md rounded-lg p-8`}>

                    <div className="cursor-pointer" onClick={
                      () => this.setState({isUIStakePoolsShown: !this.state.isUIStakePoolsShown})
                    }>
                      <h4 className="flex text-balance items-center text-2xl font-medium tracking-tight">
                        <span id="icon" className="-mt-0.5 text-3xl font-normal mr-4">
                            {this.state.isUIStakePoolsShown ? "-" : "+"}
                        </span>
                        {uiText["stake_pool_section_title"][this.state.lang]}
                      </h4>

                      <div className="mt-2">
                        {uiText["stake_pool_section_desc"][this.state.lang]}
                      </div>

                    </div>

                    <div className={`${this.state.isUIStakePoolsShown ? "" : "hidden"} mt-8 grid gap-4 overflow-hidden md:grid-cols-3`}>



                      <div key="stake-pool-1" className={`
										flex flex-col p-4 rounded-xl border-2 
										${this.state.stakePoolNSelected === 1 ? "border-blue-primary" : ""}
										${this.state.stakePool_1_Stats.isRedFlag ? "bg-red-300" : "bg-gray-700/5"}
									`}
                           onClick={() => {
                             // this.setState({stakePoolNSelected: 1})

                             const poolBech32 = this.state.stakePool_1_Stats?.poolBech32
                             if (poolBech32 && this.state.stakePoolNSelected !== 1) {
                               this.setState({selectedPoolBech32: poolBech32, stakePoolNSelected: 1},
                                   () => this.updateSelectedPoolParams().then(() => {}))
                             }

                           }
                           }>

                        <div className="mb-4">
                          <p className="mb-2">Select a Pool Ticker #1:</p>
                          <StakePoolSelector stakePoolN={1} allStakePoolInfo={this.state.allStakePoolInfo} handlePoolSelect={this.handlePoolSelect}/>
                        </div>


                        <div className="grid gap-1 grid-cols-3 py-2 text-left border-t border-b border-gray-300">
                          <div className="col-span-2"><Cube size={14} className="mr-2"/> Blocks Minted</div>
                          <div className="text-center">{
                            this.state.stakePool_1_Stats?.lifetimeBlocks !== undefined
                                ?
                                (this.state.stakePool_1_Stats?.lifetimeBlocks).toLocaleString("en-US")
                                :
                                null
                          }</div>

                          <div className="col-span-2"><Calendar size={14} className="mr-2"/> Years Active</div>
                          <div className="text-center">{
                            this.state.stakePool_1_Stats?.yearsActive !== undefined
                                ?
                                (this.state.stakePool_1_Stats?.yearsActive).toLocaleString("en-US", {maximumFractionDigits: 1})
                                :
                                null
                          }</div>

                          <div className="col-span-2"><User size={14} className="mr-2"/> # Delegators</div>
                          <div className="text-center">{
                            this.state.stakePool_1_Stats?.nDelegators !== undefined
                                ?
                                (this.state.stakePool_1_Stats?.nDelegators).toLocaleString("en-US", {maximumFractionDigits: 0})
                                :
                                null
                            }
                          </div>

                          <div className="col-span-2"><Percentage size={14} className="mr-2"/> Margin</div>
                          <div className="text-center">{
                            this.state.stakePool_1_Stats?.nDelegators !== undefined
                                ?
                                (this.state.stakePool_1_Stats?.nDelegators).toLocaleString("en-US", {maximumFractionDigits: 0})
                                :
                                null
                          }
                          </div>

                          <div className="col-span-2"><BankAccount size={14} className="mr-2"/> Min Fee</div>
                          <div className="text-center">{
                            this.state.stakePool_1_Stats?.nDelegators !== undefined
                                ?
                                (this.state.stakePool_1_Stats?.nDelegators).toLocaleString("en-US", {maximumFractionDigits: 0})
                                :
                                null
                          }
                          </div>

                        </div>

                        <div className="flex flex-row justify-between mt-8">
                          <p className=""><SeriesAdd size={14} className="mr-2"/> Expected Return</p>
                          <InfoHoverComponent>{infoHovers["monte_carlo"][this.state.lang]}</InfoHoverComponent>
                        </div>


                        {
                          // Only show expected return if there is something to show
                          this.state.stakePool_1_Stats?.delegatorsReward_av
                              ?
                              <div>
                                <div className="grid gap-2 grid-cols-3 bg-gray-900/5 -ml-2 -mr-2 mt-1 py-4 px-2 text-center bg-blue-primary rounded-md">
                                  <div className="font-medium">Lower</div>
                                  <div className="font-medium">Average</div>
                                  <div className="font-medium">Upper</div>
                                  <div>{`${(this.state.stakePool_1_Stats?.delegatorsReward_lower / this.state.stakePool_1_Stats?.delegatorsStake * 100).toLocaleString("en-US", {maximumFractionDigits: 2})} %`}</div>
                                  <div>{`${(this.state.stakePool_1_Stats?.delegatorsReward_av / this.state.stakePool_1_Stats?.delegatorsStake * 100).toLocaleString("en-US", {maximumFractionDigits: 2})} %`}</div>
                                  <div>{`${(this.state.stakePool_1_Stats?.delegatorsReward_upper / this.state.stakePool_1_Stats?.delegatorsStake * 100).toLocaleString("en-US", {maximumFractionDigits: 2})} %`}</div>
                                </div>
                                <div className="mt-2 text-xs">Stake pool parameters are shown in the section below</div>
                              </div>

                              :
                              null
                        }

                      </div>


                      <div key="stake-pool-2" className={`flex flex-col bg-gray-700/5 p-4 rounded-xl border-2 ${this.state.stakePoolNSelected === 2 ? "border-blue-primary" : ""}`}
                           onClick={() => {
                             // this.setState({stakePoolNSelected: 1})

                             const poolBech32 = this.state.stakePool_2_Stats?.poolBech32
                             if (poolBech32 && this.state.stakePoolNSelected !== 2) {
                               this.setState({selectedPoolBech32: poolBech32, stakePoolNSelected: 2},
                                   () => this.updateSelectedPoolParams().then(() => {}))
                             }

                           }
                           }>

                        <div className="mb-4">
                          <p className="mb-2">Select a Pool Ticker #2:</p>
                          <StakePoolSelector stakePoolN={2} allStakePoolInfo={this.state.allStakePoolInfo} handlePoolSelect={this.handlePoolSelect}/>
                        </div>


                        <div className="grid gap-1 grid-cols-3 py-2 text-left border-t border-b border-gray-300">
                          <div className="col-span-2"><Cube size={14} className="mr-2"/> Blocks Minted</div>
                          <div className="text-center">{
                            this.state.stakePool_2_Stats?.lifetimeBlocks !== undefined
                                ?
                                (this.state.stakePool_2_Stats?.lifetimeBlocks).toLocaleString("en-US")
                                :
                                null
                          }</div>

                          <div className="col-span-2"><Calendar size={14} className="mr-2"/> Years Active</div>
                          <div className="text-center">{
                            this.state.stakePool_2_Stats?.yearsActive !== undefined
                                ?
                                (this.state.stakePool_2_Stats?.yearsActive).toLocaleString("en-US", {maximumFractionDigits: 1})
                                :
                                null
                          }</div>

                          <div className="col-span-2"><User size={14} className="mr-2"/> # Delegators</div>
                          <div className="text-center">{
                            this.state.stakePool_2_Stats?.nDelegators !== undefined
                                ?
                                (this.state.stakePool_2_Stats?.nDelegators).toLocaleString("en-US", {maximumFractionDigits: 0})
                                :
                                null

                          }</div>

                        </div>

                        <p className="mt-8"><SeriesAdd size={14} className="mr-2"/> Expected Return</p>
                        {
                          // Only show expected return if there is something to show
                          this.state.stakePool_2_Stats?.delegatorsReward_av
                              ?
                              <div className="grid gap-2 grid-cols-3 bg-gray-900/5 -ml-2 -mr-2 mt-1 py-4 px-2 text-center bg-blue-primary rounded-md">
                                <div className="font-medium">Lower</div>
                                <div className="font-medium">Average</div>
                                <div className="font-medium">Upper</div>
                                <div>{`${(this.state.stakePool_2_Stats?.delegatorsReward_lower / this.state.stakePool_2_Stats?.delegatorsStake * 100).toLocaleString("en-US", {maximumFractionDigits: 2})} %`}</div>
                                <div>{`${(this.state.stakePool_2_Stats?.delegatorsReward_av / this.state.stakePool_2_Stats?.delegatorsStake * 100).toLocaleString("en-US", {maximumFractionDigits: 2})} %`}</div>
                                <div>{`${(this.state.stakePool_2_Stats?.delegatorsReward_upper / this.state.stakePool_2_Stats?.delegatorsStake * 100).toLocaleString("en-US", {maximumFractionDigits: 2})} %`}</div>
                              </div>
                              :
                              null
                        }

                      </div>





                      <div key="stake-pool-3" className={`flex flex-col bg-gray-700/5 p-4 rounded-xl border-2 ${this.state.stakePoolNSelected === 3 ? "border-blue-primary" : ""}`}
                           onClick={() => {
                             // this.setState({stakePoolNSelected: 1})

                             const poolBech32 = this.state.stakePool_3_Stats?.poolBech32
                             if (poolBech32 && this.state.stakePoolNSelected !== 3) {
                               this.setState({selectedPoolBech32: poolBech32, stakePoolNSelected: 3},
                                   () => this.updateSelectedPoolParams().then(() => {}))
                             }

                           }
                           }>

                        <div className="mb-4">
                          <p className="mb-2">Select a Pool Ticker #3:</p>
                          <StakePoolSelector stakePoolN={3} allStakePoolInfo={this.state.allStakePoolInfo} handlePoolSelect={this.handlePoolSelect}/>
                        </div>

                        <div className="grid gap-1 grid-cols-3 py-2 text-left border-t border-b border-gray-300">
                          <div className="col-span-2"><Cube size={14} className="mr-2"/> Blocks Minted</div>
                          <div className="text-center">{
                            this.state.stakePool_3_Stats?.lifetimeBlocks !== undefined
                                ?
                                (this.state.stakePool_3_Stats?.lifetimeBlocks).toLocaleString("en-US")
                                :
                                null
                          }</div>

                          <div className="col-span-2"><Calendar size={14} className="mr-2"/> Years Active</div>
                          <div className="text-center">{
                            this.state.stakePool_3_Stats?.yearsActive !== undefined
                                ?
                                (this.state.stakePool_3_Stats?.yearsActive).toLocaleString("en-US", {maximumFractionDigits: 1})
                                :
                                null
                          }</div>

                          <div className="col-span-2"><User size={14} className="mr-2"/> # Delegators</div>
                          <div className="text-center">{
                            this.state.stakePool_3_Stats?.nDelegators !== undefined
                                ?
                                (this.state.stakePool_3_Stats?.nDelegators).toLocaleString("en-US", {maximumFractionDigits: 0})
                                :
                                null

                          }</div>

                        </div>

                        <p className="mt-8"><SeriesAdd size={14} className="mr-2"/> Expected Return</p>
                        {
                          // Only show expected return if there is something to show
                          this.state.stakePool_3_Stats?.delegatorsReward_av
                              ?
                              <div className="grid gap-2 grid-cols-3 bg-gray-900/5 -ml-2 -mr-2 mt-1 py-4 px-2 text-center bg-blue-primary rounded-md">
                                <div className="font-medium">Lower</div>
                                <div className="font-medium">Average</div>
                                <div className="font-medium">Upper</div>
                                <div>{`${(this.state.stakePool_3_Stats?.delegatorsReward_lower / this.state.stakePool_3_Stats?.delegatorsStake * 100).toLocaleString("en-US", {maximumFractionDigits: 2})} %`}</div>
                                <div>{`${(this.state.stakePool_3_Stats?.delegatorsReward_av / this.state.stakePool_3_Stats?.delegatorsStake * 100).toLocaleString("en-US", {maximumFractionDigits: 2})} %`}</div>
                                <div>{`${(this.state.stakePool_3_Stats?.delegatorsReward_upper / this.state.stakePool_3_Stats?.delegatorsStake * 100).toLocaleString("en-US", {maximumFractionDigits: 2})} %`}</div>
                              </div>
                              :
                              null
                        }

                      </div>





                    </div>
                  </div>
                </div>

                {/* Row 2, Column 2 */}
                <div className="h-full border border-gray-300 shadow-md rounded-lg bg-white p-4">
                  {infoSections["info_section_2"][this.state.lang]}
                </div>

                {/* Row 3, Column 1 */}
                <div className="lg:col-span-2">
                  <div className={`${this.state.isUIStakeParamsShown ? "bg-white text-gray-900" : "bg-gray-900 text-white"} border border-gray-300 shadow-md rounded-lg p-8`}>
                    <div className="cursor-pointer" onClick={
                      () => this.setState({isUIStakeParamsShown: !this.state.isUIStakeParamsShown})
                    }>
                      <h4 className="flex items-center text-balance text-2xl font-medium tracking-tight">
                        <span id="icon" className="-mt-0.5 text-3xl font-normal mr-4">
                            {this.state.isUIStakeParamsShown ? "-" : "+"}
                        </span>
                        {uiText["stake_pool_parameters_section_title"][this.state.lang]}
                      </h4>

                      <div className="mt-2">
                        {uiText["stake_pool_parameters_section_desc"][this.state.lang]}
                      </div>

                    </div>

                    <div className={`${this.state.isUIStakeParamsShown ? "" : "hidden"} mt-8`}>


                      <div className="grid grid-cols-1 sm:grid-cols-6 gap-2 sm:mr-12">

                        <div className="col-span-2">Pool Pledge</div>
                        <div className="col-span-4">
                          <InputGroup
                              id="pool-pledge"
                              disabled={false}
                              leftIcon="plus"
                              onChange={this.handleChange}
                              onBlur={() => this.onFocusOut()}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") this.onFocusOut()
                              }}
                              value={this.state.poolPledge?.toLocaleString("en-US", {maximumFractionDigits: 0})}
                              fill={true}
                              rightElement={
                                <div className="flex flex-row content-center">
                                  <Tag minimal={true}>ada</Tag>
                                  <span className="mt-1.5 mr-1"><InfoHoverComponent>{infoHovers["pool_pledge"][this.state.lang]}</InfoHoverComponent></span>

                                </div>
                              }
                          />
                        </div>

                        <div className="col-span-2 mt-2 sm:mt-0">Delegators&apos; Stake</div>
                        <div className="col-span-4">
                          <InputGroup
                              id="delegators-stake"
                              disabled={true}
                              leftIcon="plus"
                              onChange={this.handleChange}
                              onBlur={() => this.onFocusOut()}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") this.onFocusOut()
                              }}
                              value={this.state.delegatorsStake?.toLocaleString("en-US", {maximumFractionDigits: 0})}
                              fill={true}
                              rightElement={
                                <div className="flex flex-row content-center">
                                  <Tag minimal={true}>ada</Tag>
                                  <span className="mt-1.5 mr-1"><InfoHoverComponent>{infoHovers["delegator_stake"][this.state.lang]}</InfoHoverComponent></span>
                                </div>
                              }
                          />
                        </div>

                        <div className="col-span-2 mt-2 sm:mt-0">Total Pool Stake</div>
                        <div className="col-span-4">
                          <InputGroup
                              id="total-pool-stake"
                              disabled={false}
                              leftIcon="equals"
                              onChange={this.handleChange}
                              onBlur={() => this.onFocusOut()}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") this.onFocusOut()
                              }}
                              value={this.state.poolStake_plus_userAmount?.toLocaleString("en-US", {maximumFractionDigits: 0})}
                              fill={true}
                              rightElement={
                                <div className="flex flex-row content-center">
                                  <Tag minimal={true}>ada</Tag>
                                  <span className="mt-1.5 mr-1"><InfoHoverComponent>{infoHovers["total_pool_stake"][this.state.lang]}</InfoHoverComponent></span>
                                </div>
                              }
                          />
                        </div>

                        <div className="col-span-2 mt-2 sm:mt-0">Pool Fixed Costs</div>
                        <div className="col-span-4">
                          <InputGroup
                              id="pool-fixed-costs"
                              disabled={false}
                              // leftIcon="filter"
                              onChange={this.handleChange}
                              onBlur={() => this.onFocusOut()}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") this.onFocusOut()
                              }}
                              value={this.state.poolFixedCost?.toLocaleString("en-US")}
                              fill={true}
                              rightElement={
                                <div className="flex flex-row content-center">
                                  <Tag minimal={true}>ada</Tag>
                                  <span className="mt-1.5 mr-1"><InfoHoverComponent>{infoHovers["pool_fixed_costs"][this.state.lang]}</InfoHoverComponent></span>
                                </div>
                              }
                          />
                        </div>

                        <div className="col-span-2 mt-2 sm:mt-0">Pool Variable Fee</div>
                        <div className="col-span-4">
                          <InputGroup
                              id="pool-variable-fee"
                              disabled={false}
                              asyncControl={true}
                              // leftIcon="filter"
                              onChange={this.handleChange}
                              onBlur={() => this.onFocusOut()}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") this.onFocusOut()
                              }}
                              value={(Math.round(this.state.poolVariableFee * 1_000_000) / 1_000_000).toLocaleString("en-US")}
                              fill={true}
                              rightElement={
                                <div className="flex flex-row content-center">
                                  <Tag minimal={true}>%</Tag>
                                  <span className="mt-1.5 mr-1"><InfoHoverComponent>{infoHovers["pool_variable_fee"][this.state.lang]}</InfoHoverComponent></span>
                                </div>
                              }
                          />
                        </div>

                      </div>

                    </div>

                  </div>
                </div>

                {/* Row 3, Column 2 */}
                <div className="border border-gray-300 shadow-md rounded-lg bg-white p-4">
                  {infoSections["info_section_3"][this.state.lang]}
                </div>

                {/* Row 4, Column 1 */}
                <div className="lg:col-span-2">
                  <div className={`${this.state.isUIBlockParamsShown ? "bg-white text-gray-900" : "bg-gray-900 text-white"} border border-gray-300 shadow-md rounded-lg p-8`}>
                    <div className="cursor-pointer" onClick={
                      () => this.setState({isUIBlockParamsShown: !this.state.isUIBlockParamsShown})
                    }>
                      <h4 className="flex text-balance items-center text-2xl font-medium tracking-tight">
                        <span id="icon" className="-mt-0.5 text-3xl font-normal mr-4">
                            {this.state.isUIBlockParamsShown ? "-" : "+"}
                        </span>
                        {uiText["blockchain_params_section_title"][this.state.lang]}
                      </h4>

                      <div className="mt-2">
                        {uiText["blockchain_params_section_desc"][this.state.lang]}
                      </div>

                    </div>



                    <div className={`${this.state.isUIBlockParamsShown ? "" : "hidden"} mt-8`}>


                      <div className="flex items-center cursor-pointer bg-gray-100 px-2 py-1 -mx-2 mt-8 mb-4 text-gray-900" onClick={
                        () => this.setState({isUIDynamicParamsShow: !this.state.isUIDynamicParamsShow})
                      }>
                        <span id="icon" className="font-normal text-gray-900 mr-4">
                            {this.state.isUIDynamicParamsShow ? "-" : "+"}
                        </span>
                        {uiText["dynamic_params_section_title"][this.state.lang]}
                      </div>

                      <div className={`${this.state.isUIDynamicParamsShow ? "" : "hidden"}`}>

                        <div className="mb-8">
                          {uiText["dynamic_params_section_desc"][this.state.lang]}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-6 gap-2 sm:mr-12">

                          <div className="col-span-2">Rho</div>
                          <div className="col-span-4">
                            <InputGroup
                                id="rho"
                                disabled={false}
                                asyncControl={true}
                                onChange={this.handleChange}
                                onBlur={() => this.onFocusOut()}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") this.onFocusOut()
                                }}
                                value={this.state.rho}
                                fill={true}
                                rightElement={
                                  <div className="flex flex-row content-center">
                                    <span className="mt-1.5 mr-1"><InfoHoverComponent>{infoHovers["rho"][this.state.lang]}</InfoHoverComponent></span>
                                  </div>
                                }
                            />
                          </div>

                          <div className="col-span-2 mt-2 sm:mt-0">Tau</div>
                          <div className="col-span-4">
                            <InputGroup
                                id="tau"
                                disabled={false}
                                asyncControl={true}
                                onChange={this.handleChange}
                                onBlur={() => this.onFocusOut()}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") this.onFocusOut()
                                }}
                                value={this.state.tau}
                                fill={true}
                                rightElement={
                                  <div className="flex flex-row content-center">
                                    <span className="mt-1.5 mr-1"><InfoHoverComponent>{infoHovers["tau"][this.state.lang]}</InfoHoverComponent></span>
                                  </div>
                                }
                            />
                          </div>

                          <div className="col-span-2 mt-2 sm:mt-0">K</div>
                          <div className="col-span-4">
                            <InputGroup
                                id="k"
                                disabled={false}
                                onChange={this.handleChange}
                                onBlur={() => this.onFocusOut()}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") this.onFocusOut()
                                }}
                                value={this.state.k}
                                fill={true}
                                rightElement={
                                  <div className="flex flex-row content-center">
                                    <span className="mt-1.5 mr-1"><InfoHoverComponent>{infoHovers["k"][this.state.lang]}</InfoHoverComponent></span>
                                  </div>
                                }
                            />
                          </div>

                          <div className="col-span-2 mt-2 sm:mt-0">a0</div>
                          <div className="col-span-4">
                            <InputGroup
                                id="a0"
                                disabled={false}
                                asyncControl={true}
                                onChange={this.handleChange}
                                onBlur={() => this.onFocusOut()}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") this.onFocusOut()
                                }}
                                value={this.state.a0}
                                fill={true}
                                rightElement={
                                  <div className="flex flex-row content-center">
                                    <span className="mt-1.5 mr-1"><InfoHoverComponent>{infoHovers["a0"][this.state.lang]}</InfoHoverComponent></span>
                                  </div>
                                }
                            />
                          </div>

                          <div className="col-span-2 mt-2 sm:mt-0">z0</div>
                          <div className="col-span-4">
                            <InputGroup
                                id="z0"
                                disabled={true}
                                // leftIcon="filter"
                                // onChange={this.handleChange}
                                value={this.state.z0}
                                fill={true}
                                rightElement={
                                  <div className="flex flex-row content-center">
                                    <span className="mt-1.5 mr-1"><InfoHoverComponent>{infoHovers["z0"][this.state.lang]}</InfoHoverComponent></span>
                                  </div>
                                }
                            />
                          </div>

                        </div>

                      </div>

                      <div className="flex items-center cursor-pointer bg-gray-100 px-2 py-1 -mx-2 mt-8 mb-4 text-gray-900" onClick={
                        () => this.setState({isUIStaticParamsShow: !this.state.isUIStaticParamsShow})
                      }>
                        <span id="icon" className="font-normal text-gray-900 mr-4">
                            {this.state.isUIStaticParamsShow ? "-" : "+"}
                        </span>
                        {uiText["static_params_section_title"][this.state.lang]}
                      </div>

                      <div className={`${this.state.isUIStaticParamsShow ? "" : "hidden"}`}>

                        <div className="mb-8">
                          {uiText["static_params_section_desc"][this.state.lang]}
                        </div>


                        <div className="grid grid-cols-1 sm:grid-cols-6 gap-2 sm:mr-12">

                          <div className="col-span-2">Days in an Epoch</div>
                          <div className="col-span-4">
                            <InputGroup
                                id="days-in-epoch"
                                disabled={true}
                                // onChange={this.handleChange}
                                value={this.state.daysInEpoch}
                                fill={true}
                                rightElement={
                                  <div className="flex flex-row content-center">
                                    <span className="mt-1.5 mr-1"><InfoHoverComponent>{infoHovers["days_in_epoch"][this.state.lang]}</InfoHoverComponent></span>
                                  </div>
                                }
                            />
                          </div>

                          <div className="col-span-2 mt-2 sm:mt-0">Epochs in a Year</div>
                          <div className="col-span-4">
                            <InputGroup
                                id="epochs-in-year"
                                disabled={true}
                                // onChange={this.handleChange}
                                value={this.state.epochsInYear}
                                fill={true}
                                rightElement={
                                  <div className="flex flex-row content-center">
                                    <span className="mt-1.5 mr-1"><InfoHoverComponent>{infoHovers["epochs_in_year"][this.state.lang]}</InfoHoverComponent></span>
                                  </div>
                                }
                            />
                          </div>

                          <div className="col-span-2 mt-2 sm:mt-0">Slots in an Epoch</div>
                          <div className="col-span-4">
                            <InputGroup
                                id="slots-in-epoch"
                                disabled={true}
                                // onChange={this.handleChange}
                                value={this.state.slotsInEpoch.toLocaleString("en-US")}
                                fill={true}
                                rightElement={
                                  <div className="flex flex-row content-center">
                                    <span className="mt-1.5 mr-1"><InfoHoverComponent>{infoHovers["slots_in_epoch"][this.state.lang]}</InfoHoverComponent></span>
                                  </div>
                                }
                            />
                          </div>

                          <div className="col-span-2 mt-2 sm:mt-0">Chain Density</div>
                          <div className="col-span-4">
                            <InputGroup
                                id="chain-density"
                                disabled={true}
                                // onChange={this.handleChange}
                                value={this.state.chainDensity}
                                fill={true}
                                rightElement={
                                  <div className="flex flex-row content-center">
                                    <span className="mt-1.5 mr-1"><InfoHoverComponent>{infoHovers["chain_density"][this.state.lang]}</InfoHoverComponent></span>
                                  </div>
                                }
                            />
                          </div>

                          <div className="col-span-2 mt-2 sm:mt-0">Blocks per Epoch</div>
                          <div className="col-span-4">
                            <InputGroup
                                id="blocks-per-epoch"
                                disabled={true}
                                // onChange={this.handleChange}
                                value={this.state.blocksPerEpoch.toLocaleString("en-US")}
                                fill={true}
                                rightElement={
                                  <div className="flex flex-row content-center">
                                    <span className="mt-1.5 mr-1"><InfoHoverComponent>{infoHovers["blocks_in_epoch"][this.state.lang]}</InfoHoverComponent></span>
                                  </div>
                                }
                            />
                          </div>

                          <div className="col-span-2 mt-2 sm:mt-0">Max Ada Supply</div>
                          <div className="col-span-4">
                            <InputGroup
                                id="max-ada-supply"
                                disabled={true}
                                // onChange={this.handleChange}
                                value={this.state.maxAdaSupply.toLocaleString("en-US", {maximumFractionDigits: 0})}
                                fill={true}
                                rightElement={
                                  <div className="flex flex-row content-center">
                                    <span className="mt-1.5 mr-1"><InfoHoverComponent>{infoHovers["max_ada_supply"][this.state.lang]}</InfoHoverComponent></span>
                                  </div>
                                }
                            />
                          </div>

                          <div className="col-span-2 mt-2 sm:mt-0">Current Ada Supply</div>
                          <div className="col-span-4">
                            <InputGroup
                                id="current-ada-supply"
                                disabled={false}
                                onChange={this.handleChange}
                                onBlur={() => this.onFocusOut()}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") this.onFocusOut()
                                }}
                                value={this.state.currentAdaSupply?.toLocaleString("en-US", {maximumFractionDigits: 0})}
                                fill={true}
                                rightElement={
                                  <div className="flex flex-row content-center">
                                    <span className="mt-1.5 mr-1"><InfoHoverComponent>{infoHovers["current_ada_supply"][this.state.lang]}</InfoHoverComponent></span>
                                  </div>
                                }
                            />
                          </div>

                          <div className="col-span-2 mt-2 sm:mt-0">Reserve Ada</div>
                          <div className="col-span-4">
                            <InputGroup
                                id="reserve-ada"
                                disabled={true}
                                // onChange={this.handleChange}
                                value={this.state.reserveAda?.toLocaleString("en-US", {maximumFractionDigits: 0})}
                                fill={true}
                                rightElement={
                                  <div className="flex flex-row content-center">
                                    <span className="mt-1.5 mr-1"><InfoHoverComponent>{infoHovers["reserve_ada"][this.state.lang]}</InfoHoverComponent></span>
                                  </div>
                                }
                            />
                          </div>

                          <div className="col-span-2 mt-2 sm:mt-0">Total Staked Ada</div>
                          <div className="col-span-4">
                            <InputGroup
                                id="total-staked-ada"
                                disabled={false}
                                onChange={this.handleChange}
                                onBlur={() => this.onFocusOut()}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") this.onFocusOut()
                                }}
                                value={this.state.totalAdaStaked?.toLocaleString("en-US", {maximumFractionDigits: 0})}
                                fill={true}
                                rightElement={
                                  <div className="flex flex-row content-center">
                                    <span className="mt-1.5 mr-1"><InfoHoverComponent>{infoHovers["total_staked_ada"][this.state.lang]}</InfoHoverComponent></span>
                                  </div>
                                }
                            />
                          </div>

                        </div>

                      </div>

                      <div className="flex items-center cursor-pointer bg-gray-100 px-2 py-1 -mx-2 mt-8 mb-4 text-gray-900" onClick={
                        () => this.setState({isUIFeesReservesShow: !this.state.isUIFeesReservesShow})
                      }>
                        <span id="icon" className="font-normal text-gray-900 mr-4">
                            {this.state.isUIFeesReservesShow ? "-" : "+"}
                        </span>
                        {uiText["fees_section_title"][this.state.lang]}
                      </div>

                      <div className={`${this.state.isUIFeesReservesShow ? "" : "hidden"}`}>

                        <div className="mb-8">
                          {uiText["fees_section_desc"][this.state.lang]}
                        </div>


                        <div className="grid grid-cols-1 sm:grid-cols-6 gap-2 sm:mr-12">

                          <div className="col-span-2">Fees per Epoch</div>
                          <div className="col-span-4">
                            <InputGroup
                                id="fees-in-epoch"
                                disabled={false}
                                leftIcon="plus"
                                onChange={this.handleChange}
                                onBlur={() => this.onFocusOut()}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") this.onFocusOut()
                                }}
                                value={this.state.feesInEpoch?.toLocaleString("en-US", {maximumFractionDigits: 0})}
                                fill={true}
                                rightElement={
                                  <div className="flex flex-row content-center">
                                    <span className="mt-1.5 mr-1"><InfoHoverComponent>{infoHovers["fees_in_epoch"][this.state.lang]}</InfoHoverComponent></span>
                                  </div>
                                }
                            />
                          </div>

                          <div className="col-span-2 mt-2 sm:mt-0">Distribution from Reserve</div>
                          <div className="col-span-4">
                            <InputGroup
                                id="distribution-from-reserve"
                                disabled={true}
                                leftIcon="plus"
                                // onChange={this.handleChange}
                                value={this.state.distributionFromReserve?.toLocaleString("en-US", {maximumFractionDigits: 0})}
                                fill={true}
                                rightElement={
                                  <div className="flex flex-row content-center">
                                    <span className="mt-1.5 mr-1"><InfoHoverComponent>{infoHovers["distribution_from_reserve"][this.state.lang]}</InfoHoverComponent></span>
                                  </div>
                                }
                            />
                          </div>

                          <div className="col-span-2 mt-2 sm:mt-0">Gross Reward</div>
                          <div className="col-span-4">
                            <InputGroup
                                id="equals"
                                disabled={true}
                                leftIcon="equals"
                                value={this.state.grossReward?.toLocaleString("en-US", {maximumFractionDigits: 0})}
                                fill={true}
                                rightElement={
                                  <div className="flex flex-row content-center">
                                    <span className="mt-1.5 mr-1"><InfoHoverComponent>{infoHovers["gross_rewards"][this.state.lang]}</InfoHoverComponent></span>
                                  </div>
                                }
                            />
                          </div>

                          <div className="col-span-2 mt-2 sm:mt-0">Distribution to Treasury</div>
                          <div className="col-span-4">
                            <InputGroup
                                id="distribution-to-treasury"
                                disabled={true}
                                leftIcon="minus"
                                value={this.state.distributionToTreasury?.toLocaleString("en-US", {maximumFractionDigits: 0})}
                                fill={true}
                                rightElement={
                                  <div className="flex flex-row content-center">
                                    <span className="mt-1.5 mr-1"><InfoHoverComponent>{infoHovers["distribution_to_treasury"][this.state.lang]}</InfoHoverComponent></span>
                                  </div>
                                }
                            />
                          </div>

                          <div className="col-span-2 mt-2 sm:mt-0">Net Rewards to Pools</div>
                          <div className="col-span-4">
                            <InputGroup
                                id="reward-to-pools"
                                disabled={true}
                                leftIcon="equals"
                                value={this.state.rewardToPoolOperators?.toLocaleString("en-US", {maximumFractionDigits: 0})}
                                fill={true}
                                rightElement={
                                  <div className="flex flex-row content-center">
                                    <span className="mt-1.5 mr-1"><InfoHoverComponent>{infoHovers["net_rewards_to_pools"][this.state.lang]}</InfoHoverComponent></span>
                                  </div>
                                }
                            />
                          </div>

                        </div>

                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 4, Column 2 */}
                <div className="border border-gray-300 shadow-md rounded-lg bg-white p-4">
                  {infoSections["info_section_4"][this.state.lang]}
                </div>
              </div>


              <VersionDisplay/>

            </div>

          </main>




        </div>

    )
  }

}

export default RewardCalculator;
