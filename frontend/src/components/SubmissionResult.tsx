import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Clock, Cpu } from 'lucide-react'

type SubmissionResultType = {
  status: string
  runtime: string
  memory: string
  testcases_passed: number
  total_testcases: number
}

type Props = {
  result: SubmissionResultType | null
}

const SubmissionResult: React.FC<Props> = ({ result }) => {
  if (!result) return null

  const isAccepted = result.status === 'Accepted'
  const isTLE = result.status === 'TLE'

  const statusColor = isAccepted
    ? 'text-success'
    : isTLE
      ? 'text-warning'
      : 'text-danger'

  const bgColor = isAccepted
    ? 'bg-green-950/30 border-green-500/30'
    : isTLE
      ? 'bg-yellow-950/30 border-yellow-500/30'
      : 'bg-red-950/30 border-red-500/30'

  const Icon = isAccepted ? CheckCircle : XCircle

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={`absolute bottom-4 left-4 right-4 p-5 rounded-xl border backdrop-blur-md shadow-2xl ${bgColor} z-20`}
      >
        <div className="flex items-center gap-3 mb-4">
          <Icon className={`w-7 h-7 ${statusColor}`} />
          <h3 className={`text-xl font-bold tracking-tight ${statusColor}`}>
            {result.status}
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm text-gray-300">
          <div className="flex items-center gap-2 bg-black/20 px-3 py-2 rounded-lg">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>
              Runtime:{' '}
              <span className="font-semibold text-white">{result.runtime}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 bg-black/20 px-3 py-2 rounded-lg">
            <Cpu className="w-4 h-4 text-gray-400" />
            <span>
              Memory:{' '}
              <span className="font-semibold text-white">{result.memory}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 bg-black/20 px-3 py-2 rounded-lg">
            <span className="font-semibold text-white whitespace-nowrap">
              Passed: {result.testcases_passed}/{result.total_testcases}
            </span>
          </div>
        </div>

        {!isAccepted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-3 bg-red-950/50 rounded-lg border border-red-500/20 font-mono text-sm text-red-300"
          >
            Failed at testcase {result.testcases_passed + 1}. Check your logic or constraints.
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export default SubmissionResult