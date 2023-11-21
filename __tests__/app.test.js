const request = require("supertest")
const app = require("../db/app")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const topicData = require("../db/data/test-data")
const topics = require("../db/data/test-data/topics")


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
describe("GET /")

