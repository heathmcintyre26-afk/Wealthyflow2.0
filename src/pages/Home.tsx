import { TrendingUp, Shield, Zap, BarChart3, Lock, Smartphone } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Home() {
  const features = [
    {
      icon: TrendingUp,
      title: 'Live Market Data',
      description: 'Real-time cryptocurrency prices and market trends at your fingertips'
    },
    {
      icon: Shield,
      title: 'Secure Wallet',
      description: 'Enterprise-grade security with multi-signature wallet protection'
    },
    {
      icon: Zap,
      title: 'Smart Trading',
      description: 'Intelligent buy/sell suggestions based on market analysis'
    },
    {
      icon: BarChart3,
      title: 'Portfolio Analytics',
      description: 'Detailed insights into your investment performance and trends'
    },
    {
      icon: Lock,
      title: 'Non-Custodial',
      description: 'You control your private keys, we never store them'
    },
    {
      icon: Smartphone,
      title: 'Mobile Ready',
      description: 'Trade on the go with our responsive web application'
    }
  ]

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            The Future of <span className="gradient-crypto text-transparent bg-clip-text">Crypto Trading</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            wealthflow.444 combines a secure wallet, live market data, and intelligent trading insights to help you invest smarter in cryptocurrency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard" className="btn-primary">
              Get Started
            </Link>
            <Link to="#features" className="btn-secondary">
              Learn More
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-effect p-6">
              <div className="text-3xl font-bold text-crypto-accent mb-2">$1.2B+</div>
              <p className="text-gray-300">Total Volume Traded</p>
            </div>
            <div className="glass-effect p-6">
              <div className="text-3xl font-bold text-crypto-success mb-2">500K+</div>
              <p className="text-gray-300">Active Users</p>
            </div>
            <div className="glass-effect p-6">
              <div className="text-3xl font-bold text-crypto-accent mb-2">200+</div>
              <p className="text-gray-300">Supported Assets</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-crypto-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-300">Everything you need to trade crypto with confidence</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="glass-effect p-8 hover:bg-white/20 transition group cursor-pointer">
                  <div className="gradient-crypto p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-crypto-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Trading?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of investors using wealthflow.444 to make smarter trading decisions.
          </p>
          <Link to="/dashboard" className="btn-primary text-lg">
            Launch App
          </Link>
        </div>
      </section>
    </div>
  )
}
