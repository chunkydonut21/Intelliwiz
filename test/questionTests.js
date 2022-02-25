var chai = require('chai')
var chaiHttp = require('chai-http')
var assert = require('assert')
chai.use(chaiHttp)

describe('Question route tests', () => {
  it('should render Ask a question page', (done) => {
    chai
      .request('http://localhost:8089')
      .get('/que/ask')
      .end((err, res) => {
        assert.equal(res.status, 200)
        done()
      })
  }),
    it('should render list of all question page', (done) => {
      chai
        .request('http://localhost:8089')
        .get('/que/list')
        .end((err, res) => {
          assert.equal(res.status, 200)
          done()
        })
    }),
    it('should render a single question page', (done) => {
      chai
        .request('http://localhost:8089')
        .get('/que/ask/fdd')
        .end((err, res) => {
          assert.equal(res.status, 200)
          done()
        })
    })
})
