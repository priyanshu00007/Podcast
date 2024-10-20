import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Mic, Headphones, Play } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  const featuredPodcasts = [
    { id: 1, title: "The Daily Buzz", host: "Sarah Johnson", image: "/placeholder.svg?height=400&width=600" },
    { id: 2, title: "Tech Talk", host: "Mike Chen", image: "/placeholder.svg?height=400&width=600" },
    { id: 3, title: "History Unveiled", host: "Emma Thompson", image: "/placeholder.svg?height=400&width=600" },
  ]

  const categories = [
    { id: 1, name: "News & Politics", icon: Mic },
    { id: 2, name: "Technology", icon: Headphones },
    { id: 3, name: "Business", icon: Mic },
    { id: 4, name: "Science", icon: Headphones },
    { id: 5, name: "Arts", icon: Mic },
    { id: 6, name: "Sports", icon: Headphones },
  ]

  const popularPodcasts = [
    { id: 1, title: "The Joe Rogan Experience", host: "Joe Rogan", image: "/placeholder.svg?height=300&width=300" },
    { id: 2, title: "Serial", host: "Sarah Koenig", image: "/placeholder.svg?height=300&width=300" },
    { id: 3, title: "This American Life", host: "Ira Glass", image: "/placeholder.svg?height=300&width=300" },
    { id: 4, title: "Radiolab", host: "Jad Abumrad", image: "/placeholder.svg?height=300&width=300" },
  ]

  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Discover Your Next Favorite Podcast
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Explore thousands of podcasts on various topics. Start listening now and expand your knowledge.
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild>
                <Link href="/categories">Browse Podcasts</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/learn-more">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">Featured Podcasts</h2>
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {featuredPodcasts.map((podcast) => (
                <CarouselItem key={podcast.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <Image
                          src={podcast.image}
                          alt={podcast.title}
                          width={300}
                          height={300}
                          className="rounded-md object-cover"
                        />
                      </CardContent>
                      <CardFooter className="flex flex-col items-start">
                        <h3 className="text-lg font-semibold">{podcast.title}</h3>
                        <p className="text-sm text-muted-foreground">Hosted by {podcast.host}</p>
                      </CardFooter>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Card key={category.id} className="flex flex-col items-center justify-center p-4 hover:bg-muted cursor-pointer transition-colors">
                <category.icon className="h-12 w-12 mb-2" />
                <CardTitle className="text-center">{category.name}</CardTitle>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">Popular Podcasts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularPodcasts.map((podcast) => (
              <Card key={podcast.id} className="flex flex-col">
                <CardContent className="p-4">
                  <Image
                    src={podcast.image}
                    alt={podcast.title}
                    width={300}
                    height={300}
                    className="rounded-md object-cover w-full aspect-square mb-4"
                  />
                  <h3 className="text-lg font-semibold mb-1">{podcast.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">Hosted by {podcast.host}</p>
                  <Button className="w-full" asChild>
                    <Link href={`/podcast/${podcast.id}`}>
                      <Play className="mr-2 h-4 w-4" /> Listen Now
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}