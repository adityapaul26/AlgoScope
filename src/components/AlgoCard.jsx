import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function AlgoCard({
  title,
  description,
  color = 'bg-yellow-100',
  link,
  image,
  imageAlt,
}) {
  const navigate = useNavigate()

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 10,
        stiffness: 100,
      },
    },
  }

  const glowVariants = {
    hover: {
      boxShadow: `0 0 20px 5px ${color.replace('bg-', 'var(--glow-')})`,
      transition: { duration: 0.3 },
    },
  }

  return (
    <motion.div
      className={`w-full rounded-3xl shadow-lg overflow-hidden border backdrop-blur-sm transition-colors duration-300 ${color}`}
      style={{ '--glow-color': 'rgba(255, 255, 255, 0.5)' }}
      variants={cardVariants}
      whileHover="hover"
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold theme-text-strong mb-2">{title}</h2>
        <p className="theme-text-muted text-base font-light leading-relaxed">
          {description}
        </p>
        {image && (
          <motion.div
            className="theme-media-surface mt-6 flex justify-center rounded-xl p-4 border"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={image}
              alt={imageAlt || `${title} visualization`}
              className="max-w-full h-40 w-auto object-contain rounded-lg opacity-90 hover:opacity-100 transition-opacity"
            />
          </motion.div>
        )}
      </div>
      <div
        className="theme-media-surface px-6 py-4 flex justify-center border-t"
      >
        <motion.button
          className="theme-button-secondary text-sm font-medium border px-6 py-3 rounded-xl transition-all duration-300 backdrop-blur-md"
          onClick={() => navigate(link)}
          whileHover={{ scale: 1.05, ...glowVariants.hover }}
          whileTap={{ scale: 0.95 }}
          variants={glowVariants}
        >
          Explore Now
        </motion.button>
      </div>
    </motion.div>
  )
}
