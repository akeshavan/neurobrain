/* global describe, it, before */

import chai from 'chai';
import { Viewer } from '../lib/neurobrain';

chai.expect();

const expect = chai.expect;

let lib;

describe('Given an instance of my Viewer library', () => {
  before(() => {
    lib = new Viewer('test');
  });
  describe('when I need the name', () => {
    it('should return the name', () => {
      expect(lib.name).to.be.equal('test');
    });
  });
});
