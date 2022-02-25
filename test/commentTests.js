var chai = require('chai')
var chaiHttp = require('chai-http')
var assert = require('assert')
chai.use(chaiHttp)

describe('Comment route tests', () => {
  it('should render answers to a question', (done) => {
    chai
      .request('http://localhost:8089')
      .get('/comment/fdfdffff')
      .end((err, res) => {
        assert.equal(res.status, 200)
        done()
      })
  })
})
