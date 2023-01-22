export type CloudinaryType = {
  access_mode: string;
  asset_id: string;
  bytes: number;
  created_at: string;
  etag: string;
  folder: string;
  format: string;
  height: number;
  original_filename: string;
  placeholder: false;
  public_id: string;
  resource_type: string;
  secure_url: string;
  signature: string;
  tags: [];
  type: string;
  url: string;
  version: number;
  version_id: string;
  width: number;
};

export interface Post<T> {
  id: string;
  name: string;
  message: string;
  selectedFile: SelectedFileType[];
  user: T;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  isLike: boolean;
  _count: {
    likes: number;
    comment: number;
  };
}

export interface Comment<T> {
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  id: string;
  postId: string;
  userId: string;
  user?: T;
}

export interface User {
  email: string;
  id: string;
  name: string;
  coverPhoto?: string;
  image?: string;
}

export interface SelectedFileType {
  url: string;
  width: number;
  height: number;
  fallbackUrl: string;
  id: string;
  postId: string;
}
