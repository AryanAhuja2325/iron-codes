import React from 'react'
import { Play, Send } from 'lucide-react'
import { motion } from 'framer-motion'

type CodeEditorProps = {
  code: string
  setCode: (code: string) => void
  language: string
  setLanguage: (lang: string) => void
  onSubmit: () => void
  isSubmitting: boolean
}


const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  setCode,
  language,
  setLanguage,
  onSubmit,
  isSubmitting,
}) => {

  
  return (
    <div className="flex flex-col h-full bg-[#0F172A] text-gray-300 overflow-hidden w-full h-full relative group">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#1E293B] border-b border-gray-700/50 shrink-0">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-[#334155] text-sm text-gray-200 border border-gray-600 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all cursor-pointer hover:bg-[#475569]"
        >
          <option value="python">Python 3</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="javascript">JavaScript</option>
        </select>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 rounded-md text-white font-medium transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            <Play className="w-4 h-4" /> Run
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm bg-success hover:bg-green-600 shadow-lg shadow-green-500/20 rounded-md text-white font-semibold transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" /> {isSubmitting ? 'Submitting...' : 'Submit'}
          </motion.button>
        </div>
      </div>

      <div className="flex-grow p-4 font-mono text-[15px] leading-relaxed relative flex">
        <div className="w-8 shrink-0 text-gray-600 text-right pr-4 select-none opacity-50 group-hover:opacity-100 transition-opacity flex flex-col h-full absolute left-4 top-4">
          {code.split('\n').map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="w-full h-full bg-transparent resize-none outline-none focus:outline-none pl-10 text-gray-200 selection:bg-blue-500/30"
          placeholder="// Write your code here..."
        />
      </div>
    </div>
  )
}

export default CodeEditor