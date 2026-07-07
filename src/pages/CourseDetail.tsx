import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Clock, Users, Star, ArrowLeft, CheckCircle, Lock } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { fetchEnrollments, enroll, insertTransaction } from '../lib/api'

const courseData: Record<string, {
  title: string
  description: string
  level: string
  duration: string
  students: number
  rating: number
  price: number
  tier: string
  instructor: string
  image: string
  content: string[]
}> = {
  '1': {
    title: 'Crypto Fundamentals',
    description: 'Learn the basics of blockchain, Bitcoin, and Ethereum',
    level: 'Beginner',
    duration: '4 weeks',
    students: 2500,
    rating: 4.8,
    price: 0,
    tier: 'free',
    instructor: 'Sarah Chen',
    image: '🔷',
    content: [
      'Introduction to blockchain technology',
      'Understanding Bitcoin and mining',
      'Ethereum and smart contracts basics',
      'Cryptocurrency wallets and security',
      'Market fundamentals and economics',
    ],
  },
  '2': {
    title: 'Technical Analysis Mastery',
    description: 'Master chart patterns, indicators, and trading strategies',
    level: 'Intermediate',
    duration: '6 weeks',
    students: 1800,
    rating: 4.9,
    price: 49,
    tier: 'pro',
    instructor: 'Mike Thompson',
    image: '📈',
    content: [
      'Candlestick patterns and chart reading',
      'Moving averages and trend analysis',
      'Support and resistance levels',
      'RSI, MACD, and other indicators',
      'Building a complete trading strategy',
    ],
  },
  '3': {
    title: 'DeFi & Smart Contracts',
    description: 'Understand decentralized finance and smart contract development',
    level: 'Advanced',
    duration: '8 weeks',
    students: 950,
    rating: 4.7,
    price: 99,
    tier: 'premium',
    instructor: 'Alex Rivera',
    image: '⚙️',
    content: [
      'Introduction to DeFi protocols',
      'Smart contract development with Solidity',
      'Yield farming and liquidity mining',
      'Security auditing basics',
      'Building your own DeFi project',
    ],
  },
  '4': {
    title: 'Portfolio Management Pro',
    description: 'Build and manage a professional cryptocurrency portfolio',
    level: 'Intermediate',
    duration: '5 weeks',
    students: 1200,
    rating: 4.8,
    price: 59,
    tier: 'pro',
    instructor: 'Jordan Lee',
    image: '💼',
    content: [
      'Asset allocation strategies',
      'Diversification principles',
      'Risk-adjusted returns',
      'Rebalancing techniques',
      'Tax-efficient portfolio management',
    ],
  },
  '5': {
    title: 'Risk Management & Trading Psychology',
    description: 'Master the mental and strategic aspects of successful trading',
    level: 'All Levels',
    duration: '4 weeks',
    students: 3100,
    rating: 4.9,
    price: 39,
    tier: 'pro',
    instructor: 'Dana Kim',
    image: '🧠',
    content: [
      'Emotional discipline in trading',
      'Position sizing and stop-losses',
      'Avoiding common cognitive biases',
      'Building a winning mindset',
      'Journaling and performance review',
    ],
  },
  '6': {
    title: 'Advanced Trading Algorithms',
    description: 'Create and deploy automated trading bots and algorithms',
    level: 'Expert',
    duration: '10 weeks',
    students: 450,
    rating: 4.95,
    price: 199,
    tier: 'premium',
    instructor: 'Chris Nakamoto',
    image: '🤖',
    content: [
      'Algorithmic trading fundamentals',
      'Python for trading automation',
      'Backtesting strategies',
      'Live deployment on exchanges',
      'Risk management for automated systems',
    ],
  },
}

const TIER_RANK: Record<string, number> = { free: 0, pro: 1, premium: 2 }

export default function CourseDetail() {
  const { id } = useParams()
  const { user, tier } = useAuth()
  const course = courseData[id ?? '1'] ?? courseData['1']
  const courseId = parseInt(id ?? '1')

  const [isEnrolled, setIsEnrolled] = useState(false)
  const [enrolling, setEnrolling] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasAccess = TIER_RANK[tier] >= TIER_RANK[course.tier]

  useEffect(() => {
    if (!user) return
    fetchEnrollments(user.id).then((enrollments) => {
      setIsEnrolled(enrollments.some((e) => e.course_id === courseId))
    })
  }, [user, courseId])

  const handleEnroll = async () => {
    if (!user) { setError('Please sign in to enroll.'); return }
    if (!hasAccess) { setError('Upgrade your plan to access this course.'); return }
    setEnrolling(true)
    setError(null)
    try {
      await enroll(user.id, courseId)
      if (course.price > 0) {
        // For paid courses, record a pending transaction. The status is updated
        // to 'completed' server-side after payment is confirmed (e.g., via
        // a Stripe webhook) — never trust the client to mark payment complete.
        await insertTransaction({ user_id: user.id, course_id: courseId, amount: course.price, status: 'pending' })
      }
      setIsEnrolled(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Enrollment failed')
    } finally {
      setEnrolling(false)
    }
  }

  return (
    <div className="min-h-screen bg-crypto-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link to="/courses" className="inline-flex items-center space-x-2 text-crypto-accent hover:text-blue-400 mb-8">
          <ArrowLeft size={20} />
          <span>Back to Courses</span>
        </Link>

        {/* Course Header */}
        <div className="glass-effect p-8 mb-12">
          <div className="flex items-start justify-between mb-6">
            <div>
              <span className="text-5xl">{course.image}</span>
              <h1 className="text-4xl font-bold mt-4 mb-2">{course.title}</h1>
              <p className="text-xl text-gray-300">{course.description}</p>
            </div>
            <span className={`px-4 py-2 rounded-lg font-bold h-fit ${
              course.tier === 'free'
                ? 'bg-green-500/20 text-green-400'
                : course.tier === 'pro'
                ? 'bg-blue-500/20 text-blue-400'
                : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              {course.tier.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/10">
            <div>
              <p className="text-gray-400 text-sm mb-1">Instructor</p>
              <p className="font-semibold">{course.instructor}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Level</p>
              <p className="font-semibold">{course.level}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Duration</p>
              <p className="font-semibold flex items-center space-x-1">
                <Clock size={16} />
                <span>{course.duration}</span>
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Rating</p>
              <p className="font-semibold flex items-center space-x-1">
                <Star size={16} className="text-yellow-400" />
                <span>{course.rating}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="glass-effect p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">What You'll Learn</h2>
              {isEnrolled || hasAccess ? (
                <ul className="space-y-4">
                  {course.content.map((item, index) => (
                    <li key={index} className="flex items-start space-x-4">
                      <div className="w-6 h-6 rounded-full bg-crypto-accent flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm font-bold">{index + 1}</span>
                      </div>
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <Lock size={40} className="mx-auto text-gray-500 mb-4" />
                  <p className="text-gray-400 mb-4">Enroll to unlock the full curriculum.</p>
                  <Link to="/pricing" className="btn-premium text-sm">Upgrade Plan</Link>
                </div>
              )}
            </div>

            {/* Course Curriculum */}
            <div className="glass-effect p-8">
              <h2 className="text-2xl font-bold mb-6">Course Structure</h2>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="border-b border-white/10 pb-4 last:border-0">
                    <h3 className="font-semibold mb-2">Week {i + 1}: Module Title</h3>
                    <ul className="text-sm text-gray-400 space-y-1 ml-4">
                      <li>• Lesson 1: Introduction</li>
                      <li>• Lesson 2: Core Concepts</li>
                      <li>• Lesson 3: Practical Exercise</li>
                      <li>• Quiz &amp; Assessment</li>
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="glass-effect p-8 sticky top-20">
              <div className="text-4xl font-bold mb-2">
                {course.price === 0 ? 'Free' : `$${course.price}`}
              </div>
              <p className="text-gray-400 text-sm mb-6">One-time payment</p>

              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-sm text-red-400">{error}</div>
              )}

              {isEnrolled ? (
                <div className="w-full mb-4 py-3 rounded-lg font-semibold text-center bg-green-500/20 text-green-400 flex items-center justify-center space-x-2">
                  <CheckCircle size={18} /><span>Enrolled</span>
                </div>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className={`w-full mb-4 py-3 rounded-lg font-semibold transition disabled:opacity-60 ${
                    course.price === 0 ? 'btn-primary' : 'btn-premium'
                  }`}
                >
                  {enrolling ? 'Enrolling…' : course.price === 0 ? 'Enroll Now' : 'Upgrade & Enroll'}
                </button>
              )}

              {!user && (
                <p className="text-xs text-gray-500 text-center mb-4">
                  <Link to="/auth" className="text-crypto-accent hover:underline">Sign in</Link> to enroll
                </p>
              )}

              {/* Stats */}
              <div className="space-y-4 pt-6 border-t border-white/10">
                <div className="flex items-center space-x-2">
                  <Users size={18} className="text-crypto-accent" />
                  <span className="text-gray-300">{course.students} students enrolled</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star size={18} className="text-yellow-400" />
                  <span className="text-gray-300">{course.rating} rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
