/**
 * This file holds a dictionary of explanation for each of the
 * calculator's fields. They are populated in the small "i"
 * icons next to fields in the calculator
 */

export const uiText = {
	"amount_ada_to_stake": {
		"en": [
			<div key="amount_ada_to_stake_en">
				Amount of ada to Stake
			</div>
		],
		"jp": [
			<div key="amount_ada_to_stake_jp">
				ステークするADAの量
			</div>
		]
	} ,

	"amount_ada_to_stake_desc": {
		"en": [
			<div key="amount_ada_to_stake_desc_en">
				Input the amount of ada that you are looking to stake
			</div>
		],
		"jp": [
			<div key="amount_ada_to_stake_desc_jp">
				ステークしたいADAの金額を入力してください。
			</div>
		]
	} ,

	"loading_stake_pools_label": {
		"en": [
			<div key="loading_stake_pools_label_en">
				loading stake pools ...
			</div>
		],
		"jp": [
			<div key="loading_stake_pools_label_jp">
				ステークプールを読み込み中...
			</div>
		]
	} ,

	"staking_rewards_per_year_ada_label": {
		"en": [
			<div key="staking_rewards_per_year_ada_label_en">
				Staking Reward per Year Ada
			</div>
		],
		"jp": [
			<div key="staking_rewards_per_year_ada_label_jp">
				年間ステーキング報酬 ADA
			</div>
		]
	} ,

	"annualized_staking_reward_label": {
		"en": [
			<div key="annualized_staking_reward_label_en">
				Annualized Staking Reward
			</div>
		],
		"jp": [
			<div key="annualized_staking_reward_label_jp">
				年間ステーキング報酬
			</div>
		]
	} ,

	"stake_pool_section_title": {
		"en": [
			<div key="stake_pool_section_title_en">
				Staking Pools
			</div>
		],
		"jp": [
			<div key="stake_pool_section_title_jp">
				ステーキングプール
			</div>
		]
	} ,

	"stake_pool_section_desc": {
		"en": [
			<div key="stake_pool_section_desc_en">
				Compare up to 3 stake pools between themselves.
				Check how much Staking rewards is expected for the operator and the delegators (you).
				Uses a Monte Carlo simulation to account for luck and shows the expected Low,
				Medium and High reward for each pool.
			</div>
		],
		"jp": [
			<div key="stake_pool_section_desc_jp">
				最大3つのステークプールを比較できます。
				オペレーターおよびデリゲーター（あなた）のステーキング報酬の予測額を確認できます。
				モンテカルロシミュレーションを使用して運の要素を考慮し、それぞれのプールの予想される低・中・高の報酬を表示します。
			</div>
		]
	} ,

	"stake_pool_parameters_section_title": {
		"en": [
			<div key="stake_pool_parameters_section_title_en">
				Stake Pool Parameters
			</div>
		],
		"jp": [
			<div key="stake_pool_parameters_section_title_jp">
				ステークプールのパラメータ
			</div>
		]
	} ,

	"stake_pool_parameters_section_desc": {
		"en": [
			<div key="stake_pool_parameters_section_desc_en">
				These parameters are specific to each stake pool and influence
				how the rewards are distributed between
				the operator of the pool and the delegators, and also how many blocks
				the pool is expected to mint each epoch. Expand to change
				these parameters and see impact on rewards
			</div>
		],
		"jp": [
			<div key="stake_pool_parameters_section_desc_jp">
				これらのパラメーターは各ステークプールに固有のものであり、プールの運営者とデリゲーター
				（委任者）の間で報酬がどのように分配されるか、また各エポックでプールがどれだけのブロックを生成するかに影響を与えます。
				パラメーターを変更して、報酬への影響を確認してください。
			</div>
		]
	} ,


	"blockchain_params_section_title": {
		"en": [
			<div key="blockchain_params_section_title_en">
				Blockchain Parameters
			</div>
		],
		"jp": [
			<div key="blockchain_params_section_title_jp">
				ブロックチェーンパラメーター
			</div>
		]
	} ,

	"blockchain_params_section_desc": {
		"en": [
			<div key="blockchain_params_section_desc_en">
				These parameters are specific to the Cardano blockchain and affect the total
				size of reward &quot;pot&quot; available
				for distribution and how it is distributed to different pools.
				Some parameters can be changed with a community vote (Dynamic Parameters)
				and some can&apos;t be changed at all (Static Parameters)
			</div>
		],
		"jp": [
			<div key="blockchain_params_section_desc_jp">
				これらのパラメーターはCardanoブロックチェーンに特有のものであり、配布可能な報酬の「ポット」
				の総額や、それが異なるプールにどのように分配されるかに影響を与えます。
				一部のパラメーターはコミュニティの投票によって変更可能（ダイナミックパラメーター）
				ですが、一部のパラメーターは全く変更できません（スタティックパラメーター）
			</div>
		]
	} ,

	"dynamic_params_section_title": {
		"en": [
			<div key="dynamic_params_section_title_en">
				Dynamic Parameters
			</div>
		],
		"jp": [
			<div key="dynamic_params_section_title_jp">
				動的パラメーター
			</div>
		]
	} ,

	"dynamic_params_section_desc": {
		"en": [
			<div key="dynamic_params_section_desc_en">
				Dynamic blockchain parameters can be adjusted through governance processes.
				These parameters can be used to change the operation of the block-producing protocol,
				vary transaction fees, define the influence of pledge, etc.
				Press the (i) icon to see what each one is responsible for.
			</div>
		],
		"jp": [
			<div key="dynamic_params_section_desc_jp">
				動的なブロックチェーンパラメーターは、ガバナンスプロセスを通じて調整できます。
				これらのパラメーターは、ブロック生成プロトコルの動作を変更したり、取引手数料を調整したり、
				ステークの影響度を定義したりするために使用できます。
				各パラメーターの役割を確認するには、(i) アイコンを押してください。
			</div>
		]
	} ,

	"static_params_section_title": {
		"en": [
			<div key="static_params_section_title_en">
				Static Parameters
			</div>
		],
		"jp": [
			<div key="static_params_section_title_jp">
				静的パラメーター
			</div>
		]
	} ,

	"static_params_section_desc": {
		"en": [
			<div key="static_params_section_desc_en">
				Static parameters affect the fundamentals of the Cardano protocol and are stable,
				which means that they can not be changed except via a hard fork.
				Static parameters include those defining the genesis block or basic security properties, for example.
				Some of these parameters may be embedded in the source code or implemented as software.
			</div>
		],
		"jp": [
			<div key="static_params_section_desc_jp">
				静的パラメータはCardanoプロトコルの基本に影響を与え、安定しており、ハードフォークを通じてのみ変更可能です。
				静的パラメータには、ジェネシスブロックや基本的なセキュリティ特性を定義するものが含まれます。
				これらのパラメータのいくつかは、ソースコードに埋め込まれているか、ソフトウェアとして実装されています。
			</div>
		]
	} ,

	"fees_section_title": {
		"en": [
			<div key="fees_section_title_en">
				Fees & Remaining Reserves
			</div>
		],
		"jp": [
			<div key="fees_section_title_jp">
				料金と残りの予備
			</div>
		]
	} ,

	"fees_section_desc": {
		"en": [
			<div key="fees_section_desc_en">
				Cardano uses a transaction fee system that covers the processing
				and long-term storage cost of transactions. Fees from each epoch are pooled and then
				distributed to all pools that created blocks during an epoch. The fees are supplemented
				by a distribution of a % (rho) from reserves.
			</div>
		],
		"jp": [
			<div key="fees_section_desc_jp">
				カルダノは、取引の処理および長期保存費用をカバーする取引手数料システムを使用しています。
				各エポックの手数料はプールされ、その後、エポック中にブロックを作成したすべてのプールに分配されます。
				手数料は、準備金からの一定の割合（ρ）の分配によって補完されます。
			</div>
		]
	} ,


}


export const infoHovers = {

	"monte_carlo": {
		"en": [
			<div key="monte_carlo_en" className="space-y-2">
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
		"jp": [
			<div key="monte_carlo_jp" className="space-y-2">
				<h4 className="text-lg font-medium">期待リターン</h4>
				<p>期待されるリターンは、分布の平均値と尾部（裾）で表示されます。</p>
				<ul className="list-disc pl-6 font-medium space-y-2">
					<li>下位 - 10 パーセンタイル</li>
					<li>平均</li>
					<li>上位 - 90 パーセンタイル</li>
				</ul>
				<p>
					ブロックはエポックごとにランダムにステーキングプールへ割り当てられ、
					運次第で一部のプールは1年間に多く（あるいは少なく）の
					ブロックを獲得することがあります。</p>
			</div>
		]
	} ,



	"pool_pledge": {
		"en": [
			<div key="pool_pledge_en" className="space-y-2">
				<h4 className="text-lg font-medium">Pool Pledge</h4>
				<p>The amount of ada the stake pool operator commits to their own pool as a form of &quot;skin in the game&quot;.</p>
				<ul className="list-disc pl-6 space-y-2">
					<li>Pools with higher pledges potentially earn slightly higher rewards through the &quot;a0&quot; parameter in the reward formula</li>
					<li>Higher pledges show higher monetary commitments from the pool operator</li>
				</ul>
			</div>
		],
		"jp": [
			<div key="pool_pledge_jp" className="space-y-2">
				<h4 className="text-lg font-medium">プール誓約 (Pool Pledge)</h4>
				<p>ステークプール運営者が自身のプールに対してコミットするADAの量であり、これは「自己出資額」としての役割を果たします</p>
				<ul className="list-disc pl-6 space-y-2">
					<li>誓約額が高いプールは、報酬計算式の「a0」パラメータによって、やや高い報酬を得る可能性があります。</li>
					<li>高い誓約額は、プール運営者の強い資金的コミットメントを示します。</li>
				</ul>
			</div>
		],
	},


	"delegator_stake": {
		"en": [
			<div key="delegator_stake_en" className="space-y-2">
				<h4 className="text-lg font-medium">Delegators&apos; Stake</h4>
				<p>The total amount of ada that other users (delegators) have staked to this pool.</p>
				<ul className="list-disc pl-6 space-y-2">
					<li>The more ada staked by delegators, the higher the pool’s likelihood of being selected to produce blocks and earning rewards.</li>
					<li>Pools with higher delegated stake tend to produce more blocks and generate more rewards, but this needs to be weighted aginst
						the fees that they charge</li>
				</ul>
			</div>
		],
		"jp": [
			<div key="delegator_stake_jp" className="space-y-2">
				<h4 className="text-lg font-medium">委任者のステーク (Delegators&apos; Stake)</h4>
				<p>他のユーザー（委任者）がこのプールにステークしたADAの総額。</p>
				<ul className="list-disc pl-6 space-y-2">
					<li>委任者によってステークされるADAが多いほど、プールがブロック生成に選ばれ、報酬を獲得する可能性が高くなります。</li>
					<li>より多くのステークを集めたプールは、より多くのブロックを生成し、より多くの報酬を生み出す傾向がありますが、運営手数料とのバランスを考慮する必要があります。</li>
				</ul>
			</div>
		]
	} ,

	"total_pool_stake": {
		"en": [
			<div key="total_pool_stake_en" className="space-y-2">
				<h4 className="text-lg font-medium">Total Pool Stake</h4>
				<p>The combined amount of ada in the pool, including the operator&apos;s pledge and the delegators&apos; stake.
					This is the total ada that the pool uses to participate in block production and earn rewards.</p>
				<p>Pools with higher stake will get to mint more blocks and receive more fees. These fees will need to be
					split between the pool operator and all the delegators.</p>
			</div>
		],
		"jp": [
			<div key="total_pool_stake_jp" className="space-y-2">
				<h4 className="text-lg font-medium">総プールステーク (Total Pool Stake)</h4>
				<p>
					プール内のADAの合計額であり、運営者の誓約と委任者のステークを含みます。
					これは、プールがブロック生成に参加し、報酬を獲得するために使用する総ADA量です。
				</p>
				<p>
					ステークが多いプールは、より多くのブロックを生成し、より多くの手数料を獲得できます。
					これらの手数料は、プール運営者とすべての委任者で分配されます。
				</p>
			</div>
		]
	} ,

	"pool_fixed_costs": {
		"en": [
			<div key="pool_fixed_costs_en" className="space-y-2">
				<h4 className="text-lg font-medium">Pool Fixed Costs</h4>
				<p>A minimum fee that the stake pool operator deducts from the rewards each epoch for running the pool.This fee gets paid first,
					before any rewards are distributed to the delegators. The operator might use this to offset the fixed costs of maintaining the
					infrastructure (e.g. servers, networking, redundancies ...)</p>
				<p>If the pool does not produce any blocks during an epoch then there are no fees. In this case the delegators do not get charged and
					the next epoch starts afresh.</p>
			</div>
		],
		"jp": [
			<div key="pool_fixed_costs_jp" className="space-y-2">
				<h4 className="text-lg font-medium">プール固定費 (Pool Fixed Costs)</h4>
				<p>
					ステークプール運営者が、プール運営のために各エポックの報酬から差し引く最低手数料です。
					この手数料は最初に差し引かれ、その後に報酬が委任者へ分配されます。
					運営者は、この手数料をインフラ維持のための固定費（例: サーバー、ネットワーク、冗長化 など）に充てる場合があります。
				</p>
				<p>
					もしプールがエポック内でブロックを生成しなかった場合、手数料は発生しません。
					この場合、委任者に対する課金もなく、次のエポックが新たに開始されます。
				</p>
			</div>
		]
	} ,

	"pool_variable_fee": {
		"en": [
			<div key="pool_variable_fee_en" className="space-y-2">
				<h4 className="text-lg font-medium">Pool Variable Fee</h4>
				<p>A percentage of the total rewards earned by the pool, that the operator takes as a fee.</p>
				<p>Delegators receive the remaining rewards after fixed costs and variable fees are deducted.
					Value shown as a percentage multiplied by 100</p>
			</div>
		],
		"jp": [
			<div key="pool_variable_fee_jp" className="space-y-2">
				<h4 className="text-lg font-medium">プール変動手数料 (Pool Variable Fee)</h4>
				<p>プールが獲得した総報酬のうち、運営者が手数料として受け取る割合です。</p>
				<p>
					固定費と変動手数料が差し引かれた後、残りの報酬が委任者に分配されます。
					値はパーセンテージ（100倍された値）で表示されます。
				</p>
			</div>
		]
	} ,


	"rho": {
		"en": [
			<div key="rho_en" className="space-y-2">
				<h4 className="text-lg font-medium">Rho - Monetary Expansion</h4>
				<p>A % of the Reserve that goes towards paying Staking Reward in each epoch (e.g. 0.003 is 0.3%)</p>
			</div>
		],
		"jp": [
			<div key="rho_jp" className="space-y-2">
				<h4 className="text-lg font-medium">ρ（ロー）- 通貨供給拡大 (Monetary Expansion)</h4>
				<p>各エポックでステーキング報酬の支払いに充てられるリザーブの割合（例: 0.003 は 0.3%）。</p>
			</div>
		]
	} ,

	"tau": {
		"en": [
			<div key="tau_en" className="space-y-2">
				<h4 className="text-lg font-medium">Tau - Distribution to Treasury</h4>
				<p>A of the % Reward that goes towards Treasury in each epoch (e.g. 20%)</p>
			</div>
		],
		"jp": [
			<div key="tau_jp" className="space-y-2">
				<h4 className="text-lg font-medium">τ（タウ）- トレジャリーへの分配 (Distribution to Treasury)</h4>
				<p>各エポックでトレジャリーに割り当てられる報酬の割合（例: 20%）。</p>
			</div>
		]
	} ,

	"k": {
		"en": [
			<div key="k_en" className="space-y-2">
				<h4 className="text-lg font-medium">K - Optimal Number of Pools</h4>
				<p>Optimal number of fully saturated pools (e.g. 500). This number determines the level of pool stake beyond
					which the staking reward starts to decrease. This limits how big a single pool can economically become.</p>
				<p>Given the relative ease with which it is to set-up new stake pools, this parameter rarely becomes a
					constraining factor</p>
			</div>
		],
		"jp": [
			<div key="k_jp" className="space-y-2">
				<h4 className="text-lg font-medium">K - 最適プール数 (Optimal Number of Pools)</h4>
				<p>
					完全に飽和したプールの最適な数（例: 500）。この数値は、ステーキング報酬が減少し始めるプールステークの上限を決定します。
					これにより、単一のプールが経済的にどれほど大きくなるかが制限されます。
				</p>
				<p>
					新しいステークプールを設定するのが比較的簡単なため、このパラメータが制約要因になることは稀です。
				</p>
			</div>
		]
	} ,

	"a0": {
		"en": [
			<div key="a0_en" className="space-y-2">
				<h4 className="text-lg font-medium">a0 - Pledge Influence Factor</h4>
				<p>Determines how much the size of a stake pool&apos;s pledge influences the rewards distribution.
					It serves as an incentive mechanism to encourage stake pool operators to pledge more ada to their pools.</p>
			</div>
		],
		"jp": [
			<div key="a0_jp" className="space-y-2">
				<h4 className="text-lg font-medium">a0 - 誓約影響係数 (Pledge Influence Factor)</h4>
				<p>
					ステークプールの誓約の大きさが報酬分配にどれほど影響するかを決定します。
					これは、ステークプール運営者が自分のプールにもっとADAを誓約するよう促すインセンティブ機構として機能します。
				</p>
			</div>
		]
	} ,

	"z0": {
		"en": [
			<div key="z0_en" className="space-y-2">
				<h4 className="text-lg font-medium">z0 - 1/a0</h4>
				<p>This is a transformation of the a0 parameter for the rewards formula</p>
			</div>
		],
		"jp": [
			<div key="z0_jp" className="space-y-2">
				<h4 className="text-lg font-medium">z0 - 1/a0</h4>
				<p>これは報酬計算式のためにa0パラメータを変換したものです。</p>
			</div>
		]
	} ,

	"days_in_epoch": {
		"en": [
			<div key="days_in_epoch_en" className="space-y-2">
				<h4 className="text-lg font-medium">Days in an Epoch</h4>
				<p>...</p>
			</div>
		],
		"jp": [
			<div key="days_in_epoch_jp" className="space-y-2">
				<h4 className="text-lg font-medium">エポックの日数 (Days in an Epoch)</h4>
				<p>...</p>
			</div>
		]
	} ,

	"epochs_in_year": {
		"en": [
			<div key="epochs_in_year_en" className="space-y-2">
				<h4 className="text-lg font-medium">Epochs in a Year</h4>
				<p>...</p>
			</div>
		],
		"jp": [
			<div key="epochs_in_year_jp" className="space-y-2">
				<h4 className="text-lg font-medium">1年あたりのエポック数 (Epochs in a Year)</h4>
				<p>...</p>
			</div>
		]
	} ,

	"slots_in_epoch": {
		"en": [
			<div key="slots_in_epoch_en" className="space-y-2">
				<h4 className="text-lg font-medium">Slots in an Epoch</h4>
				<p>...</p>
			</div>
		],
		"jp": [
			<div key="slots_in_epoch_jp" className="space-y-2">
				<h4 className="text-lg font-medium">エポック内のスロット数 (Slots in an Epoch)</h4>
				<p>...</p>
			</div>
		]
	} ,

	"chain_density": {
		"en": [
			<div key="chain_density_en" className="space-y-2">
				<h4 className="text-lg font-medium">Chain Density</h4>
				<p>...</p>
			</div>
		],
		"jp": [
			<div key="chain_density_jp" className="space-y-2">
				<h4 className="text-lg font-medium">チェーン密度 (Chain Density)</h4>
				<p>...</p>
			</div>
		]
	} ,

	"blocks_in_epoch": {
		"en": [
			<div key="blocks_in_epoch_en" className="space-y-2">
				<h4 className="text-lg font-medium">Blocks in an Epoch</h4>
				<p>...</p>
			</div>
		],
		"jp": [
			<div key="blocks_in_epoch_jp" className="space-y-2">
				<h4 className="text-lg font-medium">エポック内のブロック数 (Blocks in an Epoch)</h4>
				<p>...</p>
			</div>
		]
	} ,

	"max_ada_supply": {
		"en": [
			<div key="max_ada_supply_en" className="space-y-2">
				<h4 className="text-lg font-medium">Max Ada Supply</h4>
				<p>...</p>
			</div>
		],
		"jp": [
			<div key="max_ada_supply_jp" className="space-y-2">
				<h4 className="text-lg font-medium">最大ADA供給量 (Max Ada Supply)</h4>
				<p>...</p>
			</div>
		]
	} ,

	"current_ada_supply": {
		"en": [
			<div key="current_ada_supply_en" className="space-y-2">
				<h4 className="text-lg font-medium">Current Ada Supply</h4>
				<p>...</p>
			</div>
		],
		"jp": [
			<div key="current_ada_supply_jp" className="space-y-2">
				<h4 className="text-lg font-medium">現在のADA供給量 (Current Ada Supply)</h4>
				<p>...</p>
			</div>
		]
	} ,

	"reserve_ada": {
		"en": [
			<div key="reserve_ada_en" className="space-y-2">
				<h4 className="text-lg font-medium">Reserve Ada</h4>
				<p>...</p>
			</div>
		],
		"jp": [
			<div key="reserve_ada_jp" className="space-y-2">
				<h4 className="text-lg font-medium">リザーブADA (Reserve ADA)</h4>
				<p>...</p>
			</div>
		]
	} ,

	"total_staked_ada": {
		"en": [
			<div key="total_staked_ada_en" className="space-y-2">
				<h4 className="text-lg font-medium">Total Staked Ada</h4>
				<p>...</p>
			</div>
		],
		"jp": [
			<div key="total_staked_ada_jp" className="space-y-2">
				<h4 className="text-lg font-medium">総ステークADA (Total Staked ADA)</h4>
				<p>...</p>
			</div>
		]
	} ,

	"fees_in_epoch": {
		"en": [
			<div key="fees_in_epoch_en" className="space-y-2">
				<h4 className="text-lg font-medium">Ada Fees in an Epoch</h4>
				<p>...</p>
			</div>
		],
		"jp": [
			<div key="fees_in_epoch_jp" className="space-y-2">
				<h4 className="text-lg font-medium">エポック内のADA手数料 (ADA Fees in an Epoch)</h4>
				<p>...</p>
			</div>
		]
	} ,

	"distribution_from_reserve": {
		"en": [
			<div key="distribution_from_reserve_en" className="space-y-2">
				<h4 className="text-lg font-medium">Ada Distributed from Reserve</h4>
				<p>A portion (rho) is distributed from Cardano Reserve to pay for Staking Rewards each Epoch. This number will reduce gradually over time
					as the amount in the Reserve gets depleted. To maintain the same level of staking rewards the rewards from Fees will need to rise.</p>
				<p>Change the Rho parameter to see how this affects the total reward to delegators</p>
			</div>
		],
		"jp": [
			<div key="distribution_from_reserve_jp" className="space-y-2">
				<h4 className="text-lg font-medium">リザーブから分配されるADA (ADA Distributed from Reserve)</h4>
				<p>
					各エポックごとにカルダノリザーブから一定割合（ρ）がステーキング報酬の支払いに充てられます。
					リザーブの残高が減少するにつれ、この割合も徐々に減少します。
					ステーキング報酬を維持するためには、手数料からの報酬を増やす必要があります。
				</p>
				<p>
					Rhoパラメータを変更して、これが委任者への総報酬にどのように影響するかを確認してください。
				</p>
			</div>
		]
	} ,

	"gross_rewards": {
		"en": [
			<div key="gross_rewards_en" className="space-y-2">
				<h4 className="text-lg font-medium">Gross Rewards</h4>
				<p>...</p>
			</div>
		],
		"jp": [
			<div key="gross_rewards_jp" className="space-y-2">
				<h4 className="text-lg font-medium">総報酬 (Gross Rewards)</h4>
				<p>...</p>
			</div>
		]
	} ,

	"distribution_to_treasury": {
		"en": [
			<div key="distribution_to_treasury_en" className="space-y-2">
				<h4 className="text-lg font-medium">Distribution to Treasury</h4>
				<p>....</p>
			</div>
		],
		"jp": [
			<div key="distribution_to_treasury_jp" className="space-y-2">
				<h4 className="text-lg font-medium">トレジャリーへの分配 (Distribution to Treasury)</h4>
				<p>....</p>
			</div>
		]
	} ,

	"net_rewards_to_pools": {
		"en": [
			<div key="net_rewards_to_pools_en" className="space-y-2">
				<h4 className="text-lg font-medium">Net Rewards to Pools</h4>
				<p>...</p>
			</div>
		],
		"jp": [
			<div key="net_rewards_to_pools_jp" className="space-y-2">
				<h4 className="text-lg font-medium">プールへの純報酬 (Net Rewards to Pools)</h4>
				<p>...</p>
			</div>
		]
	} ,

	"staking_reward_per_year_ada": {
		"en": [
			<div key="staking_reward_per_year_ada_en" className="space-y-2">
				<h4 className="text-lg font-medium">Staking Reward per Year ADA</h4>
				<p>Expected reward in ADA per year for the amount staked.</p>
				<p>Number in grey shows the result from the previous simulation, for comparability between simulations with different parameters</p>
			</div>
		],
		"jp": [
			<div key="staking_reward_per_year_ada_jp" className="space-y-2">
				<h4 className="text-lg font-medium">年間ステーキング報酬 ADA (Staking Reward per Year ADA)</h4>
				<p>ステークされた量に対する年間予想報酬（ADA）。</p>
				<p>灰色の数字は、異なるパラメータでのシミュレーション間で比較できるように、前回のシミュレーション結果を示しています。</p>
			</div>
		]
	} ,

	"staking_reward_annualized_perc": {
		"en": [
			<div key="staking_reward_annualized_perc_en" className="space-y-2">
				<h4 className="text-lg font-medium">Annualized Staking Reward</h4>
				<p>Expected reward in % terms per year for the amount staked.</p>
				<p>Number in grey shows the result from the previous simulation, for comparability between simulations with different parameters</p>
			</div>
		],
		"jp": [
			<div key="staking_reward_annualized_perc_jp" className="space-y-2">
				<h4 className="text-lg font-medium">年間のステーキング報酬 (Annualized Staking Reward)</h4>
				<p>ステークされた量に対する年間予想報酬（%で表示）。</p>
				<p>灰色の数字は、異なるパラメータでのシミュレーション間で比較できるように、前回のシミュレーション結果を示しています。</p>
			</div>
		]
	} ,

}

/**
 * These are the info boxes placed next to the large sections of the calculator
 * - Amount of ada to sake (section 1)
 * - Stake Pools (section 2)
 * - Stake Pool Parameters (section 3)
 * - Blockchain Parameters (section 4)
 */

export const infoSections = {

	"info_section_1": {
		"en": [
			<div key="info_section_1_en" className="space-y-2">
				<h4 className="text-md font-medium">Info</h4>
				<p>You can delegate your ADA to a staking pool and automatically and regularly receive rewards for doing so. </p>
				<p>This calculator is based on a Monte Carlo simulation and real-time data from the Cardano mainnet. 
				<p>You can set arbitrary values, select real existing staking pools or set virtual values yourself.
				<p>Learn more about <a href="https://cardano.org/stake-pool-delegation/" target="_blank">Proof of Stake delegations of your ada</a> and <a href="https://cardano.org/stake-pool-operation" target="_blank">Operating a staking pool</a>.</p>
			</div>
		],
		"jp": [
			<div key="info_section_1_jp" className="space-y-2">
				<h4 className="text-md font-medium">情報 (じょうほう, jōhō)</h4>
				<p>ADAをステーキングプールに委任し、自動的に定期的に報酬を受け取ることができます。</p>
				<p>この計算機は、モンテカルロシミュレーションとCardanoメインネットからのリアルタイムデータに基づいています。</p>
				<p>任意の値を設定したり、実在する既存のステーキングプールを選択したり、仮想値を自分で設定することができます。</p>
				<p>あなたの<a href="https://cardano.org/stake-pool-delegation/" target="_blank">adaのプルーフオブステークの委任</a>と<a href="https://cardano.org/stake-pool-operation" target="_blank">ステーキングプールの運営</a>の詳細については、こちらをご覧ください。</p>
			</div>
		]
	} ,

	"info_section_2": {
		"en": [
			<div key="info_section_2_en" className="space-y-2">
				<h4 className="text-md font-medium">Info</h4>
				<p>...</p>
			</div>
		],
		"jp": [
			<div key="info_section_2_jp" className="space-y-2">
				<h4 className="text-md font-medium">情報 (じょうほう, jōhō)</h4>
				<p>...</p>
			</div>
		]
	} ,

	"info_section_3": {
		"en": [
			<div key="info_section_3_en" className="space-y-2">
				<h4 className="text-md font-medium">Info</h4>
				<p>...</p>
			</div>
		],
		"jp": [
			<div key="info_section_3_jp" className="space-y-2">
				<h4 className="text-md font-medium">情報 (じょうほう, jōhō)</h4>
				<p>...</p>
			</div>
		]
	} ,

	"info_section_4": {
		"en": [
			<div key="info_section_4_en" className="space-y-2">
				<h4 className="text-md font-medium">Info</h4>
				<p>...</p>
			</div>
		],
		"jp": [
			<div key="info_section_4_jp" className="space-y-2">
				<h4 className="text-md font-medium">情報 (じょうほう, jōhō)</h4>
				<p>...</p>
			</div>
		]
	} ,

}
