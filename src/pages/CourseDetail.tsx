import { useParams, Link } from 'react-router-dom'
import { Clock, Users, Star, ArrowLeft } from 'lucide-react'
import { getCourseById } from '../data/courses'

export default function CourseDetail() {
  const { id } = useParams()
  const course = getCourseById(id) ?? getCourseById('1')!

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
            </div>

            {/* Course Curriculum */}
            <div className="glass-effect p-8">
              <h2 className="text-2xl font-bold mb-6">Course Structure</h2>
              <div className="space-y-4">
                {course.weeks.map((week, i) => (
                  <div key={i} className="border-b border-white/10 pb-4 last:border-0">
                    <h3 className="font-semibold mb-2">Week {i + 1}: {week.title}</h3>
                    <ul className="text-sm text-gray-400 space-y-1 ml-4">
                      {week.lessons.map((lesson, j) => (
                        <li key={j}>• {lesson}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Enrollment Card */}
            <div className="glass-effect p-8 sticky top-20">
              <div className="text-4xl font-bold mb-2">
                {course.price === 0 ? 'Free' : `$${course.price}`}
              </div>
              <p className="text-gray-400 text-sm mb-6">One-time payment</p>

              <button className={`w-full mb-4 py-3 rounded-lg font-semibold transition ${
                course.price === 0 ? 'btn-primary' : 'btn-premium'
              }`}>
                {course.price === 0 ? 'Enroll Now' : 'Upgrade & Enroll'}
              </button>

              <button className="btn-secondary w-full mb-6">
                Add to Wishlist
              </button>

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
