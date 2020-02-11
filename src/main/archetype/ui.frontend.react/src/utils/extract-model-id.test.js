import extractModelId from './extract-model-id';

describe('Utils ->', () => {
  const CONTENT_PATH = '/content/test/cq/jcr:content/path';
  const CONTENT_PATH_CONVERTED = '_content_test_cq_jcr_content_path';

  describe('extractModelId ->', () => {
    it('should convert not fail', () => {
      expect(extractModelId()).toBeUndefined();
    });

    it('should convert the given path into an id', () => {
      expect(extractModelId(CONTENT_PATH)).toBe(CONTENT_PATH_CONVERTED);
    });
  });
});
