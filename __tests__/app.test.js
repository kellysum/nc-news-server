const request = require("supertest")
const app = require("../db/app")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const topicData = require("../db/data/test-data")
const topics = require("../db/data/test-data/topics")
const articles = require("../db/data/test-data/articles")
const endpointsValue = require("../endpoints.json")
require("jest-sorted")

beforeEach(()=>{
    return seed(topicData)
})

afterAll(()=> db.end());

describe("GET /api/topics", ()=>{
    test("200: responds with an array of topics object", ()=>{
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({body})=>{
            expect(body.topics.length).toBe(3);
            topics.forEach((topic)=>{
               expect(topic).toMatchObject({ 
                description:expect.any(String),
                slug:expect.any(String)

                }) 
            })
        })
        })
        test('404: responds with an error message for a not found path', ()=>{
            return request(app)
            .get("/api/topic")
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("path not found")
            })
        })
    })

describe("GET /api/articles/:article_id", ()=>{
    test('200: responds with the article by the article id', ()=>{
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({body})=>{   
        const {articles} = body
        expect(articles.article_id).toBe(1)
        expect(articles).toMatchObject({
        title: expect.any(String),
        topic: expect.any(String),
        article_id: 1,
        author: expect.any(String),
        body: expect.any(String),
        created_at: expect.any(String),
        votes:expect.any(Number),
        article_img_url:
         expect.any(String),

        })
        })
    })
    test("404: responds with an error message for a not found path", ()=>{
        return request(app)
        .get("/api/articles/200")
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe('Article not found')
        })
    })
    test("400: responds with an error message for a bad request", ()=>{
        return request(app)
        .get("/api/articles/nonarticle")
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('Bad request')
        })
    })
})

describe("GET /api",()=>{
    test('200: responds with an object describing all the availbale endpoints on the API', ()=>{
        return request(app)
        .get("/api")
        .expect(200)
        .then(({body})=>{
            const {endpoints} = body
            Object.keys(endpointsValue).forEach((endpointKey)=>{expect(endpoints[endpointKey]).toEqual(endpointsValue[endpointKey])
                
                
                 }) 
             })
            })
            
        })

describe("GET /api/articles", ()=>{
    test('200: responds with an array of article object', ()=>{
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({body})=>{
            const {articles} = body
            expect(articles).toHaveLength(13)
            expect(articles).toBeSortedBy("created_at", {descending:true})
            articles.forEach((article)=>{
                expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(Number)
                })
            })
        })
    })
    test('404: responds with an error message for a not found path', ()=>{
        return request(app)
            .get("/api/article")
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("path not found")
            })
        })
    })


describe("GET /api/articles/:article_id/comments", ()=>{
    test('200: responds with an array of comments for the given article_id', ()=>{
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({body})=>{
            const {comments} = body
            expect(comments).toHaveLength(11)
            expect(comments).toBeSortedBy("created_at")
            comments.forEach((comment)=>{
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    article_id: 1
                })
            })

        })
    })
    test('404: responds with an error message for a not found path', ()=>{ 
        return request(app)
        .get("/api/articles/100/comments")
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe("not found")
        })
    })
    test('200: responds with an empty array if the article_id exists but there are no comments with that article id', ()=>{
        return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({body})=>{
            expect(body.comments).toEqual([])
        })
    })
    test('400: respond with an error message if the article_id is not an number', ()=>{
        return request(app)
        .get("/api/articles/notannumber/comments")
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe("Bad request")
        })
    })

    })

describe('PATCH /api/articles/:article_id', ()=>{
    test('204 : responds with an object of updated article by the article_id', ()=>{
        const newVote = 10
        return request(app)
        .patch('/api/articles/1')
        .send({inc_votes : newVote})
        .expect(200)
        .then(({body})=>{
            const {articles} = body
            expect(articles).toHaveLength(13)
            expect(articles.votes).toBe(110)
            expect(articles).toMatchObject({
                article_id: expect.any(Number),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(Number),
                article_img_url: expect.any(String),
                votes: expect.any(Number)
            })
        })
    })
})
    


