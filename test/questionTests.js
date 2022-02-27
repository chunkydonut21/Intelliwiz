var chai = require('chai')
var chaiHttp = require('chai-http')
var assert = require('assert')
chai.use(chaiHttp)

describe('Question route tests', () => {
  it('should render Ask a question page', (done) => {
    chai
      .request('http://localhost:8089')
      .get('/question/create')
      .end((err, res) => {
        assert.equal(res.status, 200)
        done()
      })
  }),
    it('should render list of all question page', (done) => {
      chai
        .request('http://localhost:8089')
        .get('/')
        .end((err, res) => {
          assert.equal(res.status, 200)
          done()
        })
    }),
    it('should throw an error when trying to find a question by passing the incorrect ID', (done) => {
      chai
        .request('http://localhost:8089')
        .get('/question/3546fsgdvfv')
        .end((err, res) => {
          assert.equal(res.status, 404)
          done()
        })
    })
})
