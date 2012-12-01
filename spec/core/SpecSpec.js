describe('Spec', function () {
  var env, suite;
  beforeEach(function() {
    env = new jasmine.Env();
    env.updateInterval = 0;
    suite = new jasmine.Suite(env, 'suite 1');
  });

  describe('initialization', function () {

    it('should raise an error if an env is not passed', function () {
      try {
        new jasmine.Spec();
      }
      catch (e) {
        expect(e.message).toEqual('jasmine.Env() required');
      }
    });

    it('should raise an error if a suite is not passed', function () {
      try {
        new jasmine.Spec(env);
      }
      catch (e) {
        expect(e.message).toEqual('jasmine.Suite() required');
      }
    });

    it('should assign sequential ids for specs belonging to the same env', function () {
      var spec1 = new jasmine.Spec(env, suite);
      var spec2 = new jasmine.Spec(env, suite);
      var spec3 = new jasmine.Spec(env, suite);
      expect(spec1.id).toEqual(0);
      expect(spec2.id).toEqual(1);
      expect(spec3.id).toEqual(2);
    });
  });

  it('getFullName returns suite & spec description', function () {
    var spec = new jasmine.Spec(env, suite, 'spec 1');
    expect(spec.getFullName()).toEqual('suite 1 spec 1.');
  });

  describe('results', function () {
    var spec, results;
    beforeEach(function () {
      spec = new jasmine.Spec(env, suite);
      results = spec.results();
      expect(results.totalCount).toEqual(0);
      spec.runs(function () {
        this.expect(true).toEqual(true);
        this.expect(true).toEqual(true);
      });
    });


    it('results shows the total number of expectations for each spec after execution', function () {
      expect(results.totalCount).toEqual(0);
      spec.execute();
      expect(results.totalCount).toEqual(2);
    });

    it('results shows the number of passed expectations for each spec after execution', function () {
      expect(results.passedCount).toEqual(0);
      spec.execute();
      expect(results.passedCount).toEqual(2);
    });

    it('results shows the number of failed expectations for each spec after execution', function () {
      spec.runs(function () {
        this.expect(true).toEqual(false);
      });
      expect(results.failedCount).toEqual(0);
      spec.execute();
      expect(results.failedCount).toEqual(1);
    });

    describe('results.passed', function () {
      it('is true if all spec expectations pass', function () {
        spec.runs(function () {
          this.expect(true).toEqual(true);
        });
        spec.execute();
        expect(results.passed()).toEqual(true);
      });

      it('is false if one spec expectation fails', function () {
        spec.runs(function () {
          this.expect(true).toEqual(false);
        });
        spec.execute();
        expect(results.passed()).toEqual(false);
      });

      it('a spec with no expectations will return true', function () {
        var specWithoutExpectations = new jasmine.Spec(env, suite);
        specWithoutExpectations.runs(function() {

        });
        specWithoutExpectations.execute();
        expect(results.passed()).toEqual(true);
      });

      it('an unexecuted spec will return true', function () {
        expect(results.passed()).toEqual(true);
      });
    });

    it("includes log messages, which may contain arbitary objects", function() {
      spec.runs(function() {
        this.log("here's some log message", {key: 'value'}, 123);
      });
      spec.execute();
      var items = results.getItems();
      expect(items[0].type).toBe('expect');
      expect(items[1].type).toBe('expect');
      expect(items[2].type).toBe('log');
      var logResult = items[2];
      expect(logResult.values).toEqual(["here's some log message", {key: 'value'}, 123]);
    });
  });
});
describe("Spec (integration)", function() {
  it("reports results for passing tests", function() {
    var resultCallback = jasmine.createSpy('resultCallback'),
    expectationFactory = function(actual, spec) {
      expect(actual).toBe('some-actual');
      return {
        pass: function() {
          spec.addExpectationResult(true);
        }
      }
    },
    spec = new jasmine.Spec2({
      description: 'my test',
      id: 'some-id',
      fn: function() {
        this.expect('some-actual').pass();
      },
      resultCallback: resultCallback,
      expectationFactory: expectationFactory
    });

    spec.execute();

    expect(resultCallback).toHaveBeenCalledWith({
      id: "some-id",
      status: "passed",
      description: "my test",
      failedExpectations: []
    });
  });
  it("reports results for failing tests", function() {
    var resultCallback = jasmine.createSpy('resultCallback'),
    expectationFactory = function(actual, spec) {
      expect(actual).toBe('some-actual');
      return {
        fail: function() {
          spec.addExpectationResult(true);
        }
      }
    },
    spec = new jasmine.Spec2({
      description: 'my test',
      id: 'some-id',
      fn: function() {
        this.expect('some-actual').fail();
      },
      resultCallback: resultCallback,
      expectationFactory: expectationFactory
    });

    spec.execute();

    expect(resultCallback).toHaveBeenCalledWith({
      id: "some-id",
      status: "passed",
      description: "my test",
      failedExpectations: []
    });
  });

  //TODO: test order of befores, spec, after.
  it("executes before fns, after fns", function() {
    var before = jasmine.createSpy('before'),
    after = jasmine.createSpy('after'),
    spec = new jasmine.Spec2({
      fn: function() { },
      beforeFns: [before],
      afterFns: [after],
      resultCallback: function() {}
    });

    spec.execute();

    expect(before).toHaveBeenCalled();
    expect(before.mostRecentCall.object).toBe(spec);

    expect(after).toHaveBeenCalled();
    expect(after.mostRecentCall.object).toBe(spec);
  });
});

describe("Spec (real-ish unit tests)", function() {
  it("status returns null by default", function() {
    var spec = new jasmine.Spec2({});
    expect(spec.status()).toBeNull();
  });
  it("status returns passed if all expectations in the spec have passed", function() {
    var spec = new jasmine.Spec2('description', function() {});
    spec.addExpectationResult(true);
    expect(spec.status()).toBe('passed');
  });
  it("status returns failed if any expectations in the spec have failed", function() {
    var spec = new jasmine.Spec2('description', function() {});
    spec.addExpectationResult(true);
    spec.addExpectationResult(false);
    expect(spec.status()).toBe('failed');
  });

});
