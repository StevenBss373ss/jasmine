//TODO: expectation result may make more sense as a presentation of an expectation.
jasmine.buildSpecResult = function(spec) {
  return {
    id: spec.id,
    status: statusOf(spec),
    fullName: spec.getFullName(),
    expectationResults: spec.getExpectationResults(),
    description: spec.description
  };

  function statusOf(spec) {
    if (spec.skipped()) {
      return 'skipped';
    }

    if (spec.passed()) {
      return 'passed';
    } else {
      return 'failed';
    }
  }

};
