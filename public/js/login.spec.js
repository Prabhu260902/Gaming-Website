const { expect } = require("chai");
const sinon = require("sinon");
const { Getregister, Getlogin, Getlogout, Getchangeprofile, GetleaderBoard, Getprofile } = require("../controllers/authentication");
const score = require("../models/score");
const { getUser } = require("../controllers/helper");



const userScore = {
    'email' : 'example.com',
    'sudokuTime': {},
    'BlockScore': 0,
    'TicTacToe': {},
    'Snake': 0,
    'Chess': {},
    'TotalScore': 0,
}

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


describe('getprofile page',()=>{
    it('showing the leader page with data',async ()=>{
        const req = {
            cookies : {
                jwt : 'exampleJWT'
            }
        };
        const res = {
            status: sinon.spy(),
            render: sinon.spy()
        }
        const user = {email:email};
        const getuser = sinon.stub(getUser,'')

        const findOneStub = sinon.stub(score,'findOne').resolves(userScore) 

        await Getprofile(req,res);

        expect(getuser.calledOnce).to.be.true;
        expect(findOneStub.calledOnceWith({ email: user.email })).to.be.true;
        expect(res.status.calledOnceWith(500)).to.be.false;
        expect(res.render.calledOnceWith('profile', { data: JSON.stringify(userScore) })).to.be.true;

        // Restore stubs
        findOneStub.restore();

    })
})

