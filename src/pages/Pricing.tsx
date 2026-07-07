import { Check, Crown } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

export default function Pricing() {
  const navigate = useNavigate()
  const tiers = [
    {
      name: 'Free',
      price: 0,
      description: 'Get started with basic trading',
      features: [
        'Live market data',
        'Portfolio tracking',
        'Basic analytics',
        'Community access',
        'Email support',
      ],
      cta: 'Get Started',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: 29,
      description: 'For serious traders',
      features: [
        'Everything in Free +',
        'Advanced analytics',
        'Price alerts',
        'Priority support',
        '5 custom portfolios',
        'API access',
        'Pro courses access',
      ],
      cta: 'Upgrade to Pro',
      highlighted: true,
    },
    {
      name: 'Premium',
      price: 99,
      description: 'For professional traders',
      features: [
        'Everything in Pro +',
        'Advanced trading tools',
        'Custom strategy builder',
        '24/7 priority support',
        'Unlimited portfolios',
        'VIP community access',
        'All courses + certification',
        'Admin wallet integration',
      ],
      cta: 'Upgrade to Premium',
      highlighted: false,
    },
  ]

  return (
    <div className="min-h-screen bg-crypto-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-300">Choose the perfect plan for your trading journey</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`relative rounded-xl overflow-hidden transition transform hover:scale-105 ${
                tier.highlighted
                  ? 'glass-effect border-2 border-yellow-500 shadow-2xl scale-105'
                  : 'glass-effect'
              }`}
            >
              {tier.highlighted && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-1 text-sm font-bold flex items-center gap-2">
                  <Crown size={16} /> POPULAR
                </div>
              )}

              <div className="p-8">
                {/* Tier Name */}
                <h2 className="text-2xl font-bold mb-2">{tier.name}</h2>
                <p className="text-gray-400 mb-6 text-sm">{tier.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-bold">${tier.price}</span>
                  <span className="text-gray-400">/month</span>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => navigate('/dashboard')}
                  className={`w-full mb-8 py-3 rounded-lg font-semibold transition ${
                    tier.highlighted
                      ? 'btn-premium'
                      : 'btn-secondary'
                  }`}
                >
                  {tier.cta}
                </button>

                {/* Features */}
                <div className="space-y-4">
                  {tier.features.map((feature, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <Check size={20} className="text-crypto-success flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div className="glass-effect p-6">
              <h3 className="text-lg font-bold mb-2">Can I upgrade or downgrade anytime?</h3>
              <p className="text-gray-300">Yes! You can change your plan at any time. Changes take effect at the next billing cycle.</p>
            </div>

            <div className="glass-effect p-6">
              <h3 className="text-lg font-bold mb-2">Is there a free trial for paid plans?</h3>
              <p className="text-gray-300">Yes, we offer a 7-day free trial for Pro and Premium plans. No credit card required.</p>
            </div>

            <div className="glass-effect p-6">
              <h3 className="text-lg font-bold mb-2">How do I connect my admin wallet?</h3>
              <p className="text-gray-300">Premium users can connect their admin wallet through the admin dashboard. This enables automated fee distribution and revenue sharing features.</p>
            </div>

            <div className="glass-effect p-6">
              <h3 className="text-lg font-bold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-300">We accept all major cryptocurrencies and traditional payment methods (credit card, bank transfer). Premium accounts support direct crypto payments.</p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link to="/courses" className="btn-secondary text-lg">
            Browse Courses
          </Link>
        </div>
      </div>
    </div>
  )
}
