var chai = require('chai')
var chaiHttp = require('chai-http')
var assert = require('assert')
chai.use(chaiHttp)

describe('Follow route tests', () => {
  it('should render answers to a question', (done) => {
    chai
      .request('http://localhost:8089')
      .get('/follow/fdfdffff')
      .end((err, res) => {
        assert.equal(res.status, 404)
        done()
      })
  })
})
