export interface Course {
  id: number
  title: string
  description: string
  level: string
  duration: string
  students: number
  rating: number
  price: number
  image: string
  tier: 'free' | 'pro' | 'premium'
  instructor: string
  content: string[]
  weeks: { title: string; lessons: string[] }[]
}

export const courses: Course[] = [
  {
    id: 1,
    title: 'Crypto Fundamentals',
    description: 'Learn the basics of blockchain, Bitcoin, and Ethereum',
    level: 'Beginner',
    duration: '4 weeks',
    students: 2500,
    rating: 4.8,
    price: 0,
    image: '🔷',
    tier: 'free',
    instructor: 'Sarah Chen',
    content: [
      'Introduction to blockchain technology',
      'Understanding Bitcoin and mining',
      'Ethereum and smart contracts basics',
      'Cryptocurrency wallets and security',
      'Market fundamentals and economics',
    ],
    weeks: [
      {
        title: 'Blockchain Basics',
        lessons: [
          'What is blockchain?',
          'Distributed ledgers explained',
          'Consensus mechanisms',
          'Quiz & Assessment',
        ],
      },
      {
        title: 'Bitcoin Deep Dive',
        lessons: [
          'History of Bitcoin',
          'Mining and proof-of-work',
          'The halving cycle',
          'Quiz & Assessment',
        ],
      },
      {
        title: 'Ethereum & Smart Contracts',
        lessons: [
          'How Ethereum works',
          'Writing your first smart contract',
          'ERC-20 tokens',
          'Quiz & Assessment',
        ],
      },
      {
        title: 'Security & Wallets',
        lessons: [
          'Hot vs cold wallets',
          'Private keys and seed phrases',
          'Best security practices',
          'Final Project',
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Technical Analysis Mastery',
    description: 'Master chart patterns, indicators, and trading strategies',
    level: 'Intermediate',
    duration: '6 weeks',
    students: 1800,
    rating: 4.9,
    price: 49,
    image: '📈',
    tier: 'pro',
    instructor: 'Mike Thompson',
    content: [
      'Candlestick patterns and chart reading',
      'Moving averages and trend analysis',
      'Support and resistance levels',
      'RSI, MACD, and other indicators',
      'Building a complete trading strategy',
    ],
    weeks: [
      {
        title: 'Chart Foundations',
        lessons: [
          'Reading price charts',
          'Candlestick patterns',
          'Volume analysis',
          'Quiz & Assessment',
        ],
      },
      {
        title: 'Trend Analysis',
        lessons: [
          'Identifying trends',
          'Moving averages (SMA & EMA)',
          'Trend channels',
          'Quiz & Assessment',
        ],
      },
      {
        title: 'Support & Resistance',
        lessons: [
          'Key price levels',
          'Breakouts and retests',
          'Fibonacci retracements',
          'Quiz & Assessment',
        ],
      },
      {
        title: 'Indicators Deep Dive',
        lessons: [
          'RSI and overbought/oversold signals',
          'MACD divergence',
          'Bollinger Bands',
          'Quiz & Assessment',
        ],
      },
      {
        title: 'Strategy Building',
        lessons: [
          'Entry and exit rules',
          'Risk/reward ratios',
          'Backtesting strategies',
          'Quiz & Assessment',
        ],
      },
      {
        title: 'Live Trading Practice',
        lessons: [
          'Paper trading setup',
          'Journaling trades',
          'Refining your edge',
          'Final Project',
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'DeFi & Smart Contracts',
    description: 'Understand decentralized finance and smart contract development',
    level: 'Advanced',
    duration: '8 weeks',
    students: 950,
    rating: 4.7,
    price: 99,
    image: '⚙️',
    tier: 'premium',
    instructor: 'Alex Rivera',
    content: [
      'DeFi protocols: AMMs, lending, yield farming',
      'Solidity smart contract development',
      'Security auditing and common vulnerabilities',
      'Building and deploying your own DeFi protocol',
      'MEV, gas optimization, and L2 scaling',
    ],
    weeks: [
      {
        title: 'DeFi Landscape',
        lessons: [
          'What is DeFi?',
          'Key protocol overview',
          'Wallets and gas fees',
          'Quiz & Assessment',
        ],
      },
      {
        title: 'AMMs & DEXes',
        lessons: [
          'Uniswap mechanics',
          'Liquidity pools',
          'Impermanent loss',
          'Quiz & Assessment',
        ],
      },
      {
        title: 'Lending & Borrowing',
        lessons: [
          'Aave and Compound',
          'Collateralization ratios',
          'Liquidation mechanics',
          'Quiz & Assessment',
        ],
      },
      {
        title: 'Solidity Basics',
        lessons: [
          'Solidity syntax',
          'Data types and functions',
          'Events and modifiers',
          'Quiz & Assessment',
        ],
      },
      {
        title: 'Smart Contract Security',
        lessons: [
          'Reentrancy attacks',
          'Integer overflow',
          'Access control flaws',
          'Quiz & Assessment',
        ],
      },
      {
        title: 'Yield Strategies',
        lessons: [
          'Yield farming explained',
          'Composability and money legos',
          'Risk assessment',
          'Quiz & Assessment',
        ],
      },
      {
        title: 'L2 & Scaling',
        lessons: [
          'Rollups (Optimism, Arbitrum)',
          'Gas optimization',
          'Cross-chain bridges',
          'Quiz & Assessment',
        ],
      },
      {
        title: 'Capstone Project',
        lessons: [
          'Design your DeFi protocol',
          'Deploy to testnet',
          'Audit and refine',
          'Final Presentation',
        ],
      },
    ],
  },
  {
    id: 4,
    title: 'Portfolio Management Pro',
    description: 'Build and manage a professional cryptocurrency portfolio',
    level: 'Intermediate',
    duration: '5 weeks',
    students: 1200,
    rating: 4.8,
    price: 59,
    image: '💼',
    tier: 'pro',
    instructor: 'Jordan Patel',
    content: [
      'Asset allocation strategies for crypto',
      'Rebalancing techniques and tax implications',
      'Dollar-cost averaging and lump-sum investing',
      'Tracking and reporting tools',
      'Building a diversified multi-asset portfolio',
    ],
    weeks: [
      {
        title: 'Portfolio Theory',
        lessons: [
          'Risk vs. return',
          'Diversification principles',
          'Correlation in crypto markets',
          'Quiz & Assessment',
        ],
      },
      {
        title: 'Allocation Strategies',
        lessons: [
          'Core vs. satellite approach',
          'Market cap weighting',
          'Equal weighting',
          'Quiz & Assessment',
        ],
      },
      {
        title: 'DCA & Accumulation',
        lessons: [
          'Dollar-cost averaging deep dive',
          'Lump-sum vs. DCA',
          'Automating your buys',
          'Quiz & Assessment',
        ],
      },
      {
        title: 'Rebalancing',
        lessons: [
          'When to rebalance',
          'Tax-loss harvesting',
          'Tools for tracking',
          'Quiz & Assessment',
        ],
      },
      {
        title: 'Long-term Strategy',
        lessons: [
          'Building generational wealth',
          'Exit strategies',
          'Portfolio stress testing',
          'Final Project',
        ],
      },
    ],
  },
  {
    id: 5,
    title: 'Risk Management & Trading Psychology',
    description: 'Master the mental and strategic aspects of successful trading',
    level: 'All Levels',
    duration: '4 weeks',
    students: 3100,
    rating: 4.9,
    price: 39,
    image: '🧠',
    tier: 'pro',
    instructor: 'Dr. Lisa Wang',
    content: [
      'Position sizing and risk-per-trade rules',
      'Understanding cognitive biases in trading',
      'Building a trading plan and sticking to it',
      'Handling drawdowns and emotional resilience',
      'Journaling and performance review systems',
    ],
    weeks: [
      {
        title: 'Risk Fundamentals',
        lessons: [
          'What is risk?',
          'Position sizing formulas',
          'Stop-loss placement',
          'Quiz & Assessment',
        ],
      },
      {
        title: 'Cognitive Biases',
        lessons: [
          'Fear and greed cycles',
          'Confirmation bias',
          'Loss aversion',
          'Quiz & Assessment',
        ],
      },
      {
        title: 'Trading Plans',
        lessons: [
          'Building your rulebook',
          'Entry and exit criteria',
          'Scenario planning',
          'Quiz & Assessment',
        ],
      },
      {
        title: 'Mindset & Resilience',
        lessons: [
          'Handling losing streaks',
          'Trade journaling',
          'Performance review system',
          'Final Project',
        ],
      },
    ],
  },
  {
    id: 6,
    title: 'Advanced Trading Algorithms',
    description: 'Create and deploy automated trading bots and algorithms',
    level: 'Expert',
    duration: '10 weeks',
    students: 450,
    rating: 4.95,
    price: 199,
    image: '🤖',
    tier: 'premium',
    instructor: 'Chris Nakamura',
    content: [
      'Python for financial data analysis',
      'Building and backtesting trading algorithms',
      'Connecting to exchange APIs (Binance, Coinbase)',
      'Running bots 24/7 on cloud infrastructure',
      'Risk management in automated systems',
    ],
    weeks: [
      {
        title: 'Python Foundations',
        lessons: [
          'Python for finance basics',
          'Pandas and NumPy',
          'Fetching market data',
          'Quiz & Assessment',
        ],
      },
      {
        title: 'Strategy Design',
        lessons: [
          'Trend-following algorithms',
          'Mean-reversion strategies',
          'Signal generation',
          'Quiz & Assessment',
        ],
      },
      {
        title: 'Backtesting',
        lessons: [
          'Setting up a backtest engine',
          'Avoiding look-ahead bias',
          'Interpreting results',
          'Quiz & Assessment',
        ],
      },
      {
        title: 'Exchange APIs',
        lessons: [
          'Binance API setup',
          'Order types and execution',
          'WebSocket live feeds',
          'Quiz & Assessment',
        ],
      },
      {
        title: 'Bot Architecture',
        lessons: [
          'Event-driven design',
          'Error handling and retries',
          'Logging and monitoring',
          'Quiz & Assessment',
        ],
      },
      {
        title: 'Risk Controls',
        lessons: [
          'Circuit breakers',
          'Max drawdown stops',
          'Position sizing in bots',
          'Quiz & Assessment',
        ],
      },
      {
        title: 'Cloud Deployment',
        lessons: [
          'VPS vs. cloud functions',
          'Docker containerization',
          'Uptime monitoring',
          'Quiz & Assessment',
        ],
      },
      {
        title: 'Advanced Strategies',
        lessons: [
          'Statistical arbitrage',
          'Market making basics',
          'Sentiment-driven trading',
          'Quiz & Assessment',
        ],
      },
      {
        title: 'Portfolio of Bots',
        lessons: [
          'Running multiple strategies',
          'Correlation management',
          'Performance dashboards',
          'Quiz & Assessment',
        ],
      },
      {
        title: 'Capstone',
        lessons: [
          'Deploy a production bot',
          'Live trading review',
          'Full audit',
          'Final Presentation',
        ],
      },
    ],
  },
]

export const getCourseById = (id: string | undefined): Course | undefined =>
  courses.find((c) => c.id === Number(id))
