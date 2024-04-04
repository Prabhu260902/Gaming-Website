const { expect } = require("chai");
const sinon = require("sinon");
const { Getregister, Getlogin, Getlogout, Getchangeprofile, GetleaderBoard, Postlogin, transporter, Postregister, Postupload } = require("../controllers/authentication");
const proxyquire = require('proxyquire');
require('dotenv').config();
const Score = require('../models/score')
const { User } = require("../models/user");
const bcrypt = require('bcrypt');
const { CreateToken } = require("../controllers/helper");
const fs = require('fs')
const userScore = {'email' : 'example.com','sudokuTime': {},'BlockScore': 0,'TicTacToe': {},'Snake': 0,'Chess': {},'TotalScore': 0,}
const user = { _id: 1,'email' : 'example@123.com', 'name' : 'tester', 'pasword' : 'hash@password'}
const email = 'example.com'

describe("Getregister", () => {
  it('should redirect to "games" if JWT cookie exists', () => {
    const req = {
      cookies: {
        jwt: "exampleJWT",
      },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      redirect: sinon.stub(),
    };
    Getregister(req, res);
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.redirect.calledWith("games")).to.be.true;
  });

  it('should render "register" if JWT cookie does not exist', () => {
    const req = {
      cookies: {},
    };
    const res = {
      status: sinon.stub().returnsThis(),
      render: sinon.stub(),
    };
    Getregister(req, res);
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.render.calledWith("register")).to.be.true;
  });
});


describe("Getlogin", () => {
    it('should redirect to "games" if JWT cookie exists', () => {
        const req = {
          cookies: {
            jwt: "exampleJWT",
          },
        };
        const res = {
          status: sinon.stub().returnsThis(),
          redirect: sinon.stub(),
        };
        Getlogin(req, res);
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.redirect.calledWith("games")).to.be.true;
      });
    
      it('should render "login" if JWT cookie does not exist', () => {
        const req = {
          cookies: {},
        };
        const res = {
          status: sinon.stub().returnsThis(),
          render: sinon.stub(),
        };
        Getlogin(req, res);
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.render.calledWith("login")).to.be.true;
      });
});


describe('logout' , ()=>{
    it('logout from the page',()=>{
        const req = {};
        const res = {
            cookie : sinon.spy(),
            redirect: sinon.spy()
        }
        Getlogout(req,res);
        expect(res.cookie.calledWith('jwt','',{maxAge:1})).to.be.true;
        expect(res.redirect.calledWith('/')).to.be.true;
    })
})


describe('changeProfile',()=>{
    it('change the user profile',()=>{
        const req = {};
        const res = {
            render: sinon.spy()
        }
        Getchangeprofile(req,res);
        expect(res.render.calledWith('changeProfile')).to.be.true;
    })
})


describe('leaderBoard page',()=>{
    it('showing the leader board',()=>{
        const req = {};
        const res = {
            render: sinon.spy()
        }
        GetleaderBoard(req,res);
        expect(res.render.calledWith('leaderBoard')).to.be.true;
    })
})


describe('Getprofile Controller', () => {
    it('should send an error response if getUser callback returns an error', (done) => {
        const req = {};
        const res = {
            status: sinon.stub().returnsThis(),
            send: sinon.stub()
        };

        const getUserStub = sinon.stub().callsFake((req, callback) => {
            callback(new Error('Test error'));
        });

        const authenticationController = proxyquire('../controllers/authentication', {
            './helper': { getUser: getUserStub }
        });

        authenticationController.Getprofile(req, res).then(()=>{
          expect(res.status.calledWith(500)).to.be.true;
          sinon.assert.calledWith(res.send, { error: 'Internal Server Error' });
          done();
        })
    });

    it('should render the profile template with user data', async () => {
        const req = {};
        const res = {
            render: sinon.stub()
        };

        const getUserStub = sinon.stub().callsFake((req, callback) => {
            callback(null, user);
        });

        const ScoreModelStub = {
            findOne: sinon.stub().resolves({email})
        };

        const authenticationController = proxyquire('../controllers/authentication', {
            './helper': { getUser: getUserStub },
            '../models/score' : ScoreModelStub
        });

        await authenticationController.Getprofile(req, res)
        sinon.assert.calledWith(res.render, 'profile', { data: JSON.stringify({email}),USER : JSON.stringify(user) });
        
    });
});


describe('GetTempProfile page', () => {
  it('renders a page with user data and score', (done) => {
    const req = { query:  email };
    const res = {
      render: sinon.stub(),
    };

    const ScoreModelStub = {
      findOne: sinon.stub().resolves({score: userScore }),
    };

    const UserModelStub = {
      findOne: sinon.stub().resolves({name: user }),
    };

    const authController = proxyquire('../controllers/authentication', {
      '../models/score': ScoreModelStub,
      '../models/user': {User : UserModelStub },
    });

    authController.Gettempprofile(req, res).then(()=>{
      sinon.assert.calledWith(
        res.render,
        'tempProfile',
        { data: JSON.stringify({score: userScore }), name: JSON.stringify({name: user }) },
      );
      done();
    })
  });
});


describe('Geting data from the dataBase',()=>{
  it('retriving data from the dataBase', (done) => {
    const req = {};
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    const Data = [{ _id: '1', TotalScore: 100 }, { _id: '2', TotalScore: 90 }];
    const ScoreModelStub = {
      find: sinon.stub().returnsThis(),
      sort: sinon.stub().resolves(Data)
    };

    const authController = proxyquire('../controllers/authentication', {
      '../models/score': ScoreModelStub,
      
    });

    authController.Postgetdata(req, res).then(()=>{
      sinon.assert.calledOnceWithExactly(res.status, 200);
      sinon.assert.calledOnceWithExactly(res.json, Data);
      done();
    })
  });
})


describe('get user profile from s3 bucket',()=>{
  it('should give error when getuser gives an error',(done)=>{
    const req = {}
    const res = {
      status : sinon.stub().returnsThis(),
      send: sinon.stub()
    }

    const getUserStub = sinon.stub().callsFake((req,callback)=>{
      callback(new Error('Test error'));
    })

    const authController = proxyquire('../controllers/authentication',{
      './helper' : {getUser : getUserStub}
    })

    authController.PostgetProfileLogo(req,res).then(()=>{
      sinon.assert.calledWith(res.status,500),
      sinon.assert.calledWith(res.send,{ error: 'Internal Server Error' }),
      done()
    })
  })

  it('should return a signed URL for the user profile', async () => {
    const user = { email: 'test@example.com' };

    const getUserStub = sinon.stub().callsFake((req, callback) => {
      callback(null, user);
    });

    const getSignedUrlStub = sinon.stub().resolves('https://example.com/signed-url');

    const req = {};
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub()
    };

    const authController = proxyquire('../controllers/authentication', {
      './helper': { getUser: getUserStub },
      '@aws-sdk/s3-request-presigner' : {getSignedUrl : getSignedUrlStub}
    });

    await authController.PostgetProfileLogo(req, res);

    // Assertions
    sinon.assert.calledOnce(getUserStub);
    sinon.assert.calledOnce(getSignedUrlStub);
    sinon.assert.calledOnceWithMatch(res.status, 200);
    sinon.assert.calledOnceWithMatch(res.send, { signedUrl: 'https://example.com/signed-url' });
  });
})


describe('testing for post profile function',()=>{
  it('should call error when user is null',(done)=>{
    const req = {}
    const res = {
      status : sinon.stub().returnsThis(),
      send: sinon.stub()
    }

    const getUserStub = sinon.stub().callsFake((req,callback)=>{
      callback(new Error('Test error'));
    })

    const authController = proxyquire('../controllers/authentication',{
      './helper' : {getUser : getUserStub}
    })

    authController.Postprofile(req,res).then(()=>{
      sinon.assert.calledWith(res.status,500),
      sinon.assert.calledWith(res.send,{ error: 'Internal Server Error' }),
      done()
    })
  })

  it('should render the profile page with user data', async () => {
    const user = { email: 'test@example.com' };
    const getUserStub = sinon.stub().callsFake((req, callback) => {
      callback(null, user);
    });

    const userData = { name: 'Test User', email: 'test@example.com' };
    const findOneStub = sinon.stub(Score, 'findOne').resolves(userData);

    const req = {};
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };

    const controller = proxyquire('../controllers/authentication', {
      './helper': { getUser: getUserStub }
    });
    await controller.Postprofile(req, res);

    sinon.assert.calledOnce(getUserStub);
    sinon.assert.calledOnce(findOneStub);
    sinon.assert.calledOnceWithMatch(res.status, 200);
    sinon.assert.calledOnceWithMatch(res.json, userData);
  });
})


describe('testing for post upload function',()=>{
  it('should return error when user is null',async ()=>{
    const req = {}
    const res = {
      status : sinon.stub().returnsThis(),
      send: sinon.stub()
    }

    const getUserStub = sinon.stub().callsFake((req,callback)=>{
      callback(new Error('Test error'));
    })

    const authController = proxyquire('../controllers/authentication',{
      './helper' : {getUser : getUserStub}
    })

    await authController.Postupload(req,res) 
    sinon.assert.calledWith(res.status,500);
    sinon.assert.calledWith(res.send,{ error: 'Internal Server Error' });
    
  })


  it('should return error when req file is not present',async ()=>{
    const req = {}
    const res = {
      send: sinon.stub().returnsThis()
    }
    const user = {email:'test@123.com'}
    const getUserStub = sinon.stub().callsFake((req,callback)=>{
      callback(null,user);
    })

    const authController = proxyquire('../controllers/authentication',{
      './helper' : {getUser : getUserStub}
    })

    await authController.Postupload(req,res) 
    sinon.assert.calledWith(res.send,{ success: false,error: 'Invalid file' });
    
  })

  it('should return error when req file is not present',async ()=>{
    const req = { file:'test.txt' }
    const res = {
      send: sinon.stub().returnsThis()
    }
    const user = {email:'test@123.com'}
    const getUserStub = sinon.stub().callsFake((req,callback)=>{
      callback(null,user);
    })

    const authController = proxyquire('../controllers/authentication',{
      './helper' : {getUser : getUserStub}
    })

    await authController.Postupload(req,res) 
    sinon.assert.calledWith(res.send,{ success: false,error: 'Invalid file' });
    
  })


  it('should upload image on s3 bucket amd redirect to games page',async ()=>{
    const req = { file : {buffer : 'test.txt'}}
    const res = {
      redirect: sinon.spy()
    }
    const user = {email:'test@123.com'}
    const getUserStub = sinon.stub().callsFake((req,callback)=>{
      callback(null,user);
    })
    const UploadStub = sinon.stub().returns({
      done: sinon.stub().resolves()
    });
    const authController = proxyquire('../controllers/authentication',{
      './helper' : {getUser : getUserStub},
      '@aws-sdk/lib-storage' : {Upload : UploadStub}
    })

    await authController.Postupload(req,res) 
    sinon.assert.calledWith(res.redirect,'/games');
    
  })
})


describe('Postlogin function', () => {
  it('should handle error during login', async () => {
    const req = {
      body: {email : 'test@123.com' , username : 'tester' , password : 'password' , val : 1}
    }
    const res = {
      status : sinon.stub().returnsThis(),
      json : sinon.stub()
    }
    const errors = 'testing error'
    const loginStub = sinon.stub(User,'login').throws(new Error('error'))
    const handleErrorsStub = sinon.stub().returns(errors)
    const authcontrollers = proxyquire('../controllers/authentication',{
      './helper' : {handleErrors : handleErrorsStub},
    })

    authcontrollers.Postlogin(req,res);
    sinon.assert.calledWith(res.status,400);
    sinon.assert.calledWith(res.json,{errors});
    sinon.restore()
  });

  it('should login user and send welcome email', async () => {
    const req = {
      body: {
        email: 'test@example.com',
        password: 'password123'
      }
    };
    const res = {
      status: sinon.stub().returnsThis(),
      cookie: sinon.stub(),
      json: sinon.stub(),
    };
    const user = { _id: 'user_id' };
    const loginStub = sinon.stub(User,'login').resolves(user);
    const createTokenStub = sinon.stub().returns('jwt_token');
    const sendMailStub = sinon.stub().callsArgWith(1, null, {});

    const authController = proxyquire('../controllers/authentication', {
      'nodemailer': { createTransport: () => ({ sendMail: sendMailStub }) },
      './helper': { CreateToken: createTokenStub }
    });
    
    await authController.Postlogin(req, res);

    sinon.assert.calledWith(loginStub, req.body.email, req.body.password);
    sinon.assert.calledWith(createTokenStub, 'user_id');
    sinon.assert.calledWith(res.cookie, 'jwt', 'jwt_token', { httpOnly: true, maxAge:24*60*60*1000 });
    sinon.assert.calledWith(sendMailStub, sinon.match.object, sinon.match.func);
    sinon.assert.calledWith(res.status, 201);
    sinon.assert.calledWith(res.json, { user: 'user_id' });

    sinon.restore()
  });

  it('should respond to error when sendmail gives an error(EAUTH)', async () => {
    const req = {
      body: {
        email: 'test@example.com',
        password: 'password123'
      }
    };
    const res = {
      status: sinon.stub().returnsThis(),
      cookie: sinon.stub(),
      send: sinon.stub(),
    };
    const error = { code : 'EAUTH' }
    const user = { _id: 'user_id' };
    const loginStub = sinon.stub(User,'login').resolves(user);
    const createTokenStub = sinon.stub().returns('jwt_token');
    const sendMailStub = sinon.stub().callsArgWith(1, error, {});

    const authController = proxyquire('../controllers/authentication', {
      'nodemailer': { createTransport: () => ({ sendMail: sendMailStub }) },
      './helper': { CreateToken: createTokenStub }
    });

    
    await authController.Postlogin(req, res);

    sinon.assert.calledWith(loginStub, req.body.email, req.body.password);
    sinon.assert.calledWith(createTokenStub, 'user_id');
    sinon.assert.calledWith(res.cookie, 'jwt', 'jwt_token', { httpOnly: true, maxAge:24*60*60*1000 });
    sinon.assert.calledWith(sendMailStub, sinon.match.object, sinon.match.func);
    sinon.assert.calledWith(res.status, 401);
    sinon.assert.calledWith(res.send, error);

    sinon.restore();
  });

  it('should respond to error when sendmail gives an error other then EAUTH', async () => {
    const req = {
      body: {
        email: 'test@example.com',
        password: 'password123'
      }
    };
    const res = {
      status: sinon.stub().returnsThis(),
      cookie: sinon.stub(),
      send: sinon.stub(),
    };
    const error = 'Email not sended';
    const user = { _id: 'user_id' };
    const loginStub = sinon.stub(User,'login').resolves(user);
    const createTokenStub = sinon.stub().returns('jwt_token');
    const sendMailStub = sinon.stub().callsArgWith(1, error, {});

    const authController = proxyquire('../controllers/authentication', {
      'nodemailer': { createTransport: () => ({ sendMail: sendMailStub }) },
      './helper': { CreateToken: createTokenStub }
    });

    
    await authController.Postlogin(req, res);

    sinon.assert.calledWith(loginStub, req.body.email, req.body.password);
    sinon.assert.calledWith(createTokenStub, 'user_id');
    sinon.assert.calledWith(res.cookie, 'jwt', 'jwt_token', { httpOnly: true, maxAge:24*60*60*1000 });
    sinon.assert.calledWith(sendMailStub, sinon.match.object, sinon.match.func);
    sinon.assert.calledWith(res.status, 500);
    sinon.assert.calledWith(res.send, 'Failed to send email');
    sinon.restore();
  });


});


describe('Post register',()=>{
  it('sending otp to the user', ()=>{
    const req = {
      body: {email : 'test@123.com' , username : 'tester' , password : 'password' , val : 1}
    }
    const res = {
      status : sinon.stub().returnsThis(),
      json : sinon.stub()
    }
    const otp = 123456;
    const generateRandomCodeStub = sinon.stub().returns(otp);
    const sendMailStub = sinon.stub().callsArgWith(1,null,{});
    const authcontrollers = proxyquire('../controllers/authentication',{
      './helper' : {generateRandomCode : generateRandomCodeStub},
      'nodemailer' : {createTransport: () => ({sendMail : sendMailStub})}
    })

    authcontrollers.Postregister(req,res);
    sinon.assert.calledWith(res.status,201);
    sinon.assert.calledWith(res.json,{otp:otp});
  })

  it('should handle error while sending otp to the user(error : EAUTH)', ()=>{
    const req = {
      body: {email : 'test@123.com' , username : 'tester' , password : 'password' , val : 1}
    }
    const res = {
      status : sinon.stub().returnsThis(),
      send : sinon.stub()
    }
    const otp = 123456;
    const error = {code : "EAUTH"}
    const generateRandomCodeStub = sinon.stub().returns(otp);
    const sendMailStub = sinon.stub().callsArgWith(1,error,{});
    const authcontrollers = proxyquire('../controllers/authentication',{
      './helper' : {generateRandomCode : generateRandomCodeStub},
      'nodemailer' : {createTransport: () => ({sendMail : sendMailStub})}
    })

    authcontrollers.Postregister(req,res);
    sinon.assert.calledWith(res.status,401);
    sinon.assert.calledWith(res.send,error);
  })

  it('should handle error while sending otp to the user', ()=>{
    const req = {
      body: {email : 'test@123.com' , username : 'tester' , password : 'password' , val : 1}
    }
    const res = {
      status : sinon.stub().returnsThis(),
      send : sinon.stub()
    }
    const otp = 123456;
    const error = 'Error';
    const generateRandomCodeStub = sinon.stub().returns(otp);
    const sendMailStub = sinon.stub().callsArgWith(1,error,{});
    const authcontrollers = proxyquire('../controllers/authentication',{
      './helper' : {generateRandomCode : generateRandomCodeStub},
      'nodemailer' : {createTransport: () => ({sendMail : sendMailStub})}
    })

    authcontrollers.Postregister(req,res);
    sinon.assert.calledWith(res.status,500);
    sinon.assert.calledWith(res.send,'Failed to send email');
  })

  it('should handle error when trying to register', ()=>{
    const req = {
      body: {email : 'test@123.com' , username : 'tester' , password : 'password' , val : 1}
    }
    const res = {
      status : sinon.stub().returnsThis(),
      json : sinon.stub()
    }
    const errors = 'testing error'

    const generateRandomCodeStub = sinon.stub().throws(new Error('error'));
    const handleErrorsStub = sinon.stub().returns(errors)
    const authcontrollers = proxyquire('../controllers/authentication',{
      './helper' : {generateRandomCode : generateRandomCodeStub , handleErrors : handleErrorsStub},
    })

    authcontrollers.Postregister(req,res);
    sinon.assert.calledWith(res.status,400);
    sinon.assert.calledWith(res.json,{errors});
  })

  it('should bcrypt password and store',async ()=>{
    const req = {
      body: {email : 'test@123.com' , username : 'tester' , password : 'password' , val : 0}
    }
    const res = {
      status : sinon.stub().returnsThis(),
      cookie : sinon.spy(),
      json : sinon.stub()
    }
    const token = 'testtoken'
    const user = { _id: 'user_id' };
    const CreateTokenStub = sinon.stub().returns(token);
    const saltStub = sinon.stub(bcrypt,'genSalt').resolves('salt');
    const hashStub = sinon.stub(bcrypt,'hash').resolves('hashedPassword');
    const userStub = sinon.stub(User,'create').resolves(user);
    const scoreStub = sinon.stub(Score,'create').resolves(user);

    const authController = proxyquire('../controllers/authentication',{
      './helper' : {CreateToken : CreateTokenStub}
    })

    await authController.Postregister(req,res);

    sinon.assert.calledOnce(saltStub); 
    sinon.assert.calledWith(hashStub, req.body.password, 'salt'); 
    sinon.assert.calledOnce(userStub); 
    sinon.assert.calledOnce(scoreStub); 
    sinon.assert.calledWith(res.cookie, 'jwt', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); 
    sinon.restore()
  })

  it('should handle error when readfile gives an error',async ()=>{
    const req = {
      body: {email : 'test@123.com' , username : 'tester' , password : 'password' , val : 0}
    }
    const res = {
      status : sinon.stub().returnsThis(),
      cookie : sinon.spy(),
      send : sinon.stub()
    }
    const token = 'testtoken'
    const user = { _id: 'user_id' };
    const CreateTokenStub = sinon.stub().returns(token);
    const saltStub = sinon.stub(bcrypt,'genSalt').resolves('salt');
    const hashStub = sinon.stub(bcrypt,'hash').resolves('hashedPassword');
    const userStub = sinon.stub(User,'create').resolves(user);
    const scoreStub = sinon.stub(Score,'create').resolves(user);
    sinon.stub(fs,'readFile').yields(2,null,user)

    const authController = proxyquire('../controllers/authentication',{
      './helper' : {CreateToken : CreateTokenStub}
    })

    await authController.Postregister(req,res);
  
    sinon.assert.calledWith(res.status, 500); 
    sinon.assert.calledWith(res.send, { success: false, error: 'Error reading static image file' }); 
    sinon.restore()
  })


})
