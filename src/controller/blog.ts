import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { PAGE_DEFAULT, PAGE_SIZE } from "../constants/string";
import Blog from "../models/Blog";
import { SortBaseRequest } from "../types/base";
import { BlogHandler } from "../types/blog";
import { generateRegexFindObject, generateSortObject } from "../utils/query";

export const createBlogController: RequestHandler = async (req, res, next) => {
  const {
    title,
    short_description,
    description,
    cover_url,
    is_comments,
    is_publish,
    meta_title,
    tags,
  } = req.body as BlogHandler;

  try{
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return res.status(422).json({
        message: validation.array()[0].msg,
        code: 422,
        errors: validation.array()
      })
    };
    const blog = new Blog({
      title,
      short_description,
      description,
      cover_url,
      is_comments,
      is_publish,
      meta_title,
      tags,
      object_id: req.userId
    });
    await blog.save();
    res.json({
      message: 'Successfully',
      code: 200
    });
  }catch(err) {
    next(err);
  }
};

export const getTagController: RequestHandler = async (req, res, next) => {
  const { q } = req.query;
  try{
    
    const blogsMatchQuery = await Blog.find({ tags: { $regex: q, $options: 'i' } });
    const getTags = blogsMatchQuery.reduce<Array<string>>((acc, item) => {
      const filterTags = item.tags?.filter(value => {
        return value.toLowerCase().includes((q as string).toLowerCase());
      })
      return [...acc, ...(filterTags || [])];
    }, []);
    res.json({
      message: 'successfully',
      code: 200,
      data: getTags
    })
  }catch(err) {
    next(err);
  }
}

export const getBlogController: RequestHandler = async (req, res, next) => {
  const { key, page = PAGE_DEFAULT, page_size = PAGE_SIZE, query, sort, value } = req.query as SortBaseRequest;

  try{
    const sortObject = generateSortObject(key, sort);
    const filterObject = generateRegexFindObject(query, value);

    const blog = await Blog.find(filterObject).sort(sortObject).skip((+page - 1) * page_size).limit(page_size);
    const totalBlogs = await Blog.find(filterObject).sort(sortObject).countDocuments()
    res.json({
      message: 'successfully',
      code: 200,
      data: blog,
      total: totalBlogs
    })
  }catch(err) {
    next(err);
  }
};

export const getBlogByIdController: RequestHandler = async (req, res , next) => {
  const { id } = req.params;
  if (!id) {
    return res.status(404).json({
      message: 'Blog not found',
      code: 404
    })
  };
  try{
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        message: 'Blog is not existed',
        code: 404
      })
    };
    res.json({
      message: 'successfully',
      code: 200,
      data: blog
    });
  }catch(err) {
    next(err);
  }
}