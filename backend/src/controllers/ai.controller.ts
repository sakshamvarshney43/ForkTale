import { Response } from "express";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AuthRequest } from "../middlewares/auth.middleware";
import prisma from "../config/db";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const aiRequestSchema = z.object({
  content: z.string().min(1, "Content is required"),
  genre: z.string().optional(),
});

//Helper
const buildContext = (content: string, genre?: string): string => {
  return `You are a creative writing assistant for ForkTale, a collaborative storytelling platform. ${genre ? `The story genre is ${genre}.` : ""}
    Here is the current story content:
    """
    ${content}
    """`;
};

// Suggestion of nxt part

export const suggestNext = async (req: AuthRequest, res: Response) => {
  try {
    const parsed = aiRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.issues[0].message,
      });
    }

    const { content, genre } = parsed.data;

    //set steaming header
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const prompt = `${buildContext(content, genre)}
        Continue this story naturally. Write the next 2-3 paragraphs that flow seamlessly from where it left off. Match the tone, style and voice of the existing content. Only return the continuation, nothing else.`;

    const result = await model.generateContentStream(prompt);

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        res.write(`data:${JSON.stringify({ text })}\n\n`);
      }
    }
    res.write("data:[DONE]\n\n");
    res.end();
  } catch (error) {
    console.error("SuggestNext error", error);
    res.write(`data:${JSON.stringify({ error: "AI error Occured" })}\n\n`);
    res.end();
  }
};

//Suggest plot twist
export const suggestTwist = async (req: AuthRequest, res: Response) => {
  try {
    const parsed = aiRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.issues[0].message,
      });
    }
    const { content, genre } = parsed.data;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const prompt = `${buildContext(content, genre)}

    Suggest 3 unexpected but believable plot twists that could happen next in this story. Each twist should:
    - Be surprising but make sense given the story so far
    - Open up new narrative possibilities  
    - Be 2-3 sentences each

    Format exactly as:
    Twist 1: ...
    Twist 2: ...
    Twist 3: ...`;

    const result = await model.generateContentStream(prompt);

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        res.write(`data:${JSON.stringify({ text })}\n\n`);
      }
    }

    res.write("data:[DONE]\n\n");
    res.end();
  } catch (error) {
    console.error("SuggestTwistError:", error);
    res.write(`data:${JSON.stringify({ error: "AI error occured." })}\n\n`);
    res.end();
  }
};

//Improve Writing
export const improveWriting = async (req: AuthRequest, res: Response) => {
  try {
    const parsed = aiRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.issues[0].message,
      });
    }

    const { content } = parsed.data;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const prompt = `You are a professional editor. Improve the following story content by:
- Enhancing descriptive language and imagery
- Improving sentence flow and rhythm
- Strengthening character voice
- Fixing any awkward phrasing

Keep the same plot, events and meaning. Only return the improved version, nothing else.

Content to improve:
"""
${content}
"""`;

    const result = await model.generateContentStream(prompt);

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error("ImproveWriting error:", error);
    res.write(`data: ${JSON.stringify({ error: "AI error occurred." })}\n\n`);
    res.end();
  }
};

//Fix Grammar(not streamed-fast)
export const fixGrammar = async (req: AuthRequest, res: Response) => {
  try {
    const parsed = aiRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.issues[0].message,
      });
    }

    const { content } = parsed.data;

    const prompt = `Fix all grammar, spelling and punctuation errors in the following text.
Do not change the style, tone or content in any way.
Only return the corrected text, nothing else.

Text:
"""
${content}
"""`;

    const result = await model.generateContent(prompt);
    const fixed = result.response.text();

    return res.status(200).json({ fixed });
  } catch (error) {
    console.error("FixGrammar error:", error);
    return res.status(500).json({ message: "AI error occurred." });
  }
};

//Generate Branch Summary (not streamed)

export const generateSummary = async (req: AuthRequest, res: Response) => {
  try {
    const { branchId } = req.params;

    const commits = await prisma.commit.findMany({
      where: { branchId: branchId as string },
      orderBy: { createdAt: "asc" },
      select: { content: true },
    });

    if (commits.length === 0) {
      return res.status(400).json({
        message: "No content to summarise",
      });
    }

    //Combine all content
    const fullContent = commits.map((c) => c.content).join("\n\n");

    //Shortent the output if too long for free tier
    const truncated =
      fullContent.length > 8000
        ? fullContent.substring(0, 8000) + "..."
        : fullContent;

    const prompt = `Write a concise 4-7 sentence summary of this story branch.
       Cover the main plot points, key characters and where the story currently stands.
       Only return the summary, nothing else.

       Story content:
       """
       ${truncated}
       """`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    return res.status(200).json({ summary });
  } catch (error) {
    console.error("GenerateSummary Error", error);
    return res.status(500).json({ message: "AI error Occurred" });
  }
};
