/**
 * This file holds a dictionary of explanation for each of the
 * calculator's fields. They are populated in the small "i"
 * icons next to fields in the calculator
 */

export const infoHovers = {

	"monte_carlo": [
		<div className="space-y-2">
			<h4 className="text-lg font-medium">Expected Return</h4>
			<p>Expected returs are shown as an average and tails of the distribution:</p>
			<ul className="list-disc pl-6 font-medium space-y-2">
				<li>Lower - 10th Percentile</li>
				<li>Average</li>
				<li>Upper - 90th Percentile</li>
			</ul>
			<p>Blocks are randomly assigned to stake
				pools at each epoch and there can be instances where a some
				pool gets more (or less) block in a year just from luck alone</p>
		</div>
		],



	"pool_pledge": [
		<div className="space-y-2">
			<h4 className="text-lg font-medium">Pool Pledge</h4>
			<p>The amount of ADA the stake pool operator commits to their own pool as a form of "skin in the game".</p>
			<ul className="list-disc pl-6 space-y-2">
				<li>Pools with higher pledges potentially earn slightly higher rewards through the "a0" parameter in the reward formula</li>
				<li>Higher pledges show higher monetary commitments from the pool operator</li>
			</ul>
		</div>
		],


	"delegator_stake": [
		<div className="space-y-2">
			<h4 className="text-lg font-medium">Delegators' Stake</h4>
			<p>The total amount of ADA that other users (delegators) have staked to this pool.</p>
			<ul className="list-disc pl-6 space-y-2">
				<li>The more ADA staked by delegators, the higher the pool’s likelihood of being selected to produce blocks and earning rewards.</li>
				<li>Pools with higher delegated stake tend to produce more blocks and generate more rewards, but this needs to be weighted aginst
				the fees that they charge</li>
			</ul>
		</div>
	],

	"total_pool_stake": [
		<div className="space-y-2">
			<h4 className="text-lg font-medium">Total Pool Stake</h4>
			<p>The combined amount of ADA in the pool, including the operator's pledge and the delegators' stake.
				This is the total ADA that the pool uses to participate in block production and earn rewards.</p>
			<p>Pools with higher stake will get to mint more blocks and receive more fees. These fees will need to be
			split between the pool operator and all the delegators.</p>
		</div>
	],

	"pool_fixed_costs": [
		<div className="space-y-2">
			<h4 className="text-lg font-medium">Pool Fixed Costs</h4>
			<p>A minimum fee that the stake pool operator deducts from the rewards each epoch for running the pool.This fee gets paid first,
			before any rewards are distributed to the delegators. The operator might use this to offset the fixed costs of maintaining the
			infrastructure (e.g. servers, networking, redundancies ...)</p>
			<p>If the pool does not produce any blocks during an epoch then there are no fees. In this case the delegators do not get charged and
			the next epoch starts afresh.</p>
		</div>
	],

	"pool_variable_fee": [
		<div className="space-y-2">
			<h4 className="text-lg font-medium">Pool Variable Fee</h4>
			<p>A percentage of the total rewards earned by the pool, that the operator takes as a fee.</p>
			<p>Delegators receive the remaining rewards after fixed costs and variable fees are deducted.
				Value shown as a percentage multiplied by 100</p>
		</div>
	],


	"rho": [
		<div className="space-y-2">
			<h4 className="text-lg font-medium">Rho - Monetary Expansion</h4>
			<p>A % of the Reserve that goes towards paying Staking Reward in each epoch (e.g. 0.003 is 0.3%)</p>
		</div>
	],

	"tau": [
		<div className="space-y-2">
			<h4 className="text-lg font-medium">Tau - Distribution to Treasury</h4>
			<p>A of the % Reward that goes towards Treasury in each epoch (e.g. 20%)</p>
		</div>
	],

	"k": [
		<div className="space-y-2">
			<h4 className="text-lg font-medium">K - Optimal Number of Pools</h4>
			<p>Optimal number of fully saturated pools (e.g. 500). This number determines the level of pool stake beyond
			which the staking reward starts to decrease. This limits how big a single pool can economically become.</p>
			<p>Given the relative ease with which it is to set-up new stake pools, this parameter rarely becomes a
			constraining factor</p>
		</div>
	],

	"a0": [
		<div className="space-y-2">
			<h4 className="text-lg font-medium">a0 - Pledge Influence Factor</h4>
			<p>Determines how much the size of a stake pool's pledge influences the rewards distribution.
				It serves as an incentive mechanism to encourage stake pool operators to pledge more ADA to their pools.</p>
		</div>
	],

	"z0": [
		<div className="space-y-2">
			<h4 className="text-lg font-medium">z0 - 1/a0</h4>
			<p>This is a transformation of the a0 parameter for the rewards formula</p>
		</div>
	],

	"days_in_epoch": [
		<div className="space-y-2">
			<h4 className="text-lg font-medium">Days in an Epoch</h4>
			<p>...</p>
		</div>
	],

	"epochs_in_year": [
		<div className="space-y-2">
			<h4 className="text-lg font-medium">Epochs in a Year</h4>
			<p>...</p>
		</div>
	],

	"slots_in_epoch": [
		<div className="space-y-2">
			<h4 className="text-lg font-medium">Slots in an Epoch</h4>
			<p>...</p>
		</div>
	],

	"chain_density": [
		<div className="space-y-2">
			<h4 className="text-lg font-medium">Chain Density</h4>
			<p>...</p>
		</div>
	],

	"blocks_in_epoch": [
		<div className="space-y-2">
			<h4 className="text-lg font-medium">Blocks in an Epoch</h4>
			<p>...</p>
		</div>
	],

	"max_ada_supply": [
		<div className="space-y-2">
			<h4 className="text-lg font-medium">Max Ada Supply</h4>
			<p>...</p>
		</div>
	],

	"current_ada_supply": [
		<div className="space-y-2">
			<h4 className="text-lg font-medium">Current Ada Supply</h4>
			<p>...</p>
		</div>
	],

	"reserve_ada": [
		<div className="space-y-2">
			<h4 className="text-lg font-medium">Reserve ADA</h4>
			<p>...</p>
		</div>
	],

	"total_staked_ada": [
		<div className="space-y-2">
			<h4 className="text-lg font-medium">Total Staked ADA</h4>
			<p>...</p>
		</div>
	],

	"fees_in_epoch": [
		<div className="space-y-2">
			<h4 className="text-lg font-medium">ADA Fees in an Epoch</h4>
			<p>...</p>
		</div>
	],

	"distribution_from_reserve": [
		<div className="space-y-2">
			<h4 className="text-lg font-medium">ADA Distributed from Reserve</h4>
			<p>A portion (rho) is distributed from Cardano Reserve to pay for Staking Rewards each Epoch. This number will reduce gradually over time
				as the amount in the Reserve gets depleted. To maintain the same level of staking rewards the rewards from Fees will need to rise.</p>
			<p>Change the Rho parameter to see how this affects the total reward to delegators</p>
		</div>
	],

	"gross_rewards": [
		<div className="space-y-2">
			<h4 className="text-lg font-medium">Gross Rewards</h4>
			<p>...</p>
		</div>
	],

	"distribution_to_treasury": [
		<div className="space-y-2">
			<h4 className="text-lg font-medium">Distribution to Treasury</h4>
			<p>....</p>
		</div>
	],

	"net_rewards_to_pools": [
		<div className="space-y-2">
			<h4 className="text-lg font-medium">Net Rewards to Pools</h4>
			<p>...</p>
		</div>
	],

	"staking_reward_per_year_ada": [
		<div className="space-y-2">
			<h4 className="text-lg font-medium">Staking Reward per Year ADA</h4>
			<p>Expected reward in ADA per year for the amount staked.</p>
			<p>Number in grey shows the result from the previous simulation, for comparability between simulations with different parameters</p>
		</div>
	],

	"staking_reward_annualized_perc": [
		<div className="space-y-2">
			<h4 className="text-lg font-medium">Annualized Staking Reward</h4>
			<p>Expected reward in % terms per year for the amount staked.</p>
			<p>Number in grey shows the result from the previous simulation, for comparability between simulations with different parameters</p>
		</div>
	],

}

/**
 * These are the info boxes placed next to the large sections of the calculator
 * - Amount of ADA to sake (section 1)
 * - Stake Pools (section 2)
 * - Stake Pool Parameters (section 3)
 * - Blockchain Parameters (section 4)
 */

export const infoSections = {

	"info_section_1": [
		<div className="space-y-2">
			<h4 className="text-md font-medium">Info</h4>
			<p>...</p>
		</div>
	],

	"info_section_2": [
		<div className="space-y-2">
			<h4 className="text-md font-medium">Info</h4>
			<p>...</p>
		</div>
	],

	"info_section_3": [
		<div className="space-y-2">
			<h4 className="text-md font-medium">Info</h4>
			<p>...</p>
		</div>
	],

	"info_section_4": [
		<div className="space-y-2">
			<h4 className="text-md font-medium">Info</h4>
			<p>...</p>
		</div>
	],

}
