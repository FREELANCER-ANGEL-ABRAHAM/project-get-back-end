const expect = require('chai').expect;
const Link = require('../src/models/Links');
const Logo = require('../src/models/Logo');
const {login, validateLink, createLogo, updateLink, deleteLink, changePassword} = require('./provider');

describe('USER', () => {
  describe('LOGIN USER validation ERROR', () => {
    describe('LOGIN user empty field', () => {
      const logincredentials = {
        username: "",
        password: ""
      }
      it('Message', done => {
        const response = login(logincredentials);
        expect(response).to.equal('Thats fields must be completed');
        done();
      })
    })

    describe('LOGIN user missing field', () => {
      it('Status without username', done => {
        var lgoinData = { password: ''};
        const response = login(lgoinData);
        expect(response).to.equal('Please provide a username');
        done();
      })
      it('Status without password', done => {
        var dataWithoutPassword = { username: '' };
        const response = login(dataWithoutPassword);
        expect(response).to.equal('Please provide a password');
        done();
      })
    });

  });

  describe('LOGIN user successfully data', () => {
    const data = {username: 'testing', password: process.pasword_test1}
    it('Successfully login', done => {
      const res = login(data);
      expect(res).to.equal('Login Successfully');
      done();
    })
  });

  describe('CHANGE PASSWORD', () => {
    it('Error validate provide fields (Username)', done => {
      const data = {username: 'testing'}
      const newPassword = process.newPassword_Test;
      const res = changePassword(data, newPassword);
      expect(res).to.equal('Please provide all fields');
      done();
    })

    it('Error validate provide fields(Password)', done => {
      const data = {password: process.field_provide_Password}
      const newPassword = 'ps134143111fdmv';
      const res = changePassword(data, newPassword);
      expect(res).to.equal('Please provide all fields');
      done();
    })

    it('Error validate empty fields(username)', done => {
      const data = {username: '', password: process.field_empty_password}
      const newPassword = process.newPassword_Test2;
      const res = changePassword(data, newPassword);
      expect(res).to.equal('This field must be completed');
      done();
    })

    it('Error validate empty fields(password)', done => {
      const data = {username: 'dsvdsv', password: ''}
      const newPassword = process.newPassword_Test3;
      const res = changePassword(data, newPassword);
      expect(res).to.equal('This field must be completed');
      done();
    })

    it('Error validate provide a new password', done => {
      const data = {username: 'dsvdsv', password: process.field_provide_Password2}
      const res = changePassword(data);
      expect(res).to.equal('Please provide a new password');
      done();
    })

    it('Error validate empty data to new password', done => {
      const data = {username: 'dsvdsv', password: process.field_provide_Password3}
      const newPassword = ''
      const res = changePassword(data, newPassword);
      expect(res).to.equal('Please complete a new password');
      done();
    })

    it('Successfully password change', done => {
      const data = {username: 'testing', password: process.field_provide_Password4}
      const newPassword = process.newPassword_Test4;
      const res = changePassword(data, newPassword);
      expect(res).to.equal('Update password successfully');
      done();
    })
  });
});

describe('Links', () => {
  describe('CREATE A LINK', () => {
    describe('LINK VALIDATION ERROR', () => {
      it('Error missing fields', done => {
        var linkDataError = {
          name: "",
          description: "",
          btn_name: "",
          url: "",
          image: "",
          visibility: "",
          detail_result: "",
          contain_result: ""
        }
        const response = validateLink(linkDataError);
        expect(response).to.equal('Please provide all fields');
        done();
      });

      it('Error empty data fields', done => {
        var linkDataError = {
          name: "",
          title: "",
          description: "",
          btn_name: "",
          url: "",
          image: "",
          visibility: "",
          status: "",
          detail_result: "",
          contain_result: ""
        }
        const response = validateLink(linkDataError);
        expect(response).to.equal('Please complete all fields');
        done();
      });

      it('Error data validate status field', done => {
        var linkDataError = {
          name: "bsf",
          title: "fsbbsb",
          description: "sfbsb",
          btn_name: "sfbsb",
          url: "sfbfs",
          image: "sfbs.png",
          visibility: "visible",
          status: "actisssve",
          detail_result: "sdv",
          contain_result: "1344"
        }
        const response = validateLink(linkDataError);
        expect(response).to.equal('Wrong data for status field');
        done();
      });

      it('Error data validate visibility field', done => {
        var linkDataError = {
          name: "bsf",
          title: "fsbbsb",
          description: "sfbsb",
          btn_name: "sfbsb",
          url: "sfbfs",
          image: "sfbs.png",
          visibility: "vmvpsdov",
          status: "active",
          detail_result: "sdv",
          contain_result: "1344"
        }
        const response = validateLink(linkDataError);
        expect(response).to.equal('Wrong data for visibility field');
        done();
      });
    });

    describe('SUCCESSFULLY LINK', () => {
      it('Successfully create link', done => {
        const linkData = {
          name: "bsf",
          title: "fsbbsb",
          description: "sfbsb",
          btn_name: "sfbsb",
          url: "sfbfs",
          image: "sfbs.png",
          visibility: "visible",
          status: "active",
          detail_result: "sdv",
          contain_result: "1344"
        }
        const response = validateLink(linkData);
        expect(response).to.equal('pass');
        const newLink = new Link(linkData)
        expect(newLink._doc.name).to.equal(linkData.name);
        expect(newLink._doc.title).to.equal(linkData.title);
        expect(newLink._doc.description).to.equal(linkData.description);
        expect(newLink._doc.btn_name).to.equal(linkData.btn_name);
        expect(newLink._doc.url).to.equal(linkData.url);
        expect(newLink._doc.image).to.equal(linkData.image);
        expect(newLink._doc.visibility).to.equal(linkData.visibility);
        expect(newLink._doc.status).to.equal(linkData.status);
        expect(newLink._doc.detail_result).to.equal(linkData.detail_result);
        expect(newLink._doc.contain_result).to.equal(linkData.contain_result);
        done();
      });
    });

  });

  describe('MODIFY A LINK', () => {
    describe('LINK VALIDATION UPDATE ERROR', () => {
      it('Error data id field', done => {
        var linkDataError = {
          name: "bsf",
          title: "fsbbsb",
          description: "sfbsb",
          btn_name: "sfbsb",
          url: "sfbfs",
          image: "sfbs.png",
          visibility: "visible",
          status: "actisssve",
          detail_result: "sdv",
          contain_result: "1344"
        }
        const res = updateLink(linkDataError);
        expect(res).to.equal('Please provide an id');
        done();
      })

      it('Wrong id provider', done => {
        var linkDataError = {
          id: "0923232s3db",
          name: "bsf",
          title: "fsbbsb",
          description: "sfbsb",
          btn_name: "sfbsb",
          url: "sfbfs",
          image: "sfbs.png",
          visibility: "visible",
          status: "active",
          detail_result: "sdv",
          contain_result: "1344"
        };
        var chanceData = {id: "09232323db", name: "sadsasd" };
        const res = updateLink(linkDataError,chanceData);
        expect(res).to.equal('Wrong id provider');
        done();
      });

      it('Error data validate status field', done => {
        var linkDataError = {
          id: "2144f2f",
          name: "bsf",
          title: "fsbbsb",
          description: "sfbsb",
          btn_name: "sfbsb",
          url: "sfbfs",
          image: "sfbs.png",
          visibility: "visible",
          status: "actisssve",
          detail_result: "sdv",
          contain_result: "1344"
        }
        const response = updateLink(linkDataError);
        expect(response).to.equal('Wrong data for status field');
        done();
      });

      it('Error data validate visibility field', done => {
        var linkDataError = {
          id: "2144f2f",
          name: "bsf",
          title: "fsbbsb",
          description: "sfbsb",
          btn_name: "sfbsb",
          url: "sfbfs",
          image: "sfbs.png",
          visibility: "vmvpsdov",
          status: "active",
          detail_result: "sdv",
          contain_result: "1344"
        }
        const response = updateLink(linkDataError);
        expect(response).to.equal('Wrong data for visibility field');
        done();
      });

    });

    describe('LINK SUCCESSFULLY UPDATE', () => {
      it('Successfully update', done => {
        var linkdata = {
          id: "2144f2f",
          name: "bsfvdvdsv",
          title: "pppvsvm",
          visibility: "visible",
          status: "disable",
        }
        var newData = {
          id: "2144f2f",
          name: "Juan Test",
        }
        const response = updateLink(linkdata, newData);
        expect(response).to.equal('successfully update');
        done();
      });
    })

  });

  describe('DELETE A LINK', () => {
    describe('DELETE VALIDATION ERROR', () => {
      it('LINK VALIDATION ID ERROR', done => {
        var linkdata = {
          name: "bsfvdvds"
        }
        const res = deleteLink(linkdata);
        expect(res).to.equal('Please provide an id');
        done();
      })

      it('LINK SUCCESSFULLY DELETED', done => {
        var linkdata = {
          id: "2144f2f",
          name: "bsfvdvds"
        }
        const res = deleteLink(linkdata);
        expect(res).to.equal('Deleted sucessfully link');
        done();
      })
    });
  })
})


describe('LOGO', () => {
  describe('CREATE LOGO', () => {
    describe('LOGO VALIDATION ERROR', () => {
      it('ERROR STATUS', done => {
        const newLogo = {image: 'vdvs.jpg', status: 'asac'};
        const res = createLogo(newLogo);

        expect(res).to.equal('Wrong data for status field');
        done();
      });

      it('ERROR IMAGE PROVIDE', done => {
        const newLogo = {status: 'active'};
        const res = createLogo(newLogo);

        expect(res).to.equal('Please provide an image');
        done();
      })
    })
    describe('LOGO CREATE SUCCESSFULL', () => {
      it('CREATE SUCCESSFULLY', done => {
        const newLogo = {image: 'asdsa.png', status: 'active'};
        const res = createLogo(newLogo);
        expect(res).to.equal('Created sucessfully link');
        const logoCreate = new Logo(newLogo);
        expect(logoCreate._doc.image).to.equal(newLogo.image);
        expect(logoCreate._doc.status).to.equal(newLogo.status);
        done();
      })
    })
  })
})
