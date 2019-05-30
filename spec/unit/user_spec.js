const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;

describe("User", () => {
  beforeEach((done) => {
    sequelize.sync({force: true})
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });
  });

  describe("#create()", () => {
    it("should create a User object with a valid email and password", (done) => {
      User.create({
        username: "CoolCat55",
        email: "user@example.com",
        password: "password"
      })
      .then((user) => {
        expect(user.username).toBe("CoolCat55");
        expect(user.email).toBe("user@example.com");
        expect(user.id).toBe(1);
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    it("should not create a user with an invalid email", (done) => {
      User.create({
        username: "CoolCat55",
        email: "invalid email",
        password: "password"
      })
      .then((user) => {
        //should not execute
        done();
      })
      .catch((err) => {
        expect(err.message).toContain("Validation error: must be a valid email");
        done();
      });
    });

    it("should not create a user with credentials that are already in use", (done) => {
      User.create({
        username: "CoolCat55",
        email: "user@example.com",
        password: "password"
      })
      .then((user) => {
        User.create({
          username: "CoolCat55",
          email: "user@example.com",
          password: "anotherpassword"
        })
        .then((user) => {
          //should not execute
          done();
        })
        .catch((err) => {
          expect(err.message).toContain("Validation error");
          done();
        });
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });

  describe("#upgrade()", () => {
    it("should upgrade a user's role from standard to premium", (done) => {
      User.create({
        username: "CoolCat55",
        email: "user@example.com",
        password: "password"
      })
      .then((user) => {
        user.upgrade() => {
          expect(user.role).toBe(1);
          done();
        }
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });

  describe("#downgrade()", () => {
    it("should downgrade a user's role from premium to standard", (done) => {
      User.create({
        username: "UserDude",
        email: "example@example.com",
        password: "password",
        role: 1
      })
      .then((user) => {
        user.downgrade() => {
          expect(user.role).toBe(0);
          done();
        }
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });
});
