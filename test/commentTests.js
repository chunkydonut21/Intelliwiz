var chai = require('chai')
var chaiHttp = require('chai-http')
var assert = require('assert')
chai.use(chaiHttp)

describe('Comment route tests', () => {
  it('should fetch a list of comments', (done) => {
    chai
      .request('http://localhost:8089')
      .get('/comment/621b4d33b31880dabc69dac9')
      .end((err, res) => {
        assert.equal(res.status, 200)
        done()
      })
  })
})
