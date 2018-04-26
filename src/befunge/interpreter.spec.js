import { build } from './interpreter';

describe('interpreter', () => {
  let instance;

  function tickTillQuit(program) {
    instance = build(program);
    let counter = 0;
    while (!instance.ended) {
      instance.tick();
      counter++;
      if (counter >= 100) {
        throw new Error('Program failed to quit after 100 ticks');
      }
    }
    return instance;
  }

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

    it('should default to not ended', () => {
      expect(instance.ended).toBe(false);
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

  describe('operator', () => {
    it('@ should end the program', () => {
      instance = build('@');
      instance.tick();
      expect(instance.ended).toBe(true);
      expect(instance.pos).toEqual([0, 0]);
    });

    it('+ should add the top two numbers on the stack', () => {
      expect(tickTillQuit('13+@').stack).toEqual([4]);
    });

    it('- should subtract the top number in the stack from the next', () => {
      expect(tickTillQuit('35-14--@').stack).toEqual([1]);
    });

    it('* should multiply the top two values', () => {
      expect(tickTillQuit('79*@').stack).toEqual([63]);
    });

    describe('/', () => {
      it('should divide the top number in the stack by the next', () => {
        expect(tickTillQuit('82/@').stack).toEqual([4]);
      });

      it('should round down positive results', () => {
        expect(tickTillQuit('94/@').stack).toEqual([2]);
      });

      it('should round up negative numbers', () => {
        expect(tickTillQuit('09-4/@').stack).toEqual([-2]);
      });
    });

    describe('!', () => {
      it('should replace a 0 on the top of the stack with a 1', () => {
        expect(tickTillQuit('0!@').stack).toEqual([1]);
      });

      it('should replace the top of the stack with 0 if positive', () => {
        expect(tickTillQuit('1!@').stack).toEqual([0]);
      });

      it('should replace the top of the stack with 0 if negative', () => {
        expect(tickTillQuit('14-!@').stack).toEqual([0]);
      });
    });

    describe('`', () => {
      it('should push 1 if the top of the stack is smaller than the next', () => {
        expect(tickTillQuit('21`@').stack).toEqual([1]);
      });

      it('should push 0 if the top of the stack is greater than the next', () => {
        expect(tickTillQuit('12`@').stack).toEqual([0]);
      });

      it('should push 0 if the top of the stack is equal than the next', () => {
        expect(tickTillQuit('22`@').stack).toEqual([0]);
      });
    });

    it(': should duplicate the top value in the stack', () => {
      expect(tickTillQuit('9:@').stack).toEqual([9, 9]);
    });

    it('\\ should swap the top two values', () => {
      expect(tickTillQuit('42\\@').stack).toEqual([2, 4]);
    });

    it('$ should pop the stack', () => {
      expect(tickTillQuit('123$@').stack).toEqual([1, 2]);
    });

    it('. should add the int value of the top of the stack to the output', () => {
      expect(tickTillQuit('99*.@').output).toBe('81');
    });

    it(', should add the ASCII representation at the top of the stack to the output', () => {
      expect(tickTillQuit('25*62**,@').output).toBe('x');
    });

    it('# should skip the next instruction', () => {
      expect(tickTillQuit('#12@').stack).toEqual([2]);
    });

    it('g should push the value at the coordinates specified by the top two numbers in the stack', () => {
      expect(tickTillQuit('40g@7').stack).toEqual([7]);
    });

    it('p should put the 3rd stack value into the program at the coordinates specified by the top two numbers', () => {
      expect(tickTillQuit('650p@').program.substring(0, 6)).toBe('650p@6');
    });

    it('" should begin and end string mode', () => {
      expect(tickTillQuit('"hello@"@').stack).toEqual(['h', 'e', 'l', 'l', 'o', '@']);
    });

    it('? should send the PI in a random direction', () => {
      const mockMath = Object.create(global.Math);
      mockMath.random = () => 1;
      global.Math = mockMath;
      expect(tickTillQuit('?\n@').pos).toEqual([0, 1]);
    });

    describe('_', () => {
      it('should move the PI right if the top of the stack is 0', () => {
        expect(tickTillQuit('v _@\n>0^').pos).toEqual([3, 0]);
      });

      it('should move the PI left if the top of the stack is non zero', () => {
        expect(tickTillQuit('v@_\n>9^').pos).toEqual([1, 0]);
      });
    });

    describe('|', () => {
      it('should move the PI down if the top of the stack is 0', () => {
        expect(tickTillQuit('0|\n @').pos).toEqual([1, 1]);
      });

      it('should move the PI up if the top of the stack is non zero', () => {
        expect(tickTillQuit('v @\n>1|').pos).toEqual([2, 0]);
      });
    });
  });
});
