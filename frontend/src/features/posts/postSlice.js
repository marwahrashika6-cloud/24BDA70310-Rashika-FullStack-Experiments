import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  drafts: [],
};

const postSlice = createSlice({
  name: "posts",
  initialState,

  reducers: {
    // Load data from localStorage
    setPosts: (state, action) => {
      state.posts = action.payload;
    },

    setDrafts: (state, action) => {
      state.drafts = action.payload;
    },

    // Add a new published post
    addPost: (state, action) => {
      state.posts.unshift(action.payload);
    },

    // Delete a published post
    deletePost: (state, action) => {
      state.posts = state.posts.filter(
        (post) => post.id !== action.payload
      );
    },

    // Save a draft
    saveDraft: (state, action) => {
      state.drafts.unshift(action.payload);
    },

    // Delete a draft
    deleteDraft: (state, action) => {
      state.drafts = state.drafts.filter(
        (draft) => draft.id !== action.payload
      );
    },

    // Publish a draft
    publishDraft: (state, action) => {
      const draft = state.drafts.find(
        (d) => d.id === action.payload
      );

      if (draft) {
        state.posts.unshift(draft);

        state.drafts = state.drafts.filter(
          (d) => d.id !== action.payload
        );
      }
    },
  },
});

export const {
  setPosts,
  setDrafts,
  addPost,
  deletePost,
  saveDraft,
  deleteDraft,
  publishDraft,
} = postSlice.actions;

export default postSlice.reducer;