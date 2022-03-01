const expect = require('chai').expect;
const request = require('request');
const { TESTING_URL } = require('../constants/test');

describe ('USER Api', () => {
  describe('LOGIN USER', () => {
    describe('LOGIN USER validation ERROR', () => {
      describe('LOGIN user empty field', () => {
        const logincredentials = {
          username: "",
          password: ""
        }

        it('Status', done => {
          request.post(`${TESTING_URL}/api/login`, {
            json: logincredentials
          }, (_, response) => {
            expect(response.statusCode).to.equal(500)
            done()
          })
        })

        it('Message', done => {
          request.post(`${TESTING_URL}/api/login`, {
            json: logincredentials
          }, (_, response) => {
            //console.log(response);
            expect(response.body.error.message).to.equal(`Invalid Credentials, don't have user with that name`)
            done();
          })
        })
      });

      describe('LOGIN user missing field', () => {
        const withoutPassword = {
          username: "dsvdvsdv"
        }

        const withoutUsername = {
          password: "asdads"
        }

        it('Status without password', done => {
          request.post(`${TESTING_URL}/api/login`, {
            json: withoutPassword
          }, (_, response) => {
            expect(response.statusCode).to.equal(500)
            done()
          })
        })

        it('Status without username', done => {
          request.post(`${TESTING_URL}/api/login`, {
            json: withoutUsername
          }, (_, response) => {
            expect(response.statusCode).to.equal(500)
            done()
          })
        });

        it('Message without password', done => {
          request.post(`${TESTING_URL}/api/login`, {
            json: withoutPassword
          }, (_, response) => {
            //console.log(response);
            expect(response.body.error.message).to.equal(`Please provide a password`);
            done();
          })
        });

        it('Message without username', done => {
          request.post(`${TESTING_URL}/api/login`, {
            json: withoutUsername
          }, (_, response) => {
            //console.log(response);
            expect(response.body.error.message).to.equal(`Please provide an username`);
            done();
          })
        });

      });

    });
  });
})
