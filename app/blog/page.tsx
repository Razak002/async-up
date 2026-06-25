"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { ArrowRight, Clock, User, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { blogData } from "@/lib/blog-data";

export default function BlogPage() {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribing(false);
      setEmail("");
      toast.success("Subscribed to the newsletter!", {
        description: "Keep an eye on your inbox for our weekly insights.",
        icon: <Sparkles className="w-4 h-4 text-[#f3d773]" />,
      });
    }, 1500);
  };

  const featuredPost = blogData[0];
  const recentPosts = blogData.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col">
      <Navbar />
      
      <main className="flex-1 pb-20 sm:pb-32">
        {/* Header */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight mb-6">
            The Async Work <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f3d773] to-[#e6b800]">Journal</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Insights, guides, and stories on building productive, asynchronous, and distributed teams.
          </p>
        </section>

        {/* Featured Post */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <Link href={`/blog/${featuredPost.slug}`} className="group block">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/50 bg-card transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-primary/10">
              <div className="grid md:grid-cols-2">
                <div className="relative aspect-video md:aspect-auto bg-muted overflow-hidden">
                  <Image 
                    src={featuredPost.image!} 
                    alt={featuredPost.title} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105" 
                    priority 
                  />
                </div>
                <div className="p-8 sm:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-[#f3d773]/10 text-[#f3d773]">
                      {featuredPost.category}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {featuredPost.readTime}
                    </span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 group-hover:text-[#f3d773] transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{featuredPost.author}</p>
                        <p className="text-xs text-muted-foreground">{featuredPost.date}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-[#f3d773] transition-colors group-hover:translate-x-2 transform duration-300" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </section>

        {/* Recent Posts Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <h3 className="text-2xl font-bold text-foreground mb-8">Latest Articles</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post, idx) => (
              <Link key={idx} href={`/blog/${post.slug}`} className="group h-full">
                <div className="h-full flex flex-col rounded-2xl border border-border/50 bg-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30">
                  <div className={`h-48 relative bg-muted overflow-hidden`}>
                     <Image 
                       src={post.image!} 
                       alt={post.title} 
                       fill 
                       className="object-cover transition-transform duration-500 group-hover:scale-105" 
                     />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                        {post.category}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground">
                        {post.readTime}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    <p className="text-muted-foreground mb-6 line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                      <span className="text-sm text-muted-foreground">{post.date}</span>
                      <span className="text-sm font-medium text-primary flex items-center group-hover:underline">
                        Read <ArrowRight className="w-4 h-4 ml-1" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card border border-border/50 rounded-3xl p-10 sm:p-16 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#f3d773]/10 to-transparent pointer-events-none" />
            
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#f3d773]/10 mb-6 relative z-10">
              <Mail className="w-8 h-8 text-[#f3d773]" />
            </div>
            
            <h2 className="text-3xl font-bold text-foreground mb-4 relative z-10">
              Subscribe to the Async Newsletter
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto relative z-10">
              Get weekly insights on engineering productivity, remote culture, and the future of work delivered straight to your inbox.
            </p>
            
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto relative z-10 flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-[#f3d773]/50 transition-shadow"
              />
              <Button 
                type="submit" 
                disabled={isSubscribing}
                className="h-[50px] px-8 bg-primary hover:bg-primary/90 rounded-xl whitespace-nowrap"
              >
                {isSubscribing ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-4 relative z-10">
              No spam. Unsubscribe at any time.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
