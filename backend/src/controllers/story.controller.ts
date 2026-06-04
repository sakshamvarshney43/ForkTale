import { Response } from "express";
import { z } from "zod";
import { AuthRequest } from "../middlewares/auth.middleware";
import prisma from "../config/db";

//Validation

const createStorySchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
  genre: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const updateStorySchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  genre: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
});

//Create Story

export const createStory = async (req: AuthRequest, res: Response) => {
  try {
    const parsed = createStorySchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.errors[0].message,
      });
    }

    const { title, description, genre, tags } = parsed.data;

    //create story
    const story = await prisma.story.create({
      data: {
        title,
        description,
        genre,
        tags: tags || [],
        authorId: req.user!.id,

        //Default branch
        branches: {
          create: {
            name: "main",
            isDefault: true,
          },
        },
      },

      include: {
        branches: true,

        author: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return res.status(201).json({
      message: "Story created.",
      story,
    });
  } catch (error) {
    console.error("CreateStory Error:", error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

//Dashboard

export const getMyStories = async (req: AuthRequest, res: Response) => {
  try {
    const stories = await prisma.story.findMany({
      where: {
        authorId: req.user!.id,
      },

      include: {
        branches: {
          select: {
            id: true,
            name: true,
            isDefault: true,
          },
        },

        _count: {
          select: {
            branches: true,
            collaborators: true,
            forks: true,
          },
        },
      },

      orderBy: {
        updatedAt: "desc",
      },
    });

    return res.status(200).json({
      stories,
    });
  } catch (error) {
    console.error("GetMyStories error:", error);

    return res.status(500).json({
      message: "Server error.",
    });
  }
};

//Get Single Story

export const getStory = async (
  req: AuthRequest & { params: { storyId: string } },
  res: Response,
) => {
  try {
    const storyId = req.params.storyId;

    const story = await prisma.story.findUnique({
      where: {
        id: storyId,
      },

      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },

        branches: {
          select: {
            id: true,
            name: true,
            isDefault: true,
            latestCommitId: true,
            createdAt: true,
          },
        },

        collaborators: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                avatar: true,
              },
            },
          },
        },

        forkedFrom: {
          select: {
            id: true,
            title: true,

            author: {
              select: {
                username: true,
              },
            },
          },
        },

        _count: {
          select: {
            forks: true,
            branches: true,
          },
        },
      },
    });

    if (!story) {
      return res.status(404).json({
        message: "Story not found.",
      });
    }

    //if private story allow only author and collaborator
    if (!story.isPublished) {
      const isAuthor = story.authorId === req.user?.id;

      const isCollaborator =
        (story as any).collaborators?.some(
          (c: any) => c.userId === req.user?.id,
        ) ?? false;

      if (!isAuthor && !isCollaborator) {
        return res.status(403).json({
          message: "This story is private",
        });
      }
    }

    return res.status(200).json({
      story,
    });
  } catch (error) {
    console.error("GetStory error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

//Update Story

export const updateStory = async (
  req: AuthRequest & { params: { storyId: string } },
  res: Response,
) => {
  try {
    const storyId = req.params.storyId;

    const parsed = updateStorySchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.errors[0].message,
      });
    }

    // Check ownership
    const story = await prisma.story.findUnique({
      where: {
        id: storyId,
      },
    });

    if (!story) {
      return res.status(404).json({
        message: "Story not found.",
      });
    }

    if (story.authorId !== req.user!.id) {
      return res.status(403).json({
        message: "Not your story.",
      });
    }

    const updated = await prisma.story.update({
      where: {
        id: storyId,
      },

      data: parsed.data,
    });

    return res.status(200).json({
      message: "Story updated",
      story: updated,
    });
  } catch (error) {
    console.error("UpdateStory error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

//Delete Story

export const deleteStory = async (
  req: AuthRequest & { params: { storyId: string } },
  res: Response,
) => {
  try {
    const storyId = req.params.storyId;

    const story = await prisma.story.findUnique({
      where: {
        id: storyId,
      },
    });

    if (!story) {
      return res.status(404).json({
        message: "Story not found.",
      });
    }

    if (story.authorId !== req.user!.id) {
      return res.status(403).json({
        message: "Not your story",
      });
    }

    await prisma.story.delete({
      where: {
        id: storyId,
      },
    });

    return res.status(200).json({
      message: "Story deleted",
    });
  } catch (error) {
    console.error("DeleteStory error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

//Upload Cover Image

export const uploadCover = async (
  req: AuthRequest & { params: { storyId: string } },
  res: Response,
) => {
  try {
    const storyId = req.params.storyId;

    if (!req.file) {
      return res.status(400).json({
        message: "No image id provided",
      });
    }

    const story = await prisma.story.findUnique({
      where: {
        id: storyId,
      },
    });

    if (!story) {
      return res.status(404).json({
        message: "Story not found",
      });
    }

    if (story.authorId !== req.user!.id) {
      return res.status(403).json({
        message: "Not your story.",
      });
    }

    const imageUrl = (req.file as any).path;

    const updated = await prisma.story.update({
      where: {
        id: storyId,
      },

      data: {
        coverImage: imageUrl,
      },
    });

    return res.status(200).json({
      message: "Cover image uploaded.",
      story: updated,
    });
  } catch (error) {
    console.error("Upload Cover Error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// Browse all published stories

export const discoverStories = async (req: AuthRequest, res: Response) => {
  try {
    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;

    const genre =
      typeof req.query.genre === "string" ? req.query.genre : undefined;

    const sort = typeof req.query.sort === "string" ? req.query.sort : "latest";

    const stories = await prisma.story.findMany({
      where: {
        isPublished: true,

        ...(search && {
          OR: [
            {
              title: {
                contains: search,
                mode: "insensitive",
              },
            },

            {
              description: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }),

        ...(genre && {
          genre,
        }),
      },

      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },

        _count: {
          select: {
            forks: true,
            branches: true,
          },
        },
      },

      orderBy: sort === "latest" ? { createdAt: "desc" } : { createdAt: "asc" },
    });

    const storiesWithRatings = await Promise.all(
      stories.map(async (story) => {
        const publishings = await prisma.publishing.findMany({
          where: {
            branch: {
              storyId: story.id,
            },
            isActive: true,
          },
        });

        const publishingIds = publishings.map((p) => p.id);

        const ratings = await prisma.rating.findMany({
          where: {
            publishingId: {
              in: publishingIds,
            },
          },
        });

        const avgRating =
          ratings.length > 0
            ? ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length
            : 0;

        return {
          ...story,
          avgRating: Math.round(avgRating * 10) / 10,
          totalRatings: ratings.length,
        };
      }),
    );

    return res.status(200).json({
      stories: storiesWithRatings,
    });
  } catch (error) {
    console.error("DiscoverStories error:", error);

    return res.status(500).json({
      message: "Server error.",
    });
  }
};
