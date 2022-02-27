var chai = require('chai')
var chaiHttp = require('chai-http')
var assert = require('assert')
chai.use(chaiHttp)

describe('Answer route tests', () => {
  it('should add an answer to a question', (done) => {
    chai
      .request('http://localhost:8089')
      .post('/answer/fdgd43tvdv')
      .send({
        _user: 'fdfdgsdgdfg',
        _question: 'fdgdsgsggd',
        reply: 'Test reply'
      })
      .end((err, res) => {
        assert.equal(res.status, 200)
        done()
      })
  })
})
