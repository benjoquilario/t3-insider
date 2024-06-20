interface IPostValues {
  content: string
  selectedFile: File[]
}

interface ISelectedFile {
  url: string
  postId?: string
  id?: string
  key: string
}

interface IPost<T> {
  id: string
  name: string
  content: string
  selectedFile: ISelectedFile[]
  user: T
  userId: string
  createdAt: Date
  updatedAt: Date
  isLiked: boolean
  _count: {
    likePost: number
    comment: number
  }
  likePost: LikePost<T>[]
}

interface IComment<T> {
  id: string
  isEdited: boolean
  comment: string
  user: T
  userId: string
  createdAt: Date
  updatedAt: Date
  isLiked: boolean
  _count: {
    commentLike: number
  }
}

interface LikePost<T> {
  id: string
  postId: string
  user: T
}

interface IPage<T> {
  posts: T
  hasNextPage: boolean
  nextSkip: number
}

interface ICommentPage<T> {
  comments: T
  hasNextPage: boolean
  nextSkip: number
}

interface ICreatePost {
  content: string
  selectedFile: ISelectedFile[] | null
}

interface IUpdatePost extends ICreatePost {
  postId: string
}

interface ICreateComment {
  commentText: string
  postId: string
}

interface IUpdateComment extends ICreateComment {
  commentId: string
}
