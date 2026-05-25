import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

const routeLabels = {
  sort: 'Sorting',
  search: 'Searching',
  spath: 'Shortest Path',
  adt: 'Data Structures',
  math: 'Math Visualizer',
  string: 'String Algorithms',
  graph: 'Graph Algorithms',
  visualizer: 'Visualizer',
  compare: 'Compare Mode',
  ldssearch: 'LDS Search',
  kadane: 'Kadane Algorithm',
  'moore-voting': 'Moore Voting',
  backtracking: 'Backtracking',
}

export default function Breadcrumbs() {
  const location = useLocation()

  const pathnames = location.pathname.split('/').filter(Boolean)

  if (pathnames.length === 0) {
    return null
  }

  return (
    <div className="flex items-center flex-wrap gap-2 px-2 sm:px-1 text-sm text-slate-400 overflow-x-auto">
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-cyan-400 transition-colors duration-200"
      >
        <Home size={15} />
        <span>Home</span>
      </Link>

      {pathnames.map((segment, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`

        const isLast = index === pathnames.length - 1

        const label =
          routeLabels[segment] ||
          segment
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase())

        return (
          <React.Fragment key={routeTo}>
            <ChevronRight size={15} className="text-slate-600" />

            {isLast ? (
              <span className="text-cyan-400 font-medium whitespace-nowrap">
                {label}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-cyan-400 transition-colors duration-200 whitespace-nowrap"
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
