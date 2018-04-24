import { build } from './interpreter';

describe('interpreter', () => {
  let instance;

  it(`${build.name} should create a new interpreter`, () => {
    expect(build()).not.toBeUndefined();
  });

  describe('instance defaults', () => {
    beforeEach(() => {
      instance = build();
    });

    it('should set a default program', () => {
      const row = new Array(80).fill(' ').join('');
      const program = new Array(25).fill(row).join('\n');
      expect(instance.program).toEqual(program);
    });

    it('should default the instruction pointer to the top left', () => {
      expect(instance.pos).toEqual([0, 0]);
    });

    it('should default to an empty stack', () => {
      expect(instance.stack).toEqual([]);
    });

    it('should pad non-max programs', () => {
      const program = new Array(10).fill('0 0').join('\n');
      const startRows = '0 0' + new Array(77).fill(' ').join('');
      const restRows = new Array(80).fill(' ').join('');
      const expectedProgram = new Array(10)
        .fill(startRows)
        .concat(new Array(15).fill(restRows))
        .join('\n');

      instance = build(program);

      expect(instance.program).toEqual(expectedProgram);
    });

    it('should trim programs that are too large', () => {
      const program = new Array(40).fill(new Array(90).fill('0').join('')).join('\n');
      const expectedProgram = new Array(25).fill(new Array(80).fill('0').join('')).join('\n');
      instance = build(program);
      expect(instance.program).toEqual(expectedProgram);
    });
  });

  describe('tick', () => {
    beforeEach(() => {
      instance = build('0 \n  ');
      instance.tick();
      instance.tick();
    });

    it('should advance the IP', () => {
      expect(instance.pos).toEqual([2, 0]);
    });

    it("should ingest the last position's instruction ", () => {
      expect(instance.stack).toEqual([0]);
    });
  });

  describe('movement', () => {
    it('should wrap the IP when reaching the right of the program space', () => {
      let ct = 78;
      while (ct--) {
        instance.tick();
      }
      expect(instance.pos).toEqual([0, 0]);
    });

    it('should wrap the IP when reaching the bottom of the program space', () => {
      instance = build('v');
      let ct = 26;
      while (ct--) {
        instance.tick();
      }
      expect(instance.pos).toEqual([0, 1]);
    });

    it('should wrap the IP when reaching the left of the program space', () => {
      instance = build('<');
      instance.tick();
      expect(instance.pos).toEqual([79, 0]);
    });

    it('should wrap the IP when reaching the top of the program space', () => {
      instance = build('^');
      instance.tick();
      expect(instance.pos).toEqual([0, 24]);
    });

    it('should move the IP to the right correctly', () => {
      instance = build('v\n>');
      instance.tick();
      instance.tick();
      expect(instance.pos).toEqual([1, 1]);
    });
  });
});
