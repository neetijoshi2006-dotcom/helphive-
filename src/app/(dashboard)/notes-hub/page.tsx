'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Modal } from '@/components/ui/Modal'
import { Input, Textarea } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Search, Plus, Download, FileText, Heart, UploadCloud } from 'lucide-react'
import toast from 'react-hot-toast'
import { relativeTime } from '@/lib/utils/format'

// Mock Data
const MOCK_NOTES = [
  { id: '1', title: 'DBMS Normalization & Keys', subject: 'Computer Science', author: 'Priya Singh', downloads: 142, likes: 45, date: new Date(Date.now() - 86400000 * 2) },
  { id: '2', title: 'React Hooks Cheatsheet', subject: 'Web Dev', author: 'Alex Rivera', downloads: 89, likes: 32, date: new Date(Date.now() - 86400000 * 4) },
  { id: '3', title: 'Operating Systems Ch 4-6', subject: 'Computer Science', author: 'Jordan Lee', downloads: 210, likes: 78, date: new Date(Date.now() - 86400000 * 7) },
  { id: '4', title: 'Calculus III Final Prep', subject: 'Mathematics', author: 'Sarah Chen', downloads: 56, likes: 12, date: new Date(Date.now() - 86400000 * 12) },
  { id: '5', title: 'Data Structures Algorithms', subject: 'Computer Science', author: 'Casey Kim', downloads: 340, likes: 112, date: new Date(Date.now() - 86400000 * 15) },
  { id: '6', title: 'Physics Kinematics', subject: 'Physics', author: 'Taylor Swift', downloads: 42, likes: 8, date: new Date(Date.now() - 86400000 * 20) },
]

const item = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
})

export default function NotesHubPage() {
  const [search, setSearch] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [notes, setNotes] = useState(MOCK_NOTES)
  
  // Form State
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('Computer Science')
  const [desc, setDesc] = useState('')

  const filtered = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.subject.toLowerCase().includes(search.toLowerCase())
  )

  const handleDownload = (title: string) => {
    toast.success(`Downloading ${title}... 🎀`)
    // In a real app, this would trigger a file download from Firebase Storage
  }

  const handleLike = (id: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, likes: n.likes + 1 } : n))
    toast.success('Note liked! ✨')
  }

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const newNote = {
      id: Date.now().toString(),
      title,
      subject,
      author: 'Demo User', // You
      downloads: 0,
      likes: 0,
      date: new Date(),
    }

    setNotes([newNote, ...notes])
    setShowUpload(false)
    setTitle('')
    setDesc('')
    toast.success('Your notes have been posted! 🎉')
  }

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Notes Hub 📚</h1>
          <p className="text-sm text-neutral-400 mt-0.5">Share knowledge and download study materials</p>
        </div>
        <Button onClick={() => setShowUpload(true)} className="shadow-sm">
          <UploadCloud className="w-4 h-4" />
          Post Notes
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8 max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          placeholder="Search for subjects, topics, or subjects... ✨"
          className="w-full pl-11 pr-4 py-4 rounded-2xl border-2 border-neutral-100 bg-white text-sm placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-all shadow-sm" 
        />
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((note, i) => (
          <motion.div key={note.id} {...item(i)}>
            <Card className="h-full flex flex-col group hover:border-neutral-900 bg-white border-neutral-100 shadow-sm hover:shadow-xl transition-all">
              
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 bg-neutral-50 text-neutral-900 text-[10px] font-bold uppercase tracking-widest rounded-full border border-neutral-100">
                  {note.subject}
                </span>
              </div>

              <h3 className="font-bold text-neutral-900 text-lg group-hover:underline decoration-neutral-200 transition-colors line-clamp-2 mb-4">
                {note.title}
              </h3>

              <div className="flex items-center gap-3 mb-6">
                <Avatar name={note.author} size="sm" />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-neutral-900 truncate">{note.author}</p>
                  <p className="text-xs text-neutral-400">{relativeTime(note.date)}</p>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-neutral-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button onClick={() => handleLike(note.id)} className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer">
                    <Heart className="w-4 h-4" />
                    {note.likes}
                  </button>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-neutral-400">
                    <Download className="w-4 h-4" />
                    {note.downloads}
                  </span>
                </div>
                
                <button 
                  onClick={() => handleDownload(note.title)}
                  className="bg-neutral-900 text-white px-5 py-2 rounded-xl text-xs font-bold hover:scale-105 transition-all"
                >
                  Download
                </button>
              </div>

            </Card>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white border border-dashed border-neutral-200 rounded-[3rem]">
            <span className="text-5xl block mb-4">🔍</span>
            <p className="text-neutral-900 text-xl font-bold">No notes found!</p>
            <p className="text-neutral-400 mt-2">Try searching for something else or upload your own.</p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <Modal open={showUpload} onClose={() => setShowUpload(false)} title="Share Your Knowledge 🌸">
        <form className="space-y-6" onSubmit={handleUpload}>
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">Note Title</label>
            <input 
              className="w-full px-5 py-4 rounded-2xl border-2 border-neutral-100 bg-white text-sm focus:outline-none focus:border-neutral-900 transition-all"
              placeholder="e.g. Chapter 4 Summary..." 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">Subject Area</label>
            <select 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border-2 border-neutral-100 bg-white text-sm focus:outline-none focus:border-neutral-900 transition-all cursor-pointer"
            >
              <option>Computer Science</option>
              <option>Mathematics</option>
              <option>Physics</option>
              <option>Web Dev</option>
              <option>General</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">File Attachment</label>
            <div className="border-2 border-dashed border-neutral-200 bg-neutral-50 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center hover:bg-white hover:border-neutral-900 transition-all cursor-pointer group">
              <UploadCloud className="w-10 h-10 text-neutral-300 mb-4 group-hover:text-neutral-900 transition-colors" />
              <p className="text-sm font-bold text-neutral-900">Click to upload your PDF</p>
              <p className="text-xs text-neutral-400 mt-1">Maximum size 10MB</p>
              <input type="file" className="hidden" accept=".pdf" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={() => setShowUpload(false)}
              className="px-6 py-4 rounded-2xl font-bold text-neutral-400 hover:text-neutral-900 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="bg-neutral-900 text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-neutral-900/10"
            >
              Post Notes ✨
            </button>
          </div>
        </form>
      </Modal>

    </PageWrapper>
  )
}
