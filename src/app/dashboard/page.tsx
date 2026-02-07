'use client'
import PathCreationModal from '@/components/PathCreationModal'
import QuizAssessmentModal from '@/components/QuizAssessmentModal'
import { useState } from 'react'
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [courseTitle, setCourseTitle] = useState('')
  const [modalType, setModalType] = useState('')
  const openModal = (courseTitle: string) => {
    setIsModalOpen(true)
    setCourseTitle(courseTitle)
    setModalType('pathCreation')
  }
  return (
    <div>
      <h1>Welcome to Dashboard</h1>
      <button onClick={() => openModal('python')}>Python</button>
      <button onClick={() => openModal('python')}>Node JS</button>
      <button onClick={() => openModal('python')}>.Net framework</button>
      <PathCreationModal
        courseTitle={courseTitle}
        isOpen={isModalOpen && modalType === 'pathCreation'}
        onClose={() => setIsModalOpen(false)}
        onSubmit={() => setModalType('quizAssessment')}
      />
      <QuizAssessmentModal
        isOpen={isModalOpen && modalType === 'quizAssessment'}
        onClose={() => setIsModalOpen(false)}
        onTakeQuiz={() => {router.push('/quiz'); setIsModalOpen(false)}}
        onSkipQuiz={() => {console.log('skip'); setIsModalOpen(false)}}
        onBack={()=> setModalType('pathCreation')}
      />
    </div>
  )
}
