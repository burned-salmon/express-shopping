process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("../app");
let list = require("../fakeDb");


let testItem = { name: "crackers", price: 3.99 };

beforeEach(function () {
  list.push(testItem);
});

afterEach(function () {
  // make sure this *mutates*, not redefines, `list`
  list.length = 0;
});

describe("GET /list", () => {
  test("Get all list items", async () => {
    const res = await request(app).get("/list");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(list);
  })
})

describe("GET /list/:name", () => {
  test("Get list item by name", async () => {
    const res = await request(app).get(`/list/${testItem.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(testItem);
  })
  test("Responds with 404 for invalid list item", async () => {
    const res = await request(app).get(`/list/picklejar`);
    expect(res.statusCode).toBe(404);
  })
})

describe("POST /list", () => {
  test("Creating a list item", async () => {
    const testItemAdd = { name: "chips", price: 2.50 };
    const res = await request(app).post("/list").send(testItemAdd);
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ added: testItemAdd });
  })
  test("Responds with 400 if name is missing", async () => {
    const res = await request(app).post("/list").send({});
    expect(res.statusCode).toBe(400);
  })
})

describe("/PATCH /list/:name", () => {
  test("Updating a list item's name", async () => {
    const res = await request(app).patch(`/list/${testItem.name}`).send({ name: "goldfish" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ updated: { name: "goldfish", price: testItem.price } });
  })
  test("Responds with 404 for invalid name", async () => {
    const res = await request(app).patch(`/list/Piggles`).send({ name: "goldfish" });
    expect(res.statusCode).toBe(404);
  })
})

describe("/DELETE /list/:name", () => {
  test("Deleting a list item", async () => {
    const res = await request(app).delete(`/list/${testItem.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Deleted' })
  })
  test("Responds with 404 for deleting invalid list item", async () => {
    const res = await request(app).delete(`/list/hamface`);
    expect(res.statusCode).toBe(404);
  })
})

