import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getProblemBySlug, submitCode } from '../api/api'
import CodeEditor from '../components/CodeEditor'
import SubmissionResult from '../components/SubmissionResult'
import PageWrapper from '../components/PageWrapper'
import SkeletonLoader from '../components/SkeletonLoader'

// ==============================
// TYPES
// ==============================

type Language = 'python' | 'cpp' | 'java' | 'javascript'

interface SampleTestCase {
  input: string
  output: string
}

interface Problem {
  _id: string
  slug: string
  title: string
  statement: string
  inputFormat: string
  outputFormat: string
  constraints: string
  sampleTestCases: SampleTestCase[]
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
}

interface SubmissionResponse {
  data: {
    status: string
    runtime: string
    memory: string
    testcases_passed: number
    total_testcases: number
  }
}

// ==============================
// COMPONENT
// ==============================

const ProblemDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()

  const [language, setLanguage] = useState<Language>('python')
  const [code, setCode] = useState<string>('')

  // ==============================
  // FETCH PROBLEM
  // ==============================

  const { data, isLoading } = useQuery({
    queryKey: ['problem', slug],
    queryFn: () => getProblemBySlug(slug!),
    enabled: !!slug,
  })

  const problem: Problem | undefined = data?.problem

  // ==============================
  // DEFAULT CODE TEMPLATE
  // ==============================

  useEffect(() => {
    if (!problem || code) return

    if (language === 'python') {
      setCode(`def solve():\n    pass`)
    } else if (language === 'cpp') {
      setCode(`int main() {\n    return 0;\n}`)
    } else if (language === 'java') {
      setCode(`class Main {\n    public static void main(String[] args) {\n    }\n}`)
    } else {
      setCode(`function solve() {\n}`)
    }
  }, [problem, language, code])

  // ==============================
  // SUBMIT CODE
  // ==============================

  const submissionMutation = useMutation({
    mutationFn: submitCode,
  })

  const handleSubmit = () => {
    if (!slug) return

    submissionMutation.mutate({
      problemId: problem?._id,
      code,
      language,
    })
  }

  // ==============================
  // LOADING STATE
  // ==============================

  if (isLoading) {
    return (
      <PageWrapper className="flex h-screen p-4 gap-4">
        <div className="w-1/2 p-6">
          <SkeletonLoader type="title" />
        </div>
        <div className="w-1/2" />
      </PageWrapper>
    )
  }

  if (!problem) {
    return (
      <PageWrapper className="flex items-center justify-center">
        Problem not found
      </PageWrapper>
    )
  }

  // ==============================
  // UI
  // ==============================

  return (
    <PageWrapper className="flex h-screen">

      {/* LEFT PANEL */}
      <div className="w-1/2 p-6 overflow-y-auto">

        <h1 className="text-2xl font-bold mb-2">
          {problem.title}
        </h1>

        <span className="text-sm px-2 py-1 border rounded">
          {problem.difficulty}
        </span>

        <div className="mt-4">
          {problem.tags.map(tag => (
            <span key={tag} className="mr-2 text-xs border px-2 py-1">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6 whitespace-pre-wrap">
          {problem.statement}
        </div>

        <div className="mt-6">
          <h3 className="font-bold">Input Format</h3>
          <p>{problem.inputFormat}</p>

          <h3 className="font-bold mt-4">Output Format</h3>
          <p>{problem.outputFormat}</p>
        </div>

        <div className="mt-6">
          <h3 className="font-bold mb-2">Examples</h3>
          {problem.sampleTestCases.map((ex, i) => (
            <div key={i} className="border p-3 mb-2">
              <div><b>Input:</b> {ex.input}</div>
              <div><b>Output:</b> {ex.output}</div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="font-bold">Constraints</h3>
          <p>{problem.constraints}</p>
        </div>

      </div>

      {/* RIGHT PANEL */}
      <div className="w-1/2 p-4 bg-black text-white relative">

        <CodeEditor
          code={code}
          setCode={setCode}
          language={language}
          setLanguage={(lang: string) => setLanguage(lang as Language)}
          onSubmit={handleSubmit}
          isSubmitting={submissionMutation.isPending}
        />

        {submissionMutation.data && (
          <SubmissionResult
            result={(submissionMutation.data as SubmissionResponse).data}
          />
        )}

      </div>
    </PageWrapper>
  )
}

export default ProblemDetail