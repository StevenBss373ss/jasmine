describe("buildSpecResult", function() {

  function fakeSpec(overrides) {
    return jasmine.util.extend({
      passed: jasmine.createSpy(),
      skipped: jasmine.createSpy(),
      getFullName: jasmine.createSpy(),
      getExpectationResults: jasmine.createSpy()
    }, overrides);
  }

  it("contains the id", function() {
    var spec = fakeSpec({ id: 'foo' }),
      result = jasmine.buildSpecResult(spec);

    expect(result.id).toBe('foo');
  });

  it("contains the description", function() {
    var spec = fakeSpec({ description: 'foo' }),
      result = jasmine.buildSpecResult(spec);

    expect(result.description).toBe('foo');
  });

  it("contains the full spec name", function() {
    var spec = fakeSpec({getFullName: function() {
        return 'foo bar spec';
      }}),
      result = jasmine.buildSpecResult(spec);

    expect(result.fullName).toBe('foo bar spec');
  });

  it("status is 'passed' if spec passed", function() {
    var spec = fakeSpec({ passed: function() {
        return true;
      }}),
      result = jasmine.buildSpecResult(spec);

    expect(result.status).toBe('passed');
  });

  it("status is 'failed' if spec failed", function() {
    var spec = fakeSpec({ passed: function() {
        return false;
      }}),
      result = jasmine.buildSpecResult(spec);

    expect(result.status).toBe('failed');
  });

  it("status is 'skipped' if spec was skipped", function() {
    var spec = fakeSpec({
        passed: function() {
          return false;
        },
        skipped: function() {
          return true;
        }
      }),
      result = jasmine.buildSpecResult(spec);

    expect(result.status).toBe('skipped');
  });

  it("returns expectation result messages and stacks", function() {
    var expectationResults = ['some', 'items'],
      spec = fakeSpec({getExpectationResults: function() {
        return expectationResults;
      }}),
      result = jasmine.buildSpecResult(spec);

    expect(result.expectationResults).toBe(expectationResults);
  });

});
