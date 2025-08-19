import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json()

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      system: `You are an AI assistant that helps categorize thoughts and notes for people with ADHD. 
      
      Analyze the given text and categorize it into one of these categories:
      - Task: Action items, things to do, work-related items
      - Idea: Creative thoughts, innovations, concepts, brainstorming
      - Reminder: Things to remember, appointments, deadlines
      - Goal: Aspirations, objectives, long-term plans
      - Thought: Random thoughts, observations, reflections
      - Question: Things to research, questions to ask, curiosities
      - Articles: Article links, reading materials, blog posts
      - Notes: General notes, meeting notes, lecture notes
      - Images: References to images, photos, visual content
      - Bookmarks: Links to save, websites to remember, resources
      - Inspiration: Motivational content, quotes, creative inspiration
      - Other: Anything that doesn't fit the above categories
      
      Respond with ONLY the category name, nothing else.`,
      prompt: `Categorize this text: "${content}"`,
    })

    const category = text.trim()

    // Validate the category
    const validCategories = ["Task", "Idea", "Reminder", "Goal", "Thought", "Question", "Articles", "Notes", "Images", "Bookmarks", "Inspiration", "Other"]
    const finalCategory = validCategories.includes(category) ? category : "Other"

    return NextResponse.json({ category: finalCategory })
  } catch (error) {
    console.error("Error categorizing content:", error)
    return NextResponse.json({ category: "Other" })
  }
}
