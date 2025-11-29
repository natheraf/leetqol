const buttons = {
  getSubmitButton: () =>
    document
      .evaluate(
        "//span[text()='Submit']",
        document,
        null,
        XPathResult.ANY_TYPE,
        null
      )
      .iterateNext().parentElement,
};
