'use client'

import { PageWrapper } from '@/components/layout/PageWrapper'
import { MessageSquare, Heart, Share2, Search, Plus } from 'lucide-react'

const posts = [
  {
    id: 1,
    author: "Sarah J.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    content: "Does anyone have good resources for Organic Chemistry? 🧪 I'm struggling with reaction mechanisms.",
    time: "2h ago",
    likes: 12,
    comments: 5,
    tag: "Chemistry"
  },
  {
    id: 2,
    author: "Alex Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    content: "Just finished my first set of Biology flashcards! They really help with memorizing the cell structure. 🧬",
    time: "4h ago",
    likes: 24,
    comments: 3,
    tag: "Study Tips"
  },
  {
    id: 3,
    author: "Emily Watson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    content: "Group study session for Calculus tomorrow at 5 PM? Anyone interested? 📈",
    time: "6h ago",
    likes: 8,
    comments: 12,
    tag: "Mathematics"
  }
]

export default function CommunityPage() {
  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Community 💬</h1>
            <p className="text-neutral-600 mt-1">Connect with fellow students and share knowledge.</p>
          </div>
          <button className="flex items-center gap-2 bg-neutral-900 text-white px-5 py-2.5 rounded-2xl hover:opacity-90 transition-all font-medium">
            <Plus size={20} />
            <span>New Post</span>
          </button>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
          <input 
            type="text" 
            placeholder="Search discussions..." 
            className="w-full bg-white border border-neutral-200 rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-neutral-200 transition-all outline-none"
          />
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white border border-neutral-200 rounded-3xl p-6 hover:shadow-sm transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full bg-neutral-100" />
                  <div>
                    <h3 className="font-semibold text-neutral-900">{post.author}</h3>
                    <span className="text-xs text-neutral-500">{post.time}</span>
                  </div>
                </div>
                <span className="px-3 py-1 bg-neutral-50 text-neutral-600 text-xs font-medium rounded-full">
                  #{post.tag}
                </span>
              </div>
              
              <p className="text-neutral-700 text-lg leading-relaxed mb-6">
                {post.content}
              </p>

              <div className="flex items-center gap-6 pt-4 border-t border-neutral-50">
                <button className="flex items-center gap-2 text-neutral-500 hover:text-red-500 transition-colors group/btn">
                  <Heart size={18} className="group-hover/btn:fill-current" />
                  <span className="text-sm font-medium">{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors">
                  <MessageSquare size={18} />
                  <span className="text-sm font-medium">{post.comments}</span>
                </button>
                <button className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors ml-auto">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  )
}

