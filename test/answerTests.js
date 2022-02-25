var chai = require('chai')
var chaiHttp = require('chai-http')
var assert = require('assert')
chai.use(chaiHttp)

describe('Answer route tests', () => {
  it('should render answers to a question', (done) => {
    chai
      .request('http://localhost:8089')
      .get('/answer/fdfdffff')
      .end((err, res) => {
        const data = JSON.parse(res.text)
        assert.equal(res.status, 200)
        done()
      })
  })
})
