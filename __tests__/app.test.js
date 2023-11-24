const request = require("supertest");
const app = require("../db/app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const topicData = require("../db/data/test-data");
const topics = require("../db/data/test-data/topics");
const articles = require("../db/data/test-data/articles");
const endpointsValue = require("../endpoints.json");



require("jest-sorted");

beforeEach(() => {
  return seed(topicData);
});

afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("200: responds with an array of topics object", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });
  test("404: responds with an error message for a not found path", () => {
    return request(app)
      .get("/api/notatopic")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path not found");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: responds with the article by the article id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.article_id).toBe(1);
        expect(articles).toMatchObject({
          title: expect.any(String),
          topic: expect.any(String),
          article_id: 1,
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test("404: responds with an error message for a not found path", () => {
    return request(app)
      .get("/api/articles/200")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
  test("400: responds with an error message for a bad request", () => {
    return request(app)
      .get("/api/articles/nonarticle")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api", () => {
  test("200: responds with an object describing all the availbale endpoints on the API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const { endpoints } = body;
        Object.keys(endpointsValue).forEach((endpointKey) => {
          expect(endpoints[endpointKey]).toEqual(endpointsValue[endpointKey]);
        });
      });
  });
});
describe("GET /api/articles", () => {
  test("200: responds with an array of article object", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("404: responds with an error message for a not found path", () => {
    return request(app)
      .get("/api/article")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path not found");
      });
  });
});
describe("POST /api/articles/:article_id/comments", () => {
  test("201: responds with the newly posted comment to a given article", () => {
    const newComment = {
      username: "butter_bridge",
      comment: "testing comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { postedComment } = body;
        expect(postedComment.article_id).toBe(1);
        expect(postedComment.body).toBe(newComment.comment);
      });
  });
  test("400: responds with an error message if the article_id is invalid", () => {
    const newComment = {
      username: "butter_bridge",
      comment: "testing comment",
    };
    return request(app)
      .post("/api/articles/notnumber/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: responds with an error message if the username does not exist", () => {
    const newComment = { username: "test name", comment: "testing comment" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("username not found");
      });
  });
  test("404: responds with an error message for a not found article", () => {
    const newComment = { username: "test name", comment: "testing comment" };
    return request(app)
      .post("/api/article/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path not found");
      });
  });
  test("404: responds with an error message for a path", () => {
    const newComment = { username: "butter_bridge", comment: "testing comment" };
    return request(app)
      .post("/api/articles/1/comment")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200 : responds with an updated object with incremented votes given by user at the article_id", () => {
    const newVotes = 10;
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: newVotes })
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.votes).toBe(110);
        expect(article).toMatchObject({
          article_id: 1,
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          article_img_url: expect.any(String),
          votes: expect.any(Number),
        });
      });
  });
  test("200 : responds with an updated object with decremented votes given by user at the article_id", () => {
    const newVotes = -10;
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: newVotes })
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.votes).toBe(90);
        expect(article).toMatchObject({
          article_id: 1,
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          article_img_url: expect.any(String),
          votes: expect.any(Number),
        });
      });
  });
  test("200 : responds with an updated object with decremented votes can be 0", () => {
    const newVotes = -100;
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: newVotes })
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.votes).toBe(0);
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          article_img_url: expect.any(String),
          votes: expect.any(Number),
        });
      });
  });
  test("400 : responds with an error message when inc_votes is not an number", () => {
    const newVotes = "hello";
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: newVotes })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("400 : responds with an error message when inc_votes is higher than the votes in article", () => {
    const newVotes = -200;
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: newVotes })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400 : responds with an error message when inc_votes is 0", () => {
    const newVotes = 0;
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: newVotes })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400 : responds with an error message when article_id is not an number", () => {
    const newVotes = 2;
    return request(app)
      .patch("/api/articles/hi")
      .send({ inc_votes: newVotes })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404 : responds with an error message when article_id does not exist", () => {
    const newVotes = 2;
    return request(app)
      .patch("/api/articles/200")
      .send({ inc_votes: newVotes })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});


describe("DELETE /api/comments/:comment_id", () => {
  test("204: responds with an status 204 and no content", () => {
    return request(app)
    .delete("/api/comments/1")
    .expect(204);
  });
  test('400:responds with an error message when the comment_id is not an number', ()=>{
    return request(app)
    .delete("/api/comments/notannumber")
    .expect(400)
    .then(({body})=>{
        expect(body.msg).toBe('Bad request')
    })
  })
  test('404: responds with an error message when the comment_id does not exist', ()=>{
    return request(app)
    .delete("/api/comments/2000")
    .expect(404)
    .then(({body})=>{
        expect(body.msg).toBe('not found')
    })
  })
});

describe('GET /api/users', ()=>{
    test('200: responds with an array of users object', ()=>{
        return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(4);
        const {users} = body
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String)
          });
        });
      });
  });
    test("404: responds with an error message for a not found path", () => {
        return request(app)
          .get("/api/notauser")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("path not found");
          });
      });
    })

