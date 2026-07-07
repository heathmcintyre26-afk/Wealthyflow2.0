import { BookOpen, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { courses } from '../data/courses'

export default function Courses() {

  return (
    <div className="min-h-screen bg-crypto-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Learn Crypto Trading</h1>
          <p className="text-xl text-gray-300">Master the skills to trade confidently in any market</p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Link
              key={course.id}
              to={`/course/${course.id}`}
              className="group glass-effect p-6 hover:border-white/40 transition transform hover:scale-105"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <span className="text-4xl">{course.image}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  course.tier === 'free'
                    ? 'bg-green-500/20 text-green-400'
                    : course.tier === 'pro'
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {course.tier.toUpperCase()}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-bold mb-2 group-hover:text-crypto-accent transition">
                {course.title}
              </h3>
              <p className="text-gray-400 text-sm mb-4">{course.description}</p>

              {/* Meta Info */}
              <div className="space-y-2 mb-6 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <BookOpen size={16} />
                  <span>{course.level}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star size={16} className="text-yellow-400" />
                  <span>{course.rating} ({course.students} students)</span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <span className="font-bold text-lg">
                  {course.price === 0 ? 'Free' : `$${course.price}`}
                </span>
                <span className="text-gray-400 text-sm">{course.duration}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Master Crypto?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Start with free courses and unlock premium content with Pro and Premium memberships
          </p>
          <Link to="/pricing" className="btn-primary text-lg">
            View Pricing Plans
          </Link>
        </div>
      </div>
    </div>
  )
}
