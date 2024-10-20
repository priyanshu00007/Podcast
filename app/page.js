"use client"
import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Headphones, Search, User, LogOut, Upload, Play, Pause, Volume2, VolumeX } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'


const initialPodcastsData = [
  { id: 1, title: "Tech Talk", host: "Alex Chen", category: "Technology", image: "/placeholder.svg?height=400&width=400", audio: "/example-audio.mp3", description: "Explore the latest in tech innovations." },
  { id: 2, title: "Science Today", host: "Dr. Emily Clark", category: "Science", image: "/placeholder.svg?height=400&width=400", audio: "/example-audio.mp3", description: "Discover groundbreaking scientific research." },
  { id: 3, title: "Business Insights", host: "Jennifer Brown", category: "Business", image: "/placeholder.svg?height=400&width=400", audio: "/example-audio.mp3", description: "Learn from successful entrepreneurs and business leaders." },
  { id: 4, title: "Art World", host: "David Wilson", category: "Arts", image: "/placeholder.svg?height=400&width=400", audio: "/example-audio.mp3", description: "Dive into the vibrant world of contemporary art." },
  { id: 5, title: "Sports Center", host: "Chris Johnson", category: "Sports", image: "/placeholder.svg?height=400&width=400", audio: "/example-audio.mp3", description: "Get the latest updates and analysis on sports events." },
  { id: 6, title: "News Roundup", host: "Sarah Thompson", category: "News & Politics", image: "/placeholder.svg?height=400&width=400", audio: "/example-audio.mp3", description: "Stay informed with our daily news roundup." },
]

const categories = [
  { id: 1, name: "News & Politics", icon: "Mic", color: "bg-red-100 text-red-600" },
  { id: 2, name: "Technology", icon: "Headphones", color: "bg-blue-100 text-blue-600" },
  { id: 3, name: "Business", icon: "Briefcase", color: "bg-green-100 text-green-600" },
  { id: 4, name: "Science", icon: "Atom", color: "bg-yellow-100 text-yellow-600" },
  { id: 5, name: "Arts", icon: "Palette", color: "bg-pink-100 text-pink-600" },
  { id: 6, name: "Sports", icon: "Trophy", color: "bg-purple-100 text-purple-600" },
]

const plans = [
  { id: 1, name: "Basic", price: "$4.99/month", features: ["Access to all podcasts", "Ad-free listening", "1 category"] },
  { id: 2, name: "Pro", price: "$9.99/month", features: ["Access to all podcasts", "Ad-free listening", "All categories", "Offline listening"] },
  { id: 3, name: "Premium", price: "$14.99/month", features: ["Access to all podcasts", "Ad-free listening", "All categories", "Offline listening", "Exclusive content"] },
]

function AudioPlayer({ podcast, user, userSubscription, listeningStartTime, setCurrentPodcast }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef(new Audio(podcast.audio))

  useEffect(() => {
    const audio = audioRef.current
    audio.src = podcast.audio

    const setAudioData = () => {
      setDuration(audio.duration)
      setCurrentTime(audio.currentTime)
    }

    const setAudioTime = () => setCurrentTime(audio.currentTime)

    audio.addEventListener('loadeddata', setAudioData)
    audio.addEventListener('timeupdate', setAudioTime)

    return () => {
      audio.removeEventListener('loadeddata', setAudioData)
      audio.removeEventListener('timeupdate', setAudioTime)
      audio.pause()
    }
  }, [podcast])

  useEffect(() => {
    audioRef.current.volume = volume
    audioRef.current.muted = isMuted
  }, [volume, isMuted])

  useEffect(() => {
    if (!userSubscription && user && listeningStartTime) {
      const timeElapsed = (Date.now() - listeningStartTime) / 1000 // in seconds
      if (timeElapsed >= 300) { // 5 minutes = 300 seconds
        audioRef.current.pause()
        setIsPlaying(false)
        setCurrentPodcast(null)
        alert("Your 5-minute preview has ended. Please subscribe to continue listening.")
      }
    }
  }, [currentTime, userSubscription, user, listeningStartTime, setCurrentPodcast])

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = (newTime) => {
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume[0])
    setIsMuted(false)
  }

  const toggleMute = () => setIsMuted(!isMuted)

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center space-x-4">
          <Image src={podcast.image} alt={podcast.title} width={60} height={60} className="rounded-md" />
          <div>
            <h3 className="font-semibold">{podcast.title}</h3>
            <p className="text-sm text-gray-500">{podcast.host}</p>
          </div>
        </div>
        <div className="flex-1 mx-4">
          <Slider
            value={[currentTime]}
            max={duration}
            step={1}
            onValueChange={(newTime) => handleTimeUpdate(newTime[0])}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={togglePlayPause}>
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={toggleMute}>
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-24"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function LoginModal({ isOpen, onClose, onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onLogin(username, password)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">Login</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function SignupModal({ isOpen, onClose, onSignup }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSignup(username, password)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign Up</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">Sign Up</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function SubscriptionPlans({ onSubscribe }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map(plan => (
        <Card key={plan.id}>
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold mb-4">{plan.price}</p>
            <ul className="list-disc list-inside mb-4">
              {plan.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <Button 
              onClick={() => onSubscribe(plan)} 
              className="w-full"
            >
              Subscribe
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function UploadPodcastModal({ isOpen, onClose, onUpload, categories }) {
  const [newPodcast, setNewPodcast] = useState({
    title: "",
    host: "",
    category: "",
    image: "",
    audio: "",
    description: ""
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpload(newPodcast)
    setNewPodcast({
      title: "",
      host: "",
      category: "",
      image: "",
      audio: "",
      description: ""
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setNewPodcast(prev => ({ ...prev, [name]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload New Podcast</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Title"
            name="title"
            value={newPodcast.title}
            onChange={handleChange}
            required
          />
          <Input
            placeholder="Host"
            name="host"
            value={newPodcast.host}
            onChange={handleChange}
            required
          />
          <Select name="category" onValueChange={(value) => setNewPodcast(prev => ({ ...prev, category: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Image URL"
            name="image"
            value={newPodcast.image}
            onChange={handleChange}
            required
          />
          <Input
            placeholder="Audio URL"
            name="audio"
            value={newPodcast.audio}
            onChange={handleChange}
            required
          />

          <Button type="submit" className="w-full">Upload Podcast</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function AdminPanel({ podcasts, setPodcastsData }) {
  const handleDelete = (id) => {
    setPodcastsData(podcasts.filter(podcast => podcast.id !== id))
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {podcasts.map(podcast => (
          <Card key={podcast.id}>
            <CardHeader>
              <CardTitle>{podcast.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Host: {podcast.host}</p>
              <p>Category: {podcast.category}</p>
              <Button 
                onClick={() => handleDelete(podcast.id)} 
                variant="destructive"
                className="mt-2"
              >
                Delete Podcast
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function PodcastWebsite() {
  const [podcastsData, setPodcastsData] = useState(initialPodcastsData)
  const  [currentPodcast, setCurrentPodcast] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredPodcasts, setFilteredPodcasts] = useState(podcastsData)
  const [user, setUser] = useState(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [userSubscription, setUserSubscription] = useState(null)
  const [listeningStartTime, setListeningStartTime] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => {
    const filteredResults = podcastsData.filter(podcast => 
      (podcast.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      podcast.host.toLowerCase().includes(searchQuery.toLowerCase()) ||
      podcast.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!selectedCategory || podcast.category === selectedCategory)
    )
    setFilteredPodcasts(filteredResults)
  }, [searchQuery, podcastsData, selectedCategory])

  const handleLogin = (username, password) => {
    if (username === "Priyanshu" && password === "Priyanshu") {
      setUser({ username, isAdmin: true })
    } else {
      setUser({ username, isAdmin: false })
    }
    setShowLoginModal(false)
  }

  const handleSignup = (username, password) => {
    setUser({ username, isAdmin: false })
    setShowSignupModal(false)
  }

  const handleLogout = () => {
    setUser(null)
    setUserSubscription(null)
    setCurrentPodcast(null)
  }

  const handlePodcastClick = (podcast) => {
    if (user) {
      setCurrentPodcast(podcast)
      setListeningStartTime(Date.now())
    } else {
      setShowLoginModal(true)
    }
  }

  const handleSubscribe = (plan) => {
    setUserSubscription(plan)
  }

  const handleUpload = (newPodcast) => {
    setPodcastsData([...podcastsData, { ...newPodcast, id: podcastsData.length + 1 }])
    setShowUploadModal(false)
  }

  const renderPodcastList = (podcasts) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {podcasts.map(podcast => (
        <Card key={podcast.id} className="overflow-hidden">
          <Image src={podcast.image} alt={podcast.title} width={400} height={400} className="w-full h-48 object-cover" />
          <CardContent className="p-4">
            <CardTitle>{podcast.title}</CardTitle>
            <p className="text-sm text-gray-500">{podcast.host}</p>
            <p className="text-sm mt-2">{podcast.description}</p>
            <p className="text-sm font-semibold mt-1">Category: {podcast.category}</p>
            <Button 
              className="mt-2 w-full" 
              onClick={() => handlePodcastClick(podcast)}
            >
              Listen Now
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Headphones className="h-6 w-6" />
            <span className="font-bold">PodcastHub</span>
          </Link>
          <nav className="ml-auto flex items-center space-x-4">
            <Input
              type="search"
              placeholder="Search podcasts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[200px] sm:w-[300px]"
            />
            {user ? (
              <>
                {user.isAdmin && (
                  <Button variant="ghost" size="sm" onClick={() => setShowUploadModal(true)}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => setShowLoginModal(true)}>
                  <User className="mr-2 h-4 w-4" />
                  Login
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowSignupModal(true)}>
                  Sign Up
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="container py-6">
        <Tabs defaultValue="featured">
          <TabsList>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="all">All Podcasts</TabsTrigger>
            {user && !userSubscription && <TabsTrigger value="plans">Subscription Plans</TabsTrigger>}
          </TabsList>
          <TabsContent value="featured">
            <h2 className="text-2xl font-bold mb-4">Featured Podcasts</h2>
            {renderPodcastList(filteredPodcasts.slice(0, 3))}
          </TabsContent>
          <TabsContent value="categories">
            <h2 className="text-2xl font-bold mb-4">Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              {categories.map(category => (
                <Card 
                  key={category.id} 
                  className={`${category.color} cursor-pointer ${selectedCategory === category.name ? 'ring-2 ring-purple-600' : ''}`}
                  onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
                >
                  <CardHeader className="flex flex-col items-center">
                    <div className="h-8 w-8 mb-2">{category.icon}</div>
                    <CardTitle className="text-center text-sm">{category.name}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
            {renderPodcastList(filteredPodcasts)}
          </TabsContent>
          <TabsContent value="all">
            <h2 className="text-2xl font-bold mb-4">All Podcasts</h2>
            {renderPodcastList(filteredPodcasts)}
          </TabsContent>
          {user && !userSubscription && (
            <TabsContent value="plans">
              <h2 className="text-2xl font-bold mb-4">Subscription Plans</h2>
              <SubscriptionPlans onSubscribe={handleSubscribe} />
            </TabsContent>
          )}
        </Tabs>
      </main>

      {currentPodcast && (
        <AudioPlayer
          podcast={currentPodcast}
          user={user}
          userSubscription={userSubscription}
          listeningStartTime={listeningStartTime}
          setCurrentPodcast={setCurrentPodcast}
        />
      )}

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onLogin={handleLogin}
      />

      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSignup={handleSignup}
      />

      <UploadPodcastModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
        categories={categories}
      />

      {user && user.isAdmin && <AdminPanel podcasts={podcastsData} setPodcastsData={setPodcastsData} />}
    </div>
  )
}
