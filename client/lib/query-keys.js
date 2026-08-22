export const queryKeys = {
    user: (username) => ["user", username],
    allUsers: () => ["user"],
    follow: (userId) => ["follow", userId],
    article: (slug) => ["article", slug],
    allArticles: () => ["articles"],
    articleList: (params = {}) => ["articles", params],
    comments: (articleId) => ["comments", articleId],
    likes: (articleId) => ["likes", articleId],
    save: (articleId) => ["save", articleId],
    lists: (authorId) => ["lists", authorId],
    userSaves: (userId) => ["userSaves", userId],
    userViews: (userId) => ["userViews", userId],
};