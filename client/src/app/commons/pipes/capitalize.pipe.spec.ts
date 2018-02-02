import {CapitalizePipe} from "./capitalize.pipe";

describe("CapitalizePipe", () => {

  let pipe: CapitalizePipe;

  beforeEach(() => {
    pipe = new CapitalizePipe();
  });

  it("providing a string returns same string capitalized", () => {
    expect(pipe.transform("some text to be capitalized")).toBe("Some text to be capitalized");
  });

  it("providing no string returns an empty string", () => {
    expect(pipe.transform("")).toBe("");
  });

});
