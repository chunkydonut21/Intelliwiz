var chai = require('chai')
var chaiHttp = require('chai-http')
var assert = require('assert')
chai.use(chaiHttp)

describe('User route tests', () => {
  it('should create a user', (done) => {
    chai
      .request('http://localhost:8089')
      .post('/register')
      .send({
        name: 'John Doe',
        email: 'test@john.com',
        password: 'testpass@123',
        confirm_password: 'testpass@123'
      })
      .end((err, res) => {
        assert.equal(res.status, 200)
        done()
      })
  }),
    it('should not register a user', (done) => {
      chai
        .request('http://localhost:8089')
        .post('/')
        .send({
          name: 'John Doe',
          email: 'test@john.com',
          password: 'testpass@123',
          confirm_password: 'testpass@1234'
        })
        .end((err, res) => {
          assert.equal(res.status, 404)
          done()
        })
    })
})
