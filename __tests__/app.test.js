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
describe('POST /api/articles/:article_id/comments', ()=>{
    test('201: responds with the newly posted comment to a given article', ()=>{
        const newComment = {username : 'butter_bridge', comment : 'testing comment'}
        return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .expect(201)
        .then(({body})=>{
            const {postedComments} = body
            expect(postedComments.article_id).toBe(1)
            expect(postedComments.body).toBe(newComment.comment)
        })
    })
    test('400')
})

    


