'use client'

import { useState, useEffect } from 'react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { MessageSquare, Heart, Share2, Search, Plus, Sparkles, Send, Tag, Smile } from 'lucide-react'
import { collection, addDoc, getDocs, updateDoc, doc, increment, query, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { useAppStore } from '@/lib/store/useAppStore'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

interface CommunityPost {
  id: string
  author: string
  avatar: string
  content: string
  likes: number
  comments: number
  tag: string
  createdAt: any
}

const DEFAULT_POSTS = [
  {
    author: "Sarah J.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    content: "Does anyone have good resources for Organic Chemistry? 🧪 I'm struggling with reaction mechanisms.",
    likes: 12,
    comments: 5,
    tag: "Chemistry"
  },
  {
    author: "Alex Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    content: "Just finished my first set of Biology flashcards! They really help with memorizing the cell structure. 🧬",
    likes: 24,
    comments: 3,
    tag: "Study Tips"
  },
  {
    author: "Emily Watson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    content: "Group study session for Calculus tomorrow at 5 PM? Anyone interested? 📈",
    likes: 8,
    comments: 12,
    tag: "Mathematics"
  }
]

const AVAILABLE_TAGS = [
  "Study Tips",
  "Biology",
  "Chemistry",
  "Mathematics",
  "Physics",
  "General Discussion"
]

export default function CommunityPage() {
  const { user } = useAppStore()
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)

  // Form State
  const [content, setContent] = useState('')
  const [selectedTag, setSelectedTag] = useState('General Discussion')
  const [submitting, setSubmitting] = useState(false)
  const [likedPosts, setLikedPosts] = useState<string[]>([])

  // Fetch posts from Firestore
  async function fetchPosts() {
    setLoading(true)
    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      const fetched: CommunityPost[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        fetched.push({
          id: doc.id,
          author: data.author,
          avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.author}`,
          content: data.content,
          likes: data.likes || 0,
          comments: data.comments || 0,
          tag: data.tag || 'General',
          createdAt: data.createdAt
        })
      })

      // If empty, let's seed or use default posts
      if (fetched.length > 0) {
        setPosts(fetched)
      } else {
        // Prepare defaults with unique IDs
        const formattedDefaults = DEFAULT_POSTS.map((p, idx) => ({
          ...p,
          id: `default-${idx}`,
          createdAt: null
        }))
        setPosts(formattedDefaults)
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err)
      // Fallback
      const formattedDefaults = DEFAULT_POSTS.map((p, idx) => ({
        ...p,
        id: `default-${idx}`,
        createdAt: null
      }))
      setPosts(formattedDefaults)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  // Create new post
  async function handleCreatePost(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) {
      toast.error('Please write some content for your post!')
      return
    }

    setSubmitting(true)
    try {
      const authorName = user?.displayName || user?.email?.split('@')[0] || 'Anonymous student'
      const newPostData = {
        author: authorName,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(authorName)}`,
        content: content.trim(),
        likes: 0,
        comments: 0,
        tag: selectedTag,
        createdAt: new Date()
      }

      await addDoc(collection(db, 'posts'), newPostData)
      toast.success('Your post is live in the community! 🌸')
      setContent('')
      setShowForm(false)
      fetchPosts()
    } catch (err) {
      console.error('Failed to publish post:', err)
      toast.error('Could not publish post to Firestore 🥺')
    } finally {
      setSubmitting(false)
    }
  }

  // Like a post
  async function handleLike(postId: string) {
    if (likedPosts.includes(postId)) {
      toast.error('You already liked this post! 💖')
      return
    }

    // Optimistic UI Update
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p))
    setLikedPosts(prev => [...prev, postId])

    try {
      if (!postId.startsWith('default-')) {
        await updateDoc(doc(db, 'posts', postId), {
          likes: increment(1)
        })
      }
      toast.success('Liked! 💖')
    } catch (err) {
      console.error('Failed to like post:', err)
    }
  }

  // Filter posts based on search term
  const filteredPosts = posts.filter(post => {
    const search = searchTerm.toLowerCase()
    return (
      post.content.toLowerCase().includes(search) ||
      post.author.toLowerCase().includes(search) ||
      post.tag.toLowerCase().includes(search)
    )
  })

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto py-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-2">
              Community Feed 💬
            </h1>
            <p className="text-sm text-neutral-500 mt-0.5">Connect with fellow students, ask questions, and share study tips.</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-neutral-900 text-white px-6 py-3.5 rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-neutral-900/10 cursor-pointer text-sm"
          >
            <Plus size={16} />
            <span>{showForm ? 'Cancel Post' : 'New Post'}</span>
          </button>
        </div>

        {/* Create Post Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-white border-2 border-neutral-150 rounded-[2.5rem] p-8 shadow-xl">
                <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
                  <Sparkles className="text-primary w-5 h-5" /> Share with the Hive!
                </h2>

                <form onSubmit={handleCreatePost} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-neutral-600 mb-2">Subject / Tag</label>
                    <select
                      value={selectedTag}
                      onChange={(e) => setSelectedTag(e.target.value)}
                      className="w-full md:w-64 rounded-2xl border-2 border-neutral-150 px-4 py-3 text-sm text-neutral-800 focus:border-neutral-900 focus:outline-none transition-all font-medium bg-white"
                    >
                      {AVAILABLE_TAGS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-neutral-600 mb-2">Post Content</label>
                    <textarea
                      placeholder="What's on your mind? Ask a question or share a study tip... 📚🌸"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      required
                      rows={4}
                      className="w-full rounded-2xl border-2 border-neutral-150 p-4 text-neutral-800 focus:border-neutral-900 focus:outline-none transition-all placeholder-neutral-300 resize-none font-medium leading-relaxed shadow-inner"
                    />
                  </div>

                  <div className="pt-4 flex justify-end gap-3 border-t border-neutral-100">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="rounded-2xl border-2 border-neutral-200 px-6 py-3 font-semibold text-neutral-600 hover:bg-neutral-50 cursor-pointer text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="rounded-2xl bg-neutral-900 text-white hover:bg-neutral-800 px-8 py-3 font-semibold shadow-md flex items-center gap-2 cursor-pointer text-sm disabled:opacity-50"
                    >
                      <Send size={14} />
                      <span>Publish Post 🚀</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input 
            type="text" 
            placeholder="Search posts by tag, content, or author..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border-2 border-neutral-150 rounded-2xl py-3.5 pl-12 pr-4 focus:border-neutral-950 transition-all outline-none text-sm placeholder-neutral-400 font-medium"
          />
        </div>

        {/* Posts Feed */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-neutral-300 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-neutral-400 font-medium">Gathering community posts...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-white border border-neutral-150 rounded-[3rem] p-8 shadow-sm">
            <div className="w-16 h-16 bg-neutral-50 text-neutral-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smile size={28} />
            </div>
            <h3 className="text-lg font-bold text-neutral-800 mb-1">No Posts Found</h3>
            <p className="text-neutral-500 max-w-sm mx-auto text-sm">Be the first to publish a study question or post to HelpHive! Click "New Post" above.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post, pIdx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(pIdx * 0.05, 0.3) }}
                className="bg-white border-2 border-neutral-150 rounded-[2.5rem] p-6 md:p-8 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={post.avatar} 
                      alt={post.author} 
                      className="w-10 h-10 rounded-2xl bg-neutral-100 border border-neutral-200" 
                    />
                    <div>
                      <h3 className="font-bold text-neutral-900 text-sm md:text-base">{post.author}</h3>
                      <span className="text-[10px] text-neutral-400 font-medium">
                        {post.createdAt ? 'Active Member' : 'Default Post'}
                      </span>
                    </div>
                  </div>
                  <span className="px-3.5 py-1 bg-primary-50 text-primary text-[10px] md:text-xs font-bold rounded-full">
                    #{post.tag}
                  </span>
                </div>
                
                <p className="text-neutral-800 text-base md:text-lg leading-relaxed mb-6 font-medium whitespace-pre-wrap">
                  {post.content}
                </p>

                <div className="flex items-center gap-6 pt-4 border-t border-neutral-100">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 transition-all group/btn cursor-pointer ${
                      likedPosts.includes(post.id) 
                        ? 'text-red-500 font-bold scale-105' 
                        : 'text-neutral-400 hover:text-red-500'
                    }`}
                  >
                    <Heart 
                      size={18} 
                      className={`${
                        likedPosts.includes(post.id) 
                          ? 'fill-red-500 stroke-red-500' 
                          : 'group-hover/btn:fill-red-50 hover:stroke-red-500'
                      }`} 
                    />
                    <span className="text-xs font-bold">{post.likes}</span>
                  </button>
                  
                  <div className="flex items-center gap-2 text-neutral-400">
                    <MessageSquare size={18} />
                    <span className="text-xs font-bold">{post.comments}</span>
                  </div>

                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/community`);
                      toast.success('Link copied to share! 🎀');
                    }}
                    className="flex items-center gap-2 text-neutral-400 hover:text-neutral-900 transition-colors ml-auto cursor-pointer"
                  >
                    <Share2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
